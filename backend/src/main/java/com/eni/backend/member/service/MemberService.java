package com.eni.backend.member.service;

import com.eni.backend.member.dto.request.MemberRequestDto;
import com.eni.backend.member.entity.Member;
import com.eni.backend.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    @Transactional
    public Long joinMember(MemberRequestDto memberRequestDto) {

        Member member = memberRequestDto.toEntity();

        //프로필이 없으면 기본 이미지 넣기
        if(!StringUtils.hasText(memberRequestDto.getProfile())) {
            member.updateProfile("https://lwi.nexon.com/ca/common/info/character/cha1.png");
        }

        return memberRepository.save(member).getId();
    }

    @Transactional
    public Optional<Member> findByEmail(String email) {
        return memberRepository.findByEmail(email);
    }
}