package com.eni.backend.problem.controller;

import com.eni.backend.common.response.BaseSuccessResponse;
import com.eni.backend.problem.dto.PostProblemRequest;
import com.eni.backend.problem.dto.PostProblemResponse;
import com.eni.backend.problem.service.ProblemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/problems")
public class ProblemController {

    private final ProblemService problemService;

    @PostMapping("")
    public BaseSuccessResponse<?> post(@RequestBody PostProblemRequest request) {
        log.info("ProblemController.post");
        PostProblemResponse response = problemService.post(request);
        log.info("response {}", response.toString());
        return BaseSuccessResponse.of(response);
    }

}
