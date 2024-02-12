package com.eni.backend.problem.dto.response;

import com.eni.backend.problem.entity.CodeStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@ToString
@Getter
public class CodeExecuteResponse {

    private String allResult;
    private List<CodeExecuteDto> tcResult;

    @Builder
    private CodeExecuteResponse(String allResult, List<CodeExecuteDto> tcResult) {
        this.allResult = allResult;
        this.tcResult = tcResult;
    }

    public static CodeExecuteResponse of(CodeStatus codeStatus, List<CodeExecuteDto> tcResult) {
        return builder()
                .allResult(codeStatus.getStatus())
                .tcResult(tcResult)
                .build();
    }

}
