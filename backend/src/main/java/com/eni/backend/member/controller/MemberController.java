package com.eni.backend.member.controller;

import com.eni.backend.common.exception.CustomBadRequestException;
import com.eni.backend.common.response.BaseSuccessResponse;
import com.eni.backend.member.dto.request.PutNicknameRequest;
import com.eni.backend.member.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import static com.eni.backend.common.response.BaseResponseStatus.BAD_REQUEST;
import static com.eni.backend.common.response.BaseResponseStatus.SUCCESS;
import static com.eni.backend.common.util.BindingResultUtils.getErrorMessages;

@Slf4j
@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
@CrossOrigin
public class MemberController {
    @Autowired
    private MemberService memberService;

    @GetMapping("/test")
    public String test(Authentication authentication) {
        return authentication.getPrincipal().toString();
    }

    @GetMapping("")
    public BaseSuccessResponse<?> getList() {
        log.info("LevelController.getList");
        return BaseSuccessResponse.of(SUCCESS, memberService.getList());
    }

    @PutMapping("/nickname")
    public BaseSuccessResponse<?> putNickname(Authentication authentication, @RequestBody @Valid PutNicknameRequest putNicknameRequest, BindingResult bindingResult) {
        log.info("MemberController.put");

        // validation 오류
        if (bindingResult.hasErrors()) {
            throw new CustomBadRequestException(BAD_REQUEST, getErrorMessages(bindingResult));
        }

        return BaseSuccessResponse.of(SUCCESS, memberService.putNickname(authentication, putNicknameRequest));
    }

}