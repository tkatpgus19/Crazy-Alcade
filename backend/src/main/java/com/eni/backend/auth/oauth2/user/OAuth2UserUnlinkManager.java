package com.eni.backend.auth.oauth2.user;

import com.eni.backend.common.exception.CustomUnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import static com.eni.backend.common.response.BaseResponseStatus.PROVIDER_NOT_SUPPORTED;

@RequiredArgsConstructor
@Component
public class OAuth2UserUnlinkManager {

    private final GoogleOAuth2UserUnlink googleOAuth2UserUnlink;
    private final KakaoOAuth2UserUnlink kakaoOAuth2UserUnlink;

    public void unlink(OAuth2Provider provider, String accessToken) {
        if (OAuth2Provider.GOOGLE.equals(provider)) {
            googleOAuth2UserUnlink.unlink(accessToken);
        }
        else if (OAuth2Provider.KAKAO.equals(provider)) {
            kakaoOAuth2UserUnlink.unlink(accessToken);
        }
        else {
            throw new CustomUnauthorizedException(PROVIDER_NOT_SUPPORTED);
        }
    }
}
