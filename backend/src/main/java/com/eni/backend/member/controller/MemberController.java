package com.eni.backend.member.controller;

import com.eni.backend.common.exception.CustomBadRequestException;
import com.eni.backend.common.response.BaseSuccessResponse;
import com.eni.backend.member.dto.request.PutCoinRequest;
import com.eni.backend.member.dto.request.PutExpRequest;
import com.eni.backend.member.dto.request.PutLanguageRequest;
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

    @GetMapping("")
    public BaseSuccessResponse<?> getList() {
        log.info("MemberController.getList");

        return BaseSuccessResponse.of(SUCCESS.getMessage(), memberService.getList());
    }

    @PutMapping("/nickname")
    public BaseSuccessResponse<?> putNickname(Authentication authentication, @RequestBody @Valid PutNicknameRequest putNicknameRequest, BindingResult bindingResult) {
        log.info("MemberController.nickname.put");

        // validation 오류
        if (bindingResult.hasErrors()) {
            throw new CustomBadRequestException(BAD_REQUEST, getErrorMessages(bindingResult));
        }

        return BaseSuccessResponse.of(memberService.putNickname(authentication, putNicknameRequest));
    }

    @PutMapping("/lang")
    public BaseSuccessResponse<?> putLanguage(Authentication authentication, @RequestBody @Valid PutLanguageRequest putLanguageRequest, BindingResult bindingResult) {
        log.info("MemberController.language.put");

        // validation 오류
        if (bindingResult.hasErrors()) {
            throw new CustomBadRequestException(BAD_REQUEST, getErrorMessages(bindingResult));
        }

        return BaseSuccessResponse.of(memberService.putLanguage(authentication, putLanguageRequest));
    }

    @PutMapping("/coin/add")
    public BaseSuccessResponse<?> putCoinAdd(Authentication authentication, @RequestBody @Valid PutCoinRequest putCoinRequest, BindingResult bindingResult) {
        log.info("MemberController.coin.add");

        // validation 오류
        if (bindingResult.hasErrors()) {
            throw new CustomBadRequestException(BAD_REQUEST, getErrorMessages(bindingResult));
        }

        return BaseSuccessResponse.of(memberService.putCoin(authentication, putCoinRequest, true));
    }

    @PutMapping("/coin/sub")
    public BaseSuccessResponse<?> putCoinSub(Authentication authentication, @RequestBody @Valid PutCoinRequest putCoinRequest, BindingResult bindingResult) {
        log.info("MemberController.coin.sub");

        // validation 오류
        if (bindingResult.hasErrors()) {
            throw new CustomBadRequestException(BAD_REQUEST, getErrorMessages(bindingResult));
        }

        return BaseSuccessResponse.of(memberService.putCoin(authentication, putCoinRequest, false));
    }

    @PutMapping("/exp")
    public BaseSuccessResponse<?> putExp(Authentication authentication, @RequestBody @Valid PutExpRequest putExpRequest, BindingResult bindingResult) {
        log.info("MemberController.exp");

        // validation 오류
        if (bindingResult.hasErrors()) {
            throw new CustomBadRequestException(BAD_REQUEST, getErrorMessages(bindingResult));
        }

        return BaseSuccessResponse.of(memberService.putExp(authentication, putExpRequest));
    }
}