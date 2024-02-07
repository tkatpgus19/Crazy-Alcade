package com.eni.backend.auth.oauth2.service;

import com.eni.backend.auth.oauth2.user.OAuth2UserInfo;
import com.eni.backend.auth.oauth2.user.OAuth2UserInfoFactory;
import com.eni.backend.common.exception.CustomUnauthorizedException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import static com.eni.backend.common.response.BaseResponseStatus.EMAIL_NOT_FOUND;

@Slf4j
@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        log.info("CustomOAuth2UserService.loadUser");

        // 기본 OAuth2UserService 객체 생성
        OAuth2UserService<OAuth2UserRequest, OAuth2User> oAuth2UserService = new DefaultOAuth2UserService();

        // OAuth2UserService를 사용하여 OAuth2User 정보를 가져온다.
        OAuth2User oAuth2User = oAuth2UserService.loadUser(userRequest);

        // 클라이언트 등록 ID (google, kakao)
        String registrationId = userRequest.getClientRegistration()
                .getRegistrationId();

        // 액세스 토큰
        String accessToken = userRequest.getAccessToken().getTokenValue();

        log.info("registrationId {}", registrationId);
        log.info("accessToken {}", accessToken);

        // 유저 정보
        OAuth2UserInfo oAuth2UserInfo =
                OAuth2UserInfoFactory.getOAuth2UserInfo(registrationId,
                        accessToken,
                        oAuth2User.getAttributes());

        log.info("OAuth2UserInfo");
        // 이메일 오류
        if (!StringUtils.hasText(oAuth2UserInfo.getEmail())) {
            throw new CustomUnauthorizedException(EMAIL_NOT_FOUND);
        }

        return OAuth2UserPrincipal.of(oAuth2UserInfo);
    }
}