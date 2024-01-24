package com.eni.backend.common.exception.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class BaseErrorResponse {

    private final int code;
    private final String status;
    private final String message;

    public BaseErrorResponse(ExceptionStatus exeptionStatus) {
        this.code = exeptionStatus.getStatus().value();
        this.status = exeptionStatus.getStatus().name();
        this.message = exeptionStatus.getMessage();
    }

}
