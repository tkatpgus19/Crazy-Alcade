package com.eni.backend.problem.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class PostTestcaseRequest {

    @NotBlank(message = "테스트케이스 입력값을 입력해주세요.")
    private String input;

    @NotBlank(message = "테스트케이스 출력값을 입력해주세요.")
    private String output;

    @NotNull(message = "히든 여부를 입력해주세요.")
    private Boolean isHidden;

    @NotNull(message = "문제 ID를 입력해주세요.")
    private Long problemId;

}
