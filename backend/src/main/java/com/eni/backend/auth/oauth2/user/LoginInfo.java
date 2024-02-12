package com.eni.backend.auth.oauth2.user;

import lombok.Builder;
import lombok.Getter;

@Getter
public class LoginInfo {

    Long memberId;

    // true: 로그인 보상 X, false: 로그인 보상 O
    boolean isNew;

    // true: 신규 회원, false: 기존 회원
    boolean isConnected;

    @Builder
    private LoginInfo(Long memberId, boolean isNew, boolean isConnected) {
        this.memberId = memberId;
        this.isNew = isNew;
        this.isConnected = isConnected;
    }

    public static LoginInfo of(Long memberId, boolean isNew, boolean isConnected) {
        return builder()
                .memberId(memberId)
                .isNew(isNew)
                .isConnected(isConnected)
                .build();
    }

    public static LoginInfo from(Long memberId, boolean isNew, boolean isConnected) {
        return builder()
                .memberId(memberId)
                .isNew(isNew)
                .isConnected(isConnected)
                .build();
    }
}
