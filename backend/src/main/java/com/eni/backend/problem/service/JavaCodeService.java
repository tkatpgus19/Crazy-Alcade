package com.eni.backend.problem.service;

import com.eni.backend.common.exception.CustomServerErrorException;
import com.eni.backend.problem.dto.response.PostCodeResponse;
import com.eni.backend.problem.entity.CodeStatus;
import com.eni.backend.problem.entity.Problem;
import com.eni.backend.problem.entity.Testcase;
import com.eni.backend.problem.repository.TestcaseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.UUID;

import static com.eni.backend.common.response.BaseResponseStatus.SERVER_ERROR;

@Slf4j
@Service
@RequiredArgsConstructor
public class JavaCodeService {

    @Value("${code.base-path}")
    private String BASE_PATH;

    private final TestcaseRepository testcaseRepository;

    public Object execute(Problem problem, String code) throws IOException, InterruptedException {
        // 파일을 저장할 디렉토리 생성
        UUID uuid = UUID.randomUUID();
        String dirPath = createDirectory(uuid);

        // 컴파일 에러
        if (!compile(dirPath, code)) {
            log.info("컴파일 에러");
            return CodeStatus.COMPILE_ERROR.getStatus();
        }

        log.info("컴파일 성공");

        List<PostCodeResponse> responses = new ArrayList<>();
        List<Testcase> testcases = testcaseRepository.findAllByProblemIdAndIsHidden(problem.getId(), false);

        // 각 테스트케이스 별 실행 결과
        for (int i=0; i<testcases.size(); i++) {
            responses.add(judge(dirPath,i+1, testcases.get(i)));
        }

        return responses;
    }

    private boolean compile(String dirPath, String code) throws IOException, InterruptedException {
        boolean result = true;

        // 자바 파일 생성
        String codePath = createJavaFile(dirPath, code);

        // 컴파일
        ProcessBuilder pb = new ProcessBuilder("javac", codePath);
        Process process = pb.start();
        process.waitFor();

        // 파일 삭제
        deleteFile(codePath);

        // 실패
        if (process.exitValue() != 0) {
            // 파일 삭제
            deleteFile(getCompileFile(dirPath));
            deleteFile(dirPath);
            // 결과값
            result = false;
        }

        process.destroyForcibly();
        return result;
    }

    private PostCodeResponse judge(String dirPath, Integer no, Testcase testcase) throws IOException, InterruptedException {
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
            deleteFile(getCompileFile(dirPath));
            deleteFile(inputPath);
            deleteFile(dirPath);

            return PostCodeResponse.of(no, CodeStatus.RUNTIME_ERROR.getStatus());
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
        // String 변환
        StringBuilder output = new StringBuilder();
        try (Scanner sc = new Scanner(new File(outputPath))) {
            while (sc.hasNextLine()) {
                output.append(sc.nextLine()).append("\n");
            }
        } catch (Exception e) {
            throw new CustomServerErrorException(SERVER_ERROR);
        }

        // 파일 삭제
        deleteFile(getCompileFile(dirPath));
        deleteFile(inputPath);
        deleteFile(outputPath);
        deleteFile(dirPath);
        // 프로세스 파괴
        process.destroyForcibly();

        // 실패
        if (!result.toString().equals(output.toString())) {
            return PostCodeResponse.of(no, CodeStatus.FAIL.getStatus());
        }

        // 성공
        return PostCodeResponse.of(no, CodeStatus.SUCCESS.getStatus());
    }

    private String createDirectory(UUID uuid) {
        String path = BASE_PATH + uuid + File.separator;
        File file = new File(path);

        if (file.exists()) {
            return path;
        }

        if (file.mkdir()) {
            log.info("폴더 생성 {}", path);
            return path;
        }

        throw new CustomServerErrorException(SERVER_ERROR);
    }

    private String createJavaFile(String dirPath, String content) {
        // 파일 생성
        String path = dirPath + "Solution.java";
        File file = new File(path);

        // 파일 쓰기
        try (FileWriter writer = new FileWriter(file)) {
            writer.write(content);
        } catch (Exception e) {
            throw new CustomServerErrorException(SERVER_ERROR);
        }

        log.info("코드 생성 {}", path);
        // 파일 경로 반환
        return path;
    }

    private String createInputFile(String dirPath, int no, String input) {
        // 파일 생성
        String path = dirPath + no + "input.txt";
        File file = new File(path);

        // 파일 쓰기
        try (FileWriter writer = new FileWriter(file)) {
            writer.write(input);
        } catch (Exception e) {
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
            throw new CustomServerErrorException(SERVER_ERROR);
        }

        log.info("output{} 생성 {}", no, path);
        // 파일 경로 반환
        return path;
    }

    private String getCompileFile(String dirPath) {
        return dirPath + "Solution.class";
    }

    private void deleteFile(String path) {
        File file = new File(path);
        file.delete();
    }

}
