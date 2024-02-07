package com.eni.backend.member.controller;

import com.eni.backend.common.response.BaseSuccessResponse;
import com.eni.backend.member.service.LevelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.eni.backend.common.response.BaseResponseStatus.SUCCESS;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/levels")
public class LevelController {

    private final LevelService levelService;

    @GetMapping("")
    public BaseSuccessResponse<?> getList() {
        log.info("LevelController.getList");
        return BaseSuccessResponse.of(SUCCESS, levelService.getList());
    }
}
