package com.eni.backend.auth.oauth2.user;

import lombok.Builder;

import java.util.HashMap;
import java.util.Map;

public class KakaoOAuth2UserInfo implements OAuth2UserInfo {

    private final Map<String, Object> attributes;
    private String id;
    private String email;
    private String accessToken;

    @Builder
    private KakaoOAuth2UserInfo(Map<String, Object> attributes, String accessToken) {
        this.accessToken = accessToken;
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");

        this.attributes = new HashMap<>();

        this.id = ((Long) attributes.get("id")).toString();

        this.email = (String) kakaoAccount.get("email");

        this.attributes.put("id", id);
        this.attributes.put("email", email);
    }

    public static KakaoOAuth2UserInfo of(Map<String, Object> attributes, String accessToken) {
        return builder()
                .accessToken(accessToken)
                .attributes(attributes)
                .build();
    }

    @Override
    public OAuth2Provider getProvider() {
        return OAuth2Provider.KAKAO;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public String getAccessToken() {
        return accessToken;
    }

    @Override
    public String getId() {
        return id;
    }

    @Override
    public String getEmail() {
        return email;
    }

}

