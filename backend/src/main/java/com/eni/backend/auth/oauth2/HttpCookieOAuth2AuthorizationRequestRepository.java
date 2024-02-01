package com.eni.backend.auth.oauth2;

import com.eni.backend.auth.oauth2.util.CookieUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/*
    - 인증 요청을 쿠키에 저장하고 검색하는 기능
    - OAuth2 프로토콜은 CSRF 공격을 방지하기 위해 STATE 매개 변수 사용을 권장
    - 인증 과정 중 앱은 인증 요청에 매개변수를 담고, OAuth2 공급자는 OAuth2 콜백에서 변경되지 않은 해당 매개 변수를 반환
    - 앱은 OAuth2 공급자로부터 반환된 매개 변수의 값을 비교, 일치하지 않으면 인증 요청 거부
    - 즉, 앱이 상태 매개 변수를 저장하고 후에 OAuth2 공급자에서 반환된 상태와 비교할 수 있어야 하고,
      이를 위해 상태와 redirect_uri를 저장하도록 설정
 */

//쿠키에 저장된 oauth2_auth_request의 정보를 OAuth2AuthorizationRequest로 꺼낸다.
@RequiredArgsConstructor
@Component
public class HttpCookieOAuth2AuthorizationRequestRepository implements AuthorizationRequestRepository<OAuth2AuthorizationRequest> {
    public static final String OAUTH2_AUTHORIZATION_REQUEST_COOKIE_NAME = "oauth2_auth_request";
    public static final String REDIRECT_URI_PARAM_COOKIE_NAME = "redirect_uri";
    public static final String MODE_PARAM_COOKIE_NAME = "mode";
    private static final int COOKIE_EXPIRE_SECONDS = 180;

    //oauth2_auth_request, redirect_uri, mode 쿠키에 저장
    @Override
    public OAuth2AuthorizationRequest loadAuthorizationRequest(HttpServletRequest request) {
        return CookieUtils.getCookie(request, OAUTH2_AUTHORIZATION_REQUEST_COOKIE_NAME)
                .map(cookie -> CookieUtils.deserialize(cookie, OAuth2AuthorizationRequest.class))
                .orElse(null);
    }


    @Override
    public void saveAuthorizationRequest(OAuth2AuthorizationRequest authorizationRequest, HttpServletRequest request, HttpServletResponse response) {
        if (authorizationRequest == null) {
            CookieUtils.deleteCookie(request, response, OAUTH2_AUTHORIZATION_REQUEST_COOKIE_NAME);
            CookieUtils.deleteCookie(request, response, REDIRECT_URI_PARAM_COOKIE_NAME);
            CookieUtils.deleteCookie(request, response, MODE_PARAM_COOKIE_NAME);
            return;
        }

        CookieUtils.addCookie(response,
                OAUTH2_AUTHORIZATION_REQUEST_COOKIE_NAME,
                CookieUtils.serialize(authorizationRequest),
                COOKIE_EXPIRE_SECONDS);

        String redirectUriAfterLogin = request.getParameter(REDIRECT_URI_PARAM_COOKIE_NAME);
        if (StringUtils.hasText(redirectUriAfterLogin)) {
            CookieUtils.addCookie(response,
                    REDIRECT_URI_PARAM_COOKIE_NAME,
                    redirectUriAfterLogin,
                    COOKIE_EXPIRE_SECONDS);
        }

        String mode = request.getParameter(MODE_PARAM_COOKIE_NAME);
        if (StringUtils.hasText(mode)) {
            CookieUtils.addCookie(response,
                    MODE_PARAM_COOKIE_NAME,
                    mode,
                    COOKIE_EXPIRE_SECONDS);
        }
    }

    //Http 요청의 쿠키에 저장 했던 OAuth2AuthorizationRequest 객체 리턴
    @Override
    public OAuth2AuthorizationRequest removeAuthorizationRequest(HttpServletRequest request, HttpServletResponse response) {
        return this.loadAuthorizationRequest(request);
    }

    //쿠키에 저장된 정보 삭제
    public void removeAuthorizationRequestCookies(HttpServletRequest request, HttpServletResponse response) {
        CookieUtils.deleteCookie(request, response, OAUTH2_AUTHORIZATION_REQUEST_COOKIE_NAME);
        CookieUtils.deleteCookie(request, response, REDIRECT_URI_PARAM_COOKIE_NAME);
        CookieUtils.deleteCookie(request, response, MODE_PARAM_COOKIE_NAME);
    }
}