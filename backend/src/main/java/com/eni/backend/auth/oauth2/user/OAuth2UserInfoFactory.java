package com.eni.backend.auth.oauth2.user;

import com.eni.backend.auth.oauth2.exception.OAuth2AuthenticationProcessingException;

import java.util.Map;

public class OAuth2UserInfoFactory {

    public static OAuth2UserInfo getOAuth2UserInfo(String registrationId, String accessToken, Map<String, Object> attributes) {

        if (OAuth2Provider.GOOGLE.getRegistrationId().equals(registrationId)) {
            return GoogleOAuth2UserInfo.of(accessToken, attributes);
        } else if (OAuth2Provider.KAKAO.getRegistrationId().equals(registrationId)) {
            return KakaoOAuth2UserInfo.of(accessToken, attributes);
        } else {
            throw new OAuth2AuthenticationProcessingException("Login with " + registrationId + " is not supported");
        }
    }
}
