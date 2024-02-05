package com.eni.backend.problem.controller;

import com.eni.backend.common.response.BaseSuccessResponse;
import com.eni.backend.problem.service.TierService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/tiers")
public class TierController {

    private final TierService tierService;

    @GetMapping("")
    public BaseSuccessResponse<?> getList() {
        log.info("TierController.getList");
        return BaseSuccessResponse.of(tierService.getList());
    }

}
