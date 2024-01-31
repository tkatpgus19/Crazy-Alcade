package com.eni.backend.problem.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class PostTestcaseResponse {

    Long testcaseId;

    @Builder
    private PostTestcaseResponse(Long testcaseId) {
        this.testcaseId = testcaseId;
    }

    public static PostTestcaseResponse of(Long testcaseId) {
        return builder().
                testcaseId(testcaseId)
                .build();
    }

}
