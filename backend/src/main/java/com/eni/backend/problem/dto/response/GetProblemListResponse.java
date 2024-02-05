package com.eni.backend.problem.dto.response;

import com.eni.backend.problem.entity.Problem;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class GetProblemListResponse {

    Long problemId;
    String platform;
    Integer no;
    String title;

    @Builder
    private GetProblemListResponse(Long problemId, String platform, Integer no, String title) {
        this.problemId = problemId;
        this.platform = platform;
        this.no = no;
        this.title = title;
    }

    public static GetProblemListResponse of(Problem problem) {
        return builder()
                .problemId(problem.getId())
                .platform(problem.getStringPlatform())
                .no(problem.getNo())
                .title(problem.getTitle())
                .build();
    }

}
