package com.eni.backend.common.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class BaseErrorResponse {

    private final int code;
    private final String status;
    private final String message;

    public BaseErrorResponse(BaseResponseStatus baseResponseStatus) {
        this.code = baseResponseStatus.getStatus().value();
        this.status = baseResponseStatus.getStatus().name();
        this.message = baseResponseStatus.getMessage();
    }

}
