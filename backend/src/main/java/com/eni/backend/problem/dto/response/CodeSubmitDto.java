package com.eni.backend.problem.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class CodeSubmitDto {

    private Integer testcaseNo;
    private String codeStatus;
    private String time;
    private String memory;

    @Builder
    private CodeSubmitDto(Integer testcaseNo, String codeStatus, String time, String memory) {
        this.testcaseNo = testcaseNo;
        this.codeStatus = codeStatus;
        this.time = time;
        this.memory = memory;
    }

    public static CodeSubmitDto of(Integer testcaseNo, String codeStatus, Long time, Long memory) {
        return builder()
                .testcaseNo(testcaseNo)
                .codeStatus(codeStatus)
                .time(time + "ms")
                .memory(memory + "KB")
                .build();
    }

    public static CodeSubmitDto of(Integer testcaseNo, String codeStatus) {
        return builder()
                .testcaseNo(testcaseNo)
                .codeStatus(codeStatus)
                .time(null)
                .memory(null)
                .build();
    }

}