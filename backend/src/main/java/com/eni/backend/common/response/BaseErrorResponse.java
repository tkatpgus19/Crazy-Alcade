package com.eni.backend.common.response;

import lombok.Builder;
import lombok.Getter;

import static com.eni.backend.common.response.BaseResponseStatus.SUCCESS;

@Getter
public class BaseErrorResponse {

    private final int code;
    private final String status;
    private final String message;

    @Builder
    private BaseErrorResponse(int code, String status, String message) {
        this.code = code;
        this.status = status;
        this.message = message;
    }

    public static BaseErrorResponse of(BaseResponseStatus baseResponseStatus) {
        return builder()
                .code(baseResponseStatus.getStatus().value())
                .status(baseResponseStatus.getStatus().name())
                .message(baseResponseStatus.getMessage())
                .build();
    }

}
