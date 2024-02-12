package com.eni.backend.auth.oauth2.user;

import lombok.Builder;

import java.util.HashMap;
import java.util.Map;

public class GoogleOAuth2UserInfo implements OAuth2UserInfo {

    private final Map<String, Object> attributes;
    private String id;
    private String email;
    private String accessToken;

    @Builder
    private GoogleOAuth2UserInfo(Map<String, Object> attributes, String accessToken) {
        this.accessToken = accessToken;
        this.attributes = new HashMap<>();
        this.id = (String) attributes.get("sub");
        this.email = (String) attributes.get("email");
    }

    public static GoogleOAuth2UserInfo of(Map<String, Object> attributes, String accessToken) {
        return builder()
                .accessToken(accessToken)
                .attributes(attributes)
                .build();
    }

    @Override
    public OAuth2Provider getProvider() {
        return OAuth2Provider.GOOGLE;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public String getId() {
        return id;
    }

    @Override
    public String getEmail() {
        return email;
    }

    @Override
    public String getAccessToken() {
        return accessToken;
    }

}
