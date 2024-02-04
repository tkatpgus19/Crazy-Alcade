package com.eni.backend.member.controller;

import com.eni.backend.common.exception.CustomBadRequestException;
import com.eni.backend.member.dto.request.PutNicknameRequestDto;
import com.eni.backend.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;

import static com.eni.backend.common.response.BaseResponseStatus.QUERY_PARAMS_OR_PATH_VARIABLE_NOT_FOUND;

@RestController
@RequestMapping("api/members")
@RequiredArgsConstructor
public class MemberController {
    @Autowired
    private MemberService memberService;

    @PutMapping("/{memberId}/nickname")
    public void changeNickname(@PathVariable Long memberId, @RequestBody String newNickname) {

        nullCheck(memberId);

        memberService.changeNickname(memberId, newNickname);
    }

//    @PutMapping("/nickname")
//    public void changeNickname(@RequestBody String newNickname) {
//        String emailId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        memberService.changeNickname(emailId, requestDto.getNewNickname());
//    }

    private void nullCheck(Long id) {
        if (ObjectUtils.isEmpty(id)) {
            throw new CustomBadRequestException(QUERY_PARAMS_OR_PATH_VARIABLE_NOT_FOUND);
        }
    }
}