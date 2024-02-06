package com.eni.backend.problem.service;

import com.eni.backend.problem.dto.request.PostTestcaseRequest;
import com.eni.backend.problem.dto.response.*;
import com.eni.backend.problem.entity.ProblemPlatform;
import com.eni.backend.common.exception.CustomBadRequestException;
import com.eni.backend.common.exception.CustomServerErrorException;
import com.eni.backend.problem.dto.request.PostProblemRequest;
import com.eni.backend.problem.entity.Problem;
import com.eni.backend.problem.entity.Testcase;
import com.eni.backend.problem.entity.Tier;
import com.eni.backend.problem.repository.ProblemRepository;
import com.eni.backend.problem.repository.TestcaseRepository;
import com.eni.backend.problem.repository.TierRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import static com.eni.backend.common.response.BaseResponseStatus.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final TierRepository tierRepository;
    private final TestcaseRepository testcaseRepository;

    @Transactional
    public PostProblemResponse post(PostProblemRequest request) {
        // platform (String -> Enum)
        ProblemPlatform platform = getProblemPlatform(request.getPlatform());
        // 유효성 검사
        validateDuplicateProblem(platform, request.getNo());

        // 티어
        Tier tier = findTierById(request.getTierId());

        // 문제
        Problem problem = Problem.of(platform,
                request.getNo(),
                request.getTitle(),
                request.getDescription(),
                request.getInput(),
                request.getOutput(),
                request.getTime(),
                request.getMemory(),
                tier);

        // 저장
        try {
            problemRepository.save(problem);
        } catch (Exception e) {
            throw new CustomServerErrorException(DATABASE_ERROR);
        }

        // 생성된 ID 값 반환
        return PostProblemResponse.of(problem.getId());
    }

    public List<GetProblemListResponse> getList(Long tierId) {
        // 유효성 검사
        validateTierId(tierId);

        // 조회
        return problemRepository.findAllByTierId(tierId)
                .stream().map(GetProblemListResponse::of)
                .collect(Collectors.toList());
    }

    public GetProblemResponse get(Long problemId) {
        // 문제 조회
        Problem problem = findProblemById(problemId);

        // 예제 테스트케이스 조회
        List<GetExampleResponse> examples = getExamples(problemId);

        // dto로 변환해서 반환
        return GetProblemResponse.of(problem, examples);
    }

    private List<GetExampleResponse> getExamples(Long problemId) {
        return testcaseRepository.findAllByProblemIdAndIsHidden(problemId, false) // 예제 테스트케이스
                .stream().map(GetExampleResponse::of)
                .collect(Collectors.toList());
    }

    public GetProblemResponse getRandom(Long tierId) {
        // 해당 티어의 문제 리스트 조회
        List<GetProblemListResponse> problems = getList(tierId);

        // 랜덤 번호 생성
        int randomNo = new Random().nextInt(problems.size());

        // 문제 ID
        Long problemId = problems.get(randomNo).getProblemId();

        // 반환
        return get(problemId);
    }

    @Transactional
    public PostTestcaseResponse postTestcase(Long problemId, PostTestcaseRequest request) {
        // 문제
        Problem problem = findProblemById(problemId);

        // 테스트케이스
        Testcase testcase = Testcase.of(request.getInput(),
                request.getOutput(),
                request.getIsHidden(),
                problem);

        // 저장
        try {
            testcaseRepository.save(testcase);
        } catch (Exception e) {
            throw new CustomServerErrorException(DATABASE_ERROR);
        }

        // 생성된 ID 값 반환
        return PostTestcaseResponse.of(testcase.getId());
    }

    private ProblemPlatform getProblemPlatform(String platform) {
        ProblemPlatform problemPlatform;
        try {
            problemPlatform = ProblemPlatform.valueOf(platform);
        } catch (Exception e) {
            throw new CustomBadRequestException(PLATFORM_NOT_SUPPORTED);
        }
        return problemPlatform;
    }

    private void validateDuplicateProblem(ProblemPlatform platform, Integer no) {
        if (problemRepository.existsByPlatformAndNo(platform, no)) {
            throw new CustomBadRequestException(DUPLICATE_PROBLEM);
        }
    }

    private Tier findTierById(Long tierId) {
        return tierRepository.findById(tierId)
                .orElseThrow(() -> new CustomBadRequestException(TIER_NOT_FOUND));
    }

    private void validateTierId(Long tierId) {
        if (!tierRepository.existsById(tierId)) {
            throw new CustomBadRequestException(TIER_NOT_FOUND);
        }
    }

    private Problem findProblemById(Long problemId) {
        return problemRepository.findById(problemId)
                .orElseThrow(() -> new CustomBadRequestException(PROBLEM_NOT_FOUND));
    }

}
