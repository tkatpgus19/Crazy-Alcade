package com.eni.backend.member.dto;

import com.eni.backend.auth.oauth2.user.OAuth2Provider;
import lombok.Builder;
import lombok.Getter;

@Getter
public class SecurityMemberDto {
    private final Long id;
    private final OAuth2Provider oAuth2Provider;
    private final String email;
    private final String name;
    private final String profile;

    @Builder
    public SecurityMemberDto(Long id, OAuth2Provider oAuth2Provider, String email, String name, String profile) {
        this.id = id;
        this.oAuth2Provider = oAuth2Provider;
        this.email = email;
        this.name = name;
        this.profile = profile;
    }

    public static SecurityMemberDto of(Long id, OAuth2Provider oAuth2Provider, String email, String name, String profile) {
        return builder()
                .id(id)
                .oAuth2Provider(oAuth2Provider)
                .email(email)
                .name(name)
                .profile(profile)
                .build();
    }
}