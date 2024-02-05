package com.eni.backend.member.controller;

import com.eni.backend.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {
    @Autowired
    private MemberService memberService;

    @GetMapping("")
    public String test(Authentication authentication ) { //이거나 principal 쓰면 헤더에서 아이디값 꺼낼 수 있음
        return "ok";
    }

}