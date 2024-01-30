package com.eni.backend.problem.service;

import com.eni.backend.common.exception.CustomBadRequestException;
import com.eni.backend.common.exception.CustomServerErrorException;
import com.eni.backend.problem.dto.request.PostTestcaseRequest;
import com.eni.backend.problem.dto.response.PostTestcaseResponse;
import com.eni.backend.problem.entity.Problem;
import com.eni.backend.problem.entity.Testcase;
import com.eni.backend.problem.repository.ProblemRepository;
import com.eni.backend.problem.repository.TestcaseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import static com.eni.backend.common.response.BaseResponseStatus.DATABASE_ERROR;
import static com.eni.backend.common.response.BaseResponseStatus.PROBLEM_NOT_FOUND;

@Slf4j
@Service
@RequiredArgsConstructor
public class TestcaseService {

    private final TestcaseRepository testcaseRepository;
    private final ProblemRepository problemRepository;

    public PostTestcaseResponse post(PostTestcaseRequest request) {
        // 문제
        Problem problem = findProblemById(request.getProblemId());

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

    private Problem findProblemById(Long problemId) {
        return problemRepository.findById(problemId)
                .orElseThrow(() -> new CustomBadRequestException(PROBLEM_NOT_FOUND));
    }

}
