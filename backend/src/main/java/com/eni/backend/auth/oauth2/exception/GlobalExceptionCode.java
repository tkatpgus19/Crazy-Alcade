package com.eni.backend.auth.oauth2.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum GlobalExceptionCode {

    // Validate JWT Token
    INVALID_TOKEN_VALUE(HttpStatus.BAD_REQUEST, "JWT-001", "JWT 토큰 값이 유효하지 않습니다."),
    UNAUTHORIZED_REFRESH_TOKEN_VALUE(HttpStatus.UNAUTHORIZED, "JWT-002", "JWT Refresh 토큰값이 유효하지 않습니다.");

    private final HttpStatus httpStatus;
    private final String errorCode;
    private final String message;
}