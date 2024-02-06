package com.eni.backend.member.dto.request;

import com.eni.backend.common.entity.Language;
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
public class PutLanguageRequest {

    @NotNull(message = "선호 언어를 선택해주세요.")
    private Language lang;
}
