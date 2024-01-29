package com.eni.backend.common.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum BaseResponseStatus {

    // SUCCESS
    SUCCESS(HttpStatus.OK, "요청에 성공하였습니다."),

    // BAD_REQUEST
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "유효하지 않은 요청입니다."),
    URL_NOT_FOUND(HttpStatus.BAD_REQUEST, "유효하지 않은 URL 입니다."),
    METHOD_NOT_SUPPORTED(HttpStatus.BAD_REQUEST, "해당 URL에서 지원하지 않는 HTTP Method 입니다."),
    QUERY_PARAMS_NOT_FOUND(HttpStatus.BAD_REQUEST, "쿼리 파라미터 값이 없습니다."),

    // INTERNAL_SERVER_ERROR
    SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버에서 오류가 발생하였습니다."),
    DATABASE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "데이터베이스에서 오류가 발생하였습니다."),

    // UNAUTHORIZED
    JWT_ERROR(HttpStatus.UNAUTHORIZED, "JWT에서 오류가 발생하였습니다."),
    TOKEN_NOT_FOUND( HttpStatus.BAD_REQUEST, "토큰이 HTTP Header에 없습니다."),
    UNSUPPORTED_TOKEN_TYPE(HttpStatus.BAD_REQUEST, "지원되지 않는 토큰 형식입니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다."),
    MALFORMED_TOKEN(HttpStatus.UNAUTHORIZED, "토큰이 올바르게 구성되지 않았습니다."),
    EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "만료된 토큰입니다."),
    TOKEN_MISMATCH(HttpStatus.UNAUTHORIZED, "요청 정보가 토큰 정보와 일치하지 않습니다."),

    // PROBLEM
    PLATFORM_NOT_SUPPORTED(HttpStatus.BAD_REQUEST, "지원하지 않는 플랫폼입니다."),
    DUPLICATE_PROBLEM(HttpStatus.BAD_REQUEST, "이미 등록되어 있는 문제입니다"),
    PROBLEM_NOT_FOUND(HttpStatus.BAD_REQUEST, "해당하는 문제가 없습니다."),

    // TIER
    TIER_NOT_FOUND(HttpStatus.BAD_REQUEST, "해당하는 티어가 없습니다."),
    ;


    private final HttpStatus status;
    private final String message;

}
