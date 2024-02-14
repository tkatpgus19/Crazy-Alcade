package com.eni.backend.problem.dto.response;

import com.eni.backend.problem.entity.Testcase;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class GetExampleResponse {

    private String input;
    private String output;

    @Builder
    private GetExampleResponse(String input, String output) {
        this.input = input;
        this.output = output;
    }

    public static GetExampleResponse from(Testcase testcase) {
        return builder()
                .input(testcase.getInput())
                .output(testcase.getOutput())
                .build();
    }

}
