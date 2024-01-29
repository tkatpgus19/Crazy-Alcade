package com.eni.backend.problem.service;

import com.eni.backend.common.entity.ProblemPlatform;
import com.eni.backend.common.exception.CustomBadRequestException;
import com.eni.backend.common.exception.CustomServerErrorException;
import com.eni.backend.problem.dto.PostProblemRequest;
import com.eni.backend.problem.dto.PostProblemResponse;
import com.eni.backend.problem.entity.Problem;
import com.eni.backend.problem.entity.Tier;
import com.eni.backend.problem.repository.ProblemRepository;
import com.eni.backend.problem.repository.TierRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.eni.backend.common.response.BaseResponseStatus.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final TierRepository tierRepository;

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

    private Tier findTierById(Long problemId) {
        return tierRepository.findById(problemId)
                .orElseThrow(() -> new CustomBadRequestException(TIER_NOT_FOUND));
    }

}
