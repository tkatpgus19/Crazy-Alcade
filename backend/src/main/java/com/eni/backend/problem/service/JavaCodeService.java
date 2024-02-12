package com.eni.backend.problem.service;

import com.eni.backend.auth.jwt.JwtTokenProvider;
import com.eni.backend.common.exception.CustomBadRequestException;
import com.eni.backend.common.exception.CustomServerErrorException;
import com.eni.backend.member.dto.SecurityMemberDto;
import com.eni.backend.member.entity.Language;
import com.eni.backend.member.entity.Member;
import com.eni.backend.member.repository.MemberRepository;
import com.eni.backend.problem.dto.response.CodeExecuteDto;
import com.eni.backend.problem.dto.response.CodeExecuteResponse;
import com.eni.backend.problem.dto.response.CodeSubmitResponse;
import com.eni.backend.problem.entity.Code;
import com.eni.backend.problem.entity.CodeStatus;
import com.eni.backend.problem.entity.Problem;
import com.eni.backend.problem.entity.Testcase;
import com.eni.backend.problem.repository.CodeRepository;
import com.eni.backend.problem.repository.TestcaseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.util.*;
import java.util.concurrent.TimeUnit;

import static com.eni.backend.common.response.BaseResponseStatus.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class JavaCodeService {

    @Value("${code.base-path}")
    private String BASE_PATH;

    private final CodeRepository codeRepository;
    private final TestcaseRepository testcaseRepository;
    private final MemberRepository memberRepository;

    private final JwtTokenProvider jwtTokenProvider;

    private long resultTime = Long.MAX_VALUE;
    private long resultMemory = Long.MAX_VALUE;
    
    @Transactional
    public Object judge(Authentication authentication, Problem problem, String code, Boolean isHidden) throws IOException, InterruptedException {
        // 멤버
        Member member = findMemberByAuth(authentication);

        // 파일을 저장할 디렉토리 생성
        UUID uuid = UUID.randomUUID();
        String dirPath = createDirectory(uuid);

        // 컴파일 에러
        if (!compile(dirPath, code)) {
            log.info("컴파일 에러");

            // 채점
            if (isHidden) {

            }

            // 실행
            return CodeExecuteResponse.of(CodeStatus.COMPILE_ERROR, null);
        }

        log.info("컴파일 성공");

        CodeStatus codeStatus = CodeStatus.SUCCESS;
        List<Object> tcResults = new ArrayList<>();
        List<Testcase> testcases;

        // 채점
        if (isHidden) {
            testcases = testcaseRepository.findAllByProblemId(problem.getId());
            CodeSubmitResponse response;

            // 각 테스트케이스 별 실행 결과
            for (int i=0; i<testcases.size(); i++) {
                response = submit(dirPath, problem,i+1, testcases.get(i));
                tcResults.add(response);

                // 해당 코드 상태를 실패로 변경
                if (!response.getCodeStatus().equals(CodeStatus.SUCCESS.getStatus())) {
                    codeStatus = CodeStatus.FAIL;
                }
            }

            // 코드 저장
            try {
                codeRepository.save(Code.of(code, Language.JAVA, resultTime, resultMemory, codeStatus, member, problem));
            } catch (Exception e) {
                deleteFolder(dirPath);
                throw new CustomServerErrorException(DATABASE_ERROR);
            }
        }
        // 실행
        else {
            testcases = testcaseRepository.findAllByProblemIdAndIsHidden(problem.getId(), isHidden);
            List<CodeExecuteDto> results = new ArrayList<>();
            CodeExecuteDto tcResult;

            // 각 테스트케이스 별 실행 결과
            for (int i=0; i<testcases.size(); i++) {
                tcResult = execute(dirPath,i+1, testcases.get(i));
                results.add(tcResult);

                // 해당 코드 상태를 실패로 변경
                if (!tcResult.getCodeStatus().equals(CodeStatus.SUCCESS.getStatus())) {
                    codeStatus = CodeStatus.FAIL;
                }

                return CodeExecuteResponse.of(codeStatus, results);
            }
        }

        // 파일 삭제
        deleteFolder(dirPath);

        return tcResults;
    }

    private boolean compile(String dirPath, String code) throws IOException, InterruptedException {
        boolean result = true;

        // 자바 파일 생성
        String codePath = createJavaFile(dirPath, code);

        // 컴파일
        ProcessBuilder pb = new ProcessBuilder("javac", codePath);
        Process process = pb.start();
        process.waitFor();

        // 실패
        if (process.exitValue() != 0) {
            // 파일 삭제
            deleteFolder(dirPath);
            // 결과값
            result = false;
        }

        process.destroyForcibly();
        return result;
    }

    private CodeExecuteDto execute(String dirPath, Integer no, Testcase testcase) throws IOException, InterruptedException {
        // 테스트 케이스 input 생성
        String inputPath = createInputFile(dirPath, no, testcase.getInput());

        // 코드 실행
        ProcessBuilder pb = new ProcessBuilder("java", "Solution")
                .directory(new File(dirPath)) // 디렉토리 지정
                .redirectInput(new File(inputPath)); // 테스트 케이스 input

        // 표준 에러를 표준 출력으로 redirect
//        pb.redirectErrorStream(true);

        // 채점 시작
        Process process = pb.start();
        process.waitFor();

        BufferedReader outputReader;
        StringBuilder result;
        String line;

        // 런타임 에러
        if (process.exitValue() != 0) {
            outputReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
            result = new StringBuilder();
            while ((line = outputReader.readLine()) != null) {
                result.append(line).append(" ");
            }

            log.info("런타임 에러 {}", result);

            process.destroyForcibly();
            deleteFile(inputPath);

            return CodeExecuteDto.of(no, CodeStatus.RUNTIME_ERROR.getStatus());
        }

        // 실행 결과
        outputReader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        result = new StringBuilder();
        while ((line = outputReader.readLine()) != null) {
            result.append(line).append("\n");
        }

        log.info("실행 결과 {}", result);

        // 테스트케이스 output 생성
        String outputPath = createOutputFile(dirPath, no, testcase.getOutput());
        if (outputPath == null) {
            process.destroyForcibly();
            deleteFolder(dirPath);
            throw new CustomServerErrorException(SERVER_ERROR);
        }

        // String 변환
        StringBuilder output = new StringBuilder();
        try (Scanner sc = new Scanner(new File(outputPath))) {
            while (sc.hasNextLine()) {
                output.append(sc.nextLine()).append("\n");
            }
        } catch (Exception e) {
            process.destroyForcibly();
            deleteFolder(dirPath);
            throw new CustomServerErrorException(SERVER_ERROR);
        }

        // 파일 삭제
        deleteFile(inputPath);
        deleteFile(outputPath);
        // 프로세스 파괴
        process.destroyForcibly();

        // 실패
        if (!result.toString().equals(output.toString())) {
            return CodeExecuteDto.of(no, CodeStatus.FAIL.getStatus());
        }

        // 성공
        return CodeExecuteDto.of(no, CodeStatus.SUCCESS.getStatus());
    }

    private CodeSubmitResponse submit(String dirPath, Problem problem, Integer no, Testcase testcase) throws IOException, InterruptedException {
        // 테스트 케이스 input 생성
        String inputPath = createInputFile(dirPath, no, testcase.getInput());

        // 코드 실행
        ProcessBuilder pb = new ProcessBuilder("java", "Solution")
                .directory(new File(dirPath)) // 디렉토리 지정
                .redirectInput(new File(inputPath)); // 테스트 케이스 input

        // 표준 에러를 표준 출력으로 redirect
//        pb.redirectErrorStream(true);

        // 시작 시간
        long start = System.currentTimeMillis();

        // 채점 시작
        Process process = pb.start();

        // 메모리
        long memory = (Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory()) / (1024 * 4);
        // 시간 초과
        boolean timeover = process.waitFor(problem.getTime(), TimeUnit.SECONDS);

        // 종료 시간
        long end = System.currentTimeMillis();
        // 소요 시간
        long time = end - start;

        // 시간 초과
        if (!timeover) {
            process.destroyForcibly();
            deleteFile(inputPath);
            return CodeSubmitResponse.of(no, CodeStatus.TIME_OVER.getStatus(), time, memory);
        }

        // 메모리 초과
        if (memory > problem.getMemory() * 1024) {
            process.destroyForcibly();
            deleteFile(inputPath);
            return CodeSubmitResponse.of(no, CodeStatus.MEMORY_OVER.getStatus(), time, memory);
        }

        BufferedReader outputReader;
        StringBuilder result;
        String line;

        // 런타임 에러
        if (process.exitValue() != 0) {
            outputReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
            result = new StringBuilder();
            while ((line = outputReader.readLine()) != null) {
                result.append(line).append(" ");
            }

            log.info("런타임 에러 {}", result);

            process.destroyForcibly();
            deleteFile(inputPath);

            return CodeSubmitResponse.of(no, CodeStatus.RUNTIME_ERROR.getStatus(), null, null);
        }

        // 실행 결과
        outputReader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        result = new StringBuilder();
        while ((line = outputReader.readLine()) != null) {
            result.append(line).append("\n");
        }

        log.info("실행 결과 {}", result);

        // 테스트케이스 output 생성
        String outputPath = createOutputFile(dirPath, no, testcase.getOutput());
        if (outputPath == null) {
            process.destroyForcibly();
            deleteFolder(dirPath);
            throw new CustomServerErrorException(SERVER_ERROR);
        }

        // String 변환
        StringBuilder output = new StringBuilder();
        try (Scanner sc = new Scanner(new File(outputPath))) {
            while (sc.hasNextLine()) {
                output.append(sc.nextLine()).append("\n");
            }
        } catch (Exception e) {
            process.destroyForcibly();
            deleteFolder(dirPath);
            throw new CustomServerErrorException(SERVER_ERROR);
        }

        // 파일 삭제
        deleteFile(inputPath);
        deleteFile(outputPath);
        // 프로세스 파괴
        process.destroyForcibly();

        // 코드 효율 구하기
        if (time < resultTime) {
            resultTime = time;
            resultMemory = memory;
        }
        else if (time == resultTime) {
            if (resultMemory > memory) {
                resultMemory = memory;
            }
        }

        // 실패
        if (!result.toString().equals(output.toString())) {
            return CodeSubmitResponse.of(no, CodeStatus.FAIL.getStatus(), time, memory);
        }

        // 성공
        return CodeSubmitResponse.of(no, CodeStatus.SUCCESS.getStatus(), time, memory);
    }

    private String createDirectory(UUID uuid) {
        String path = BASE_PATH + uuid + File.separator;
        File file = new File(path);

        if (file.exists()) {
            return path;
        }

        if (file.mkdirs()) {
            log.info("폴더 생성 {}", path);
            return path;
        }

        throw new CustomServerErrorException(SERVER_ERROR);
    }

    private String createJavaFile(String dirPath, String content) throws IOException {
        // 파일 생성
        String path = dirPath + "Solution.java";
        File file = new File(path);

        // 파일 쓰기
        try (FileWriter writer = new FileWriter(file)) {
            writer.write(content);
        } catch (Exception e) {
            deleteFolder(dirPath);
            throw new CustomServerErrorException(SERVER_ERROR);
        }

        log.info("코드 생성 {}", path);
        // 파일 경로 반환
        return path;
    }

    private String createInputFile(String dirPath, int no, String input) throws IOException {
        // 파일 생성
        String path = dirPath + no + "input.txt";
        File file = new File(path);

        // 파일 쓰기
        try (FileWriter writer = new FileWriter(file)) {
            writer.write(input);
        } catch (Exception e) {
            deleteFolder(dirPath);
            throw new CustomServerErrorException(SERVER_ERROR);
        }

        log.info("input{} 생성 {}", no, path);
        // 파일 경로 반환
        return path;
    }

    private String createOutputFile(String dirPath, int no, String output) {
        // 파일 생성
        String path = dirPath + no + "output.txt";
        File file = new File(path);

        // 파일 쓰기
        try (FileWriter writer = new FileWriter(file)) {
            writer.write(output);
        } catch (Exception e) {
            log.info("output{} 생성 실패", no);
            return null;
        }

        log.info("output{} 생성 {}", no, path);
        // 파일 경로 반환
        return path;
    }

    private void deleteFolder(String path) throws IOException {
        FileUtils.cleanDirectory(new File(path));
        deleteFile(path);
    }

    private void deleteFile(String path) {
        File file = new File(path);
        file.delete();
    }

    private Member findMemberByAuth(Authentication authentication) {
        SecurityMemberDto member = jwtTokenProvider.getSecurityMemberDto(authentication);
        return findMemberById(member.getId());
    }

    private Member findMemberById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomBadRequestException(MEMBER_NOT_FOUND));
    }


}

