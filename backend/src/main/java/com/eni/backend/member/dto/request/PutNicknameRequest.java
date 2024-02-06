package com.eni.backend.member.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class PutNicknameRequest {

    @NotBlank(message = "새로운 닉네임을 입력해주세요.")
    private String nickname;

}
