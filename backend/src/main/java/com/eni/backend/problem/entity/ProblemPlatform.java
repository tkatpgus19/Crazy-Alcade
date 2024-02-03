package com.eni.backend.problem.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ProblemPlatform {
    BOJ("백준"),
    ;

    private final String platformName;

}
