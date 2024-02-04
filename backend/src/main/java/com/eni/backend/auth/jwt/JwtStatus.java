package com.eni.backend.auth.jwt;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum JwtStatus {
    ACCESS("토큰이 유효합니다."),
    EXPIRED("만료된 토큰입니다."),
    DENIED("유효하지 않은 토큰입니다."),
    ;

    private final String description;

}
