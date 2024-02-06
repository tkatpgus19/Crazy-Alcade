package com.eni.backend.auth.oauth2.user;

import com.eni.backend.common.exception.CustomBadRequestException;

import java.util.Map;

import static com.eni.backend.common.response.BaseResponseStatus.PROVIDER_NOT_SUPPORTED;

public class OAuth2UserInfoFactory {

    public static OAuth2UserInfo getOAuth2UserInfo(String registrationId,
                                                   String accessToken,
                                                   Map<String, Object> attributes) {
        if (OAuth2Provider.GOOGLE.getRegistrationId().equals(registrationId)) {
            return GoogleOAuth2UserInfo.of(attributes, accessToken);
        }

        if (OAuth2Provider.KAKAO.getRegistrationId().equals(registrationId)) {
            return KakaoOAuth2UserInfo.of(attributes, accessToken);
        }

        throw new CustomBadRequestException(PROVIDER_NOT_SUPPORTED);
    }
}


