package com.eni.backend.problem.controller;

import com.eni.backend.common.exception.CustomBadRequestException;
import com.eni.backend.common.response.BaseSuccessResponse;
import com.eni.backend.problem.dto.request.PostProblemRequest;
import com.eni.backend.problem.service.ProblemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.ObjectUtils;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import static com.eni.backend.common.response.BaseResponseStatus.*;
import static com.eni.backend.common.util.BindingResultUtils.getErrorMessages;

@Slf4j
@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/problems")
public class ProblemController {

    private final ProblemService problemService;

    @PostMapping("")
    public BaseSuccessResponse<?> post(@RequestBody @Valid PostProblemRequest request, BindingResult bindingResult) {
        log.info("ProblemController.post");

        // validation 오류
        if (bindingResult.hasErrors()) {
            throw new CustomBadRequestException(BAD_REQUEST, getErrorMessages(bindingResult));
        }

        return BaseSuccessResponse.of(problemService.post(request));
    }

    @GetMapping("")
    public BaseSuccessResponse<?> getList(@RequestParam(required = false, name = "tier-id") Long tierId) {
        log.info("ProblemController.getList");

        // 쿼리 파라미터 null 체크
        nullCheck(tierId);

        return BaseSuccessResponse.of(problemService.getList(tierId));
    }

    @GetMapping("/{problem-id}")
    public BaseSuccessResponse<?> get(@PathVariable(required = false, name = "problem-id") Long problemId) {
        log.info("ProblemController.get");

        // Path Variable null 체크
        nullCheck(problemId);

        return BaseSuccessResponse.of(problemService.get(problemId));
    }

    @GetMapping("/random")
    public BaseSuccessResponse<?> getRandom(@RequestParam(required = false, name = "tier-id") Long tierId) {
        log.info("ProblemController.getRandom");

        // 쿼리 파라미터 null 체크
        nullCheck(tierId);

        return BaseSuccessResponse.of(problemService.getRandom(tierId));
    }

    private void nullCheck(Long id) {
        if (ObjectUtils.isEmpty(id)) {
            throw new CustomBadRequestException(QUERY_PARAMS_OR_PATH_VARIABLE_NOT_FOUND);
        }
    }

}
