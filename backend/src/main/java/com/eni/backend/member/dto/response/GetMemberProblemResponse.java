package com.eni.backend.member.dto.response;

import com.eni.backend.problem.entity.Code;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class GetMemberProblemResponse {
    private Integer problemNo;

    @Builder
    private GetMemberProblemResponse(Integer problemNo) {
        this.problemNo = problemNo;
    }

    public static GetMemberProblemResponse from(Code code) {
        return builder()
                .problemNo(code.getProblem().getNo())
                .build();
    }
}
