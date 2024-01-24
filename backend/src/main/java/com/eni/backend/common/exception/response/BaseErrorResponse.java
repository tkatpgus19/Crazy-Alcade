package com.eni.backend.common.exception.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class BaseErrorResponse {

    private final int code;
    private final String status;
    private final String message;

    public BaseErrorResponse(ExceptionStatus exceptionStatus) {
        this.code = exceptionStatus.getStatus().value();
        this.status = exceptionStatus.getStatus().name();
        this.message = exceptionStatus.getMessage();
    }

}
