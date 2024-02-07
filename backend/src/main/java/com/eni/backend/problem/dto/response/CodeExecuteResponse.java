package com.eni.backend.problem.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class CodeExecuteResponse {

    private Integer testcaseNo;
    private String codeStatus;

    @Builder
    private CodeExecuteResponse(Integer testcaseNo, String codeStatus) {
        this.testcaseNo = testcaseNo;
        this.codeStatus = codeStatus;
    }

    public static CodeExecuteResponse of(Integer testcaseNo, String codeStatus) {
        return builder()
                .testcaseNo(testcaseNo)
                .codeStatus(codeStatus)
                .build();
    }

}
