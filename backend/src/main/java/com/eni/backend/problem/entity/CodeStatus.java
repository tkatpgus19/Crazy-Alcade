package com.eni.backend.problem.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CodeStatus {
    SUCCESS("맞았습니다."),
    FAIL("틀렸습니다."),
    COMPILE_ERROR("컴파일 에러"),
    RUNTIME_ERROR("런타임 에러"),
    TIME_OVER("시간 초과"),
    MEMORY_OVER("메모리 초과"),
    ;

    private final String status;
}