package com.eni.backend.problem.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class PostCodeRequest {

    @NotBlank(message = "언어를 입력해주세요.")
    private String lang;

    @NotBlank(message = "코드를 입력해주세요.")
    private String content;

}
