package com.eni.backend.problem.dto.request;

import com.eni.backend.common.entity.ProblemPlatform;
import com.eni.backend.problem.entity.Problem;
import com.eni.backend.problem.entity.Tier;
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
public class PostProblemRequest {

    @NotBlank(message = "문제 플랫폼을 입력해주세요.")
    private String platform;

    @NotNull(message = "문제 번호를 입력해주세요.")
    private Integer no;

    @NotBlank(message = "문제 제목을 입력해주세요.")
    private String title;

    @NotBlank(message = "문제 설명을 입력해주세요.")
    private String description;

    @NotBlank(message = "문제 입력값을 입력해주세요.")
    private String input;

    @NotBlank(message = "문제 출력값을 입력해주세요.")
    private String output;

    @NotNull(message = "제한 시간을 입력해주세요.")
    private Integer time;

    @NotNull(message = "제한 메모리를 입력해주세요.")
    private Integer memory;

    @NotNull(message = "문제 난이도를 입력해주세요.")
    private Long tierId;

}
