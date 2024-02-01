package com.eni.backend.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BaseSuccessResponse<T> {

    private final int statusCode; //http status code
    private final String message; //response message
    private final T data; //response data

    @Builder
    private BaseSuccessResponse(int statusCode, String message, T data) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }

    public static <T> BaseSuccessResponse<T> of(BaseResponseStatus baseResponseStatus, T data) {
        return BaseSuccessResponse.<T>builder()
                .statusCode(baseResponseStatus.getStatus().value())
                .message(baseResponseStatus.getMessage())
                .data(data)
                .build();
    }
}
