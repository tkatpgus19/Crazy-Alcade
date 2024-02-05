package com.eni.backend.member.dto;

import com.eni.backend.auth.oauth2.user.OAuth2Provider;
import com.eni.backend.member.entity.Member;
import lombok.Builder;
import lombok.Getter;

@Getter
public class SecurityMemberDto {

    private OAuth2Provider provider;
    private String id;
    private String email;

    @Builder
    private SecurityMemberDto(OAuth2Provider provider, String id, String email) {
        this.provider = provider;
        this.id = id;
        this.email = email;
    }

    public static SecurityMemberDto of(Member member) {
        return builder()
                .provider(member.getProvider())
                .id(member.getSocialId())
                .email(member.getEmail())
                .build();
    }

}

