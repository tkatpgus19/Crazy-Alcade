package com.eni.backend.common.exception;

import com.eni.backend.common.response.BaseResponseStatus;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class CustomBadRequestException extends RuntimeException {

    private final BaseResponseStatus baseResponseStatus;

}
