package com.eni.backend.common.response;

import lombok.Builder;
import lombok.Getter;

import static com.eni.backend.common.response.BaseResponseStatus.SUCCESS;

@Getter
public class BaseSuccessResponse<T> {

    private final int code;
    private final String message;
    private final T result;

    @Builder
    private BaseSuccessResponse(int code, String message, T result) {
        this.code = code;
        this.message = message;
        this.result = result;
    }

    public static <T> BaseSuccessResponse<T> of(String message, T result) {
        return BaseSuccessResponse.<T>builder()
                .message(message)
                .result(result)
                .build();
    }

    public static <T> BaseSuccessResponse<T> of(T result) {
        return BaseSuccessResponse.<T>builder()
                .code(SUCCESS.getStatus().value())
                .message(SUCCESS.getMessage())
                .result(result)
                .build();
    }

}
