package com.eni.backend.common.response;

import lombok.Getter;

import static com.eni.backend.common.response.BaseResponseStatus.SUCCESS;

@Getter
public class BaseResponse<T> {

    private final int code;
    private final String status;
    private final T result;

    public BaseResponse(T result) {
        this.code = SUCCESS.getStatus().value();
        this.status = SUCCESS.getMessage();
        this.result = result;
    }

}
