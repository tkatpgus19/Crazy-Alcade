package com.eni.backend.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import static com.eni.backend.common.response.BaseResponseStatus.SUCCESS;

@Getter
public class BaseSuccessResponse<T> {

    private final int code;
    private final String message;
    private final T result;

    @Builder
    private BaseSuccessResponse(String message, T result) {
        this.code = HttpStatus.OK.value();
        this.message = message;
        this.result = result;
    }

    public static <T> BaseSuccessResponse<T> of(String message, T result) {
        return BaseSuccessResponse.<T>builder()
                .message(message)
                .result(result)
                .build();
    }
}