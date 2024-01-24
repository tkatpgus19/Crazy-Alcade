package com.eni.backend.common.exception;

import com.eni.backend.common.exception.response.BaseErrorResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.hibernate.TypeMismatchException;
import org.springframework.http.HttpStatus;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import static com.eni.backend.common.exception.response.ExceptionStatus.*;


@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({BadRequestException.class, NoHandlerFoundException.class, TypeMismatchException.class})
    public BaseErrorResponse handleBadRequest(Exception e) {
        log.error("[BadRequestException]", e);
        return new BaseErrorResponse(URL_NOT_FOUND);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public BaseErrorResponse handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException e) {
        log.error("[HttpRequestMethodNotSupportedException]", e);
        return new BaseErrorResponse(METHOD_NOT_SUPPORTED);
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(RuntimeException.class)
    public BaseErrorResponse handleRuntimeException(Exception e) {
        log.error("[RuntimeException]", e);
        return new BaseErrorResponse(SERVER_ERROR);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(CustomBadRequestException.class)
    protected BaseErrorResponse handleCustomException(CustomBadRequestException e) {
        log.error("[CustomBadRequestException]");
        return new BaseErrorResponse(e.getExceptionStatus());
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(CustomServerErrorException.class)
    public BaseErrorResponse handleDatabaseException(CustomServerErrorException e) {
        log.error("[CustomServerErrorException]", e);
        return new BaseErrorResponse(e.getExceptionStatus());
    }

}
