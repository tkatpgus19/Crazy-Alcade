package com.eni.backend.auth.oauth2.handler;

import com.eni.backend.auth.jwt.JwtTokenDto;
import com.eni.backend.auth.jwt.JwtUtil;
import com.eni.backend.auth.oauth2.HttpCookieOAuth2AuthorizationRequestRepository;
import com.eni.backend.auth.oauth2.service.OAuth2UserPrincipal;
import com.eni.backend.auth.oauth2.user.OAuth2Provider;
import com.eni.backend.auth.oauth2.user.OAuth2UserUnlinkManager;
import com.eni.backend.auth.oauth2.util.CookieUtils;
import com.eni.backend.member.repository.MemberRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Optional;

import static com.eni.backend.auth.oauth2.HttpCookieOAuth2AuthorizationRequestRepository.MODE_PARAM_COOKIE_NAME;
import static com.eni.backend.auth.oauth2.HttpCookieOAuth2AuthorizationRequestRepository.REDIRECT_URI_PARAM_COOKIE_NAME;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository;
    private final JwtUtil jwtUtil;
    private final OAuth2UserUnlinkManager oAuth2UserUnlinkManager;
    private final MemberRepository memberRepository;

    // 인증 성공
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        String targetUrl = determineTargetUrl(request, response, authentication);

        if (response.isCommitted()) {
            logger.debug("응답이 이미 커밋되었습니다. " + targetUrl + "로 리다이렉션 할 수 없습니다.");
            return;
        }

        clearAuthenticationAttributes(request, response);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    // target URL을 결정
    protected String determineTargetUrl(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) {

        Optional<String> redirectUri = CookieUtils.getCookie(request, REDIRECT_URI_PARAM_COOKIE_NAME)
                .map(Cookie::getValue);

        String targetUrl = redirectUri.orElse(getDefaultTargetUrl());

        String mode = CookieUtils.getCookie(request, MODE_PARAM_COOKIE_NAME)
                .map(Cookie::getValue)
                .orElse("");

        OAuth2UserPrincipal principal = getOAuth2UserPrincipal(authentication);

        if (principal == null) {
            return UriComponentsBuilder.fromUriString(targetUrl)
                    .queryParam("status", "Failed")
                    .build().toUriString();
        }

        // 로그인 모드일 때
        if ("login".equalsIgnoreCase(mode)) {

            log.info("email={}, name={}, profileUrl={}, accessToken={}, providerType={}, exist={}",
                    principal.getUserInfo().getEmail(),
                    principal.getUserInfo().getName(),
                    principal.getUserInfo().getProfile(),
                    principal.getUserInfo().getAccessToken(),
                    principal.getUserInfo().getProvider(),
                    principal.getUserInfo().getAttributes().get("exist")
            );

            //로그인한 회원 존재 여부
            boolean isExist = (boolean) principal.getUserInfo().getAttributes().get("exist");
            JwtTokenDto token = jwtUtil.createToken(principal.getUserInfo().getEmail(), principal.getUserInfo().getAttributes().get("memberId").toString());

            //회원이 존재하는 경우
            if(isExist) {
                //TODO: 로그인 후 페이지로 리다이렉트
                return UriComponentsBuilder.fromUriString(targetUrl)
                        .queryParam("access-token", token.getAccessToken())
                        .build().toUriString();
            } else {
                //TODO: 회원가입 페이지(닉네임)로 리다이렉트
                return UriComponentsBuilder.fromUriString(targetUrl)
                        .queryParam("access-token", token.getAccessToken())
                        .build().toUriString();
            }

        }
        // 연결 해제 모드일 때
        else if ("unlink".equalsIgnoreCase(mode)) {

            String accessToken = principal.getUserInfo().getAccessToken();
            OAuth2Provider oAuth2Provider = principal.getUserInfo().getProvider();

            // TODO: DB 삭제
            // TODO: 리프레시 토큰 삭제

            oAuth2UserUnlinkManager.unlink(oAuth2Provider, accessToken);

            return UriComponentsBuilder.fromUriString(targetUrl)
                    .build().toUriString();
        }

        return UriComponentsBuilder.fromUriString(targetUrl)
                .queryParam("status", "Login failed")
                .build().toUriString();
    }

    private OAuth2UserPrincipal getOAuth2UserPrincipal(Authentication authentication) {
        Object principal = authentication.getPrincipal();

        if (principal instanceof OAuth2UserPrincipal) {
            return (OAuth2UserPrincipal) principal;
        }

        return null;
    }

    protected void clearAuthenticationAttributes(HttpServletRequest request,
                                                 HttpServletResponse response) {
        super.clearAuthenticationAttributes(request);
        httpCookieOAuth2AuthorizationRequestRepository.removeAuthorizationRequestCookies(request, response);
    }
}