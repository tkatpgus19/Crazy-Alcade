package com.eni.backend.problem.dto.response;

import com.eni.backend.problem.entity.CodeStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@ToString
@Getter
public class CodeSubmitResponse {

    private String allResult;
    private List<CodeSubmitDto> tcResult;

    @Builder
    private CodeSubmitResponse(String allResult, List<CodeSubmitDto> tcResult) {
        this.allResult = allResult;
        this.tcResult = tcResult;
    }

    public static CodeSubmitResponse of(CodeStatus codeStatus, List<CodeSubmitDto> tcResult) {
        return builder()
                .allResult(codeStatus.getStatus())
                .tcResult(tcResult)
                .build();
    }

}
