package com.eni.backend.common.exception;

import com.eni.backend.common.exception.response.ExceptionStatus;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class CustomServerErrorException extends RuntimeException {

    private final ExceptionStatus exceptionStatus;

}
