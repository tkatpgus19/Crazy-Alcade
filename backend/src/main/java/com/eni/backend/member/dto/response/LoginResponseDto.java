package com.eni.backend.member.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
public class LoginResponseDto {

    private Long memberId;
    private String accessToken;
    private boolean isNew;
    private boolean isConnected;


    @Builder
    private LoginResponseDto(Long memberId, String accessToken, boolean isNew, boolean isConnected) {
        this.memberId = memberId;
        this.accessToken = accessToken;
        this.isNew = isNew;
        this.isConnected = isConnected;
    }

    public static LoginResponseDto of(Long memberId, String accessToken, boolean isNew, boolean isConnected) {
        return builder()
                .memberId(memberId)
                .accessToken(accessToken)
                .isNew(isNew)
                .isConnected(isConnected)
                .build();
    }

}
