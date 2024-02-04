package com.eni.backend.member.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
public class LoginResponseDto {

    private Long memberId;
    private String accessToken;

    @Builder
    private LoginResponseDto(Long memberId, String accessToken) {
        this.memberId = memberId;
        this.accessToken = accessToken;
    }

    public static LoginResponseDto of(Long memberId, String accessToken) {
        return builder()
                .memberId(memberId)
                .accessToken(accessToken)
                .build();
    }

}


