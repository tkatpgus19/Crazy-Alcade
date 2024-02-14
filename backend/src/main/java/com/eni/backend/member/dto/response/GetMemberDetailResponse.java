package com.eni.backend.member.dto.response;

import com.eni.backend.member.entity.Member;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@ToString
@Getter
public class GetMemberDetailResponse {
    private String profile;
    private String nickname;
    private String email;
    private String provider;
    private String lang;
    private List<String> successProblems;
    private List<String> failProblems;

    @Builder
    private GetMemberDetailResponse(String profile, String nickname, String email, String provider, String lang, List<String> successProblems, List<String> failProblems) {
        this.profile = profile;
        this.nickname = nickname;
        this.email = email;
        this.provider = provider;
        this.lang = lang;
        this.successProblems = successProblems;
        this.failProblems = failProblems;
    }

    public static GetMemberDetailResponse from(Member member, List<String> successProblems, List<String> failProblems) {
        return builder()
                .profile(member.getProfile())
                .nickname(member.getNickname())
                .email(member.getEmail())
                .provider(member.getProvider().name())
                .lang(member.getLang().name())
                .successProblems(successProblems)
                .failProblems(failProblems)
                .build();
    }
}
