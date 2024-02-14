package com.eni.backend.problem.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class PostProblemResponse {

    private Long problemId;

    @Builder
    private PostProblemResponse(Long problemId) {
        this.problemId = problemId;
    }

    public static PostProblemResponse of(Long problemId) {
        return builder().
                problemId(problemId)
                .build();
    }

}
