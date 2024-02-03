package com.eni.backend.problem.controller;

import com.eni.backend.common.exception.CustomBadRequestException;
import com.eni.backend.common.response.BaseResponseStatus;
import com.eni.backend.common.response.BaseSuccessResponse;
import com.eni.backend.member.entity.Language;
import com.eni.backend.problem.dto.request.PostCodeRequest;
import com.eni.backend.problem.dto.request.PostProblemRequest;
import com.eni.backend.problem.entity.Problem;
import com.eni.backend.problem.service.CodeService;
import com.eni.backend.problem.service.JavaCodeService;
import com.eni.backend.problem.service.ProblemService;
import com.eni.backend.problem.service.PythonCodeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

import static com.eni.backend.common.response.BaseResponseStatus.*;
import static com.eni.backend.common.util.BindingResultUtils.getErrorMessages;

@CrossOrigin(origins = { "*" }, methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE} , maxAge = 6000)
@Slf4j
@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/problems")
public class ProblemController {

    private final ProblemService problemService;
    private final CodeService codeService;
    private final JavaCodeService javaCodeService;
    private final PythonCodeService pythonCodeService;

    @PostMapping("")
    public BaseSuccessResponse<?> post(@RequestBody @Valid PostProblemRequest request, BindingResult bindingResult) {
        log.info("ProblemController.post");

        // validation 오류
        if (bindingResult.hasErrors()) {
            throw new CustomBadRequestException(BAD_REQUEST, getErrorMessages(bindingResult));
        }

        return BaseSuccessResponse.of(POST_PROBLEM_SUCCESS, problemService.post(request));
    }

    @GetMapping("")
    public BaseSuccessResponse<?> getList(@RequestParam(name = "tier-id") Long tierId) {
        log.info("ProblemController.getList");
        return BaseSuccessResponse.of(GET_PROBLEM_LIST_SUCCESS, problemService.getList(tierId));
    }

    @GetMapping("/random")
    public BaseSuccessResponse<?> getRandom(@RequestParam(name = "tier-id") Long tierId) {
        log.info("ProblemController.getRandom");
        return BaseSuccessResponse.of(GET_PROBLEM_RANDOM_PROCESS, problemService.getRandom(tierId));
    }

    @GetMapping("/{problem-id}")
    public BaseSuccessResponse<?> get(@PathVariable(name = "problem-id") Long problemId) {
        log.info("ProblemController.get");
        return BaseSuccessResponse.of(GET_PROBLEM_DETAIL_SUCCESS, problemService.get(problemId));
    }

    /**
     * 토큰 검사 필요함.
     * 임시로 memberId=1 이용.
     */
    @PostMapping("/{problem-id}/codes/{type}")
    public BaseSuccessResponse<?> code(@PathVariable(name = "problem-id") Long problemId,
                                              @PathVariable String type,
                                              @RequestBody @Valid PostCodeRequest request, BindingResult bindingResult) throws IOException, InterruptedException {
        log.info("ProblemController.codeExecute");

        Long memberId = 1L; // 임시

        /**
         * save 처리 필요함.
         */
        boolean isHidden;
        BaseResponseStatus responseStatus;
        if (type.equals("execute")) {
            isHidden = false;
            responseStatus = EXECUTE_CODE_SUCCESS;
        } else if (type.equals("submit")) {
            isHidden = true;
            responseStatus = SUBMIT_CODE_SUCCESS;
        } else {
            throw new CustomBadRequestException(URL_NOT_FOUND);
        }

        // validation 오류
        if (bindingResult.hasErrors()) {
            throw new CustomBadRequestException(BAD_REQUEST, getErrorMessages(bindingResult));
        }

        Problem problem = codeService.findProblemById(problemId);
        Language language = codeService.getLanguage(request.getLang());

        // 자바 실행 결과
        if (language == Language.JAVA) {
            return BaseSuccessResponse.of(responseStatus, javaCodeService.judge(memberId, problem, request.getContent(), isHidden));
        }

        // 파이썬 실행 결과
        if (language == Language.PYTHON) {
            return BaseSuccessResponse.of(responseStatus, pythonCodeService.judge(memberId, problem, request.getContent(), isHidden));
        }

        throw new CustomBadRequestException(LANGUAGE_NOT_SUPPORTED);
    }

}
