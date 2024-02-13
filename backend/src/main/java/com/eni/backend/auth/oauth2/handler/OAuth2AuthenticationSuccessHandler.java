package com.eni.backend.auth.oauth2.handler;

import com.eni.backend.auth.jwt.JwtTokenProvider;
import com.eni.backend.auth.oauth2.HttpCookieOAuth2AuthorizationRequestRepository;
import com.eni.backend.auth.oauth2.service.OAuth2UserPrincipal;
import com.eni.backend.auth.oauth2.user.LoginInfo;
import com.eni.backend.auth.oauth2.user.OAuth2Provider;
import com.eni.backend.auth.oauth2.user.OAuth2UserUnlinkManager;
import com.eni.backend.auth.oauth2.util.CookieUtils;
import com.eni.backend.member.entity.Member;
import com.eni.backend.member.service.MemberService;
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
@RequiredArgsConstructor
@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository;
    private final OAuth2UserUnlinkManager oAuth2UserUnlinkManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final MemberService memberService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        String targetUrl;

        targetUrl = determineTargetUrl(request, response, authentication);

        if (response.isCommitted()) {

            logger.debug("Response has already been committed. Unable to redirect to " + targetUrl);
            return;
        }

        clearAuthenticationAttributes(request, response);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response,
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
                    .queryParam("error", "LoginFailed")
                    .build().toUriString();
        }

        // mode가 로그인일 때
        if ("login".equalsIgnoreCase(mode)) {
            log.info("id={}, email={}, accessToken={}, providerType={}",
                    principal.getUserInfo().getId(),
                    principal.getUserInfo().getEmail(),
                    principal.getUserInfo().getAccessToken(),
                    principal.getUserInfo().getProvider()
            );

            // TODO: DB 저장
            // TODO: 액세스 토큰 발급

            String socialId = principal.getUserInfo().getId();
            OAuth2Provider provider = principal.getUserInfo().getProvider();

            Optional<Member> findMember = memberService.findBySocialIdAndProvider(socialId, provider);
            Member member;
            LoginInfo loginInfo;

            if (findMember.isEmpty()) {
                loginInfo = memberService.loginOrJoinMember(Member.from(principal.getUserInfo()), false);

                // 액세스 토큰 발급
                String accessToken = jwtTokenProvider.generateAccessToken(authentication, loginInfo.getMemberId());

                //TODO: 회원가입 페이지(닉네임)로 리다이렉트
                return UriComponentsBuilder.fromUriString(targetUrl)
                        .queryParam("access-token", accessToken)
                        .queryParam("member-id", loginInfo.getMemberId())
                        .queryParam("is-new", loginInfo.isNew())
                        .queryParam("is-connected", loginInfo.isConnected())
                        .queryParam("next", "/")
                        .build().toUriString();

            } else {
                member = findMember.get();
                loginInfo = memberService.loginOrJoinMember(member, true);

                // 액세스 토큰 발급
                String accessToken = jwtTokenProvider.generateAccessToken(authentication, loginInfo.getMemberId());

                //TODO: 로그인 후 페이지로 리다이렉트
                return UriComponentsBuilder.fromUriString(targetUrl)
                        .queryParam("access-token", accessToken)
                        .queryParam("member-id", loginInfo.getMemberId())
                        .queryParam("is-new", loginInfo.isNew())
                        .queryParam("is-connected", loginInfo.isConnected())
                        .queryParam("next", "/")
                        .build().toUriString();
            }
        } else if ("unlink".equalsIgnoreCase(mode)) {

            String accessToken = principal.getUserInfo().getAccessToken();
            OAuth2Provider provider = principal.getUserInfo().getProvider();

            // TODO: DB 삭제
            oAuth2UserUnlinkManager.unlink(provider, accessToken);

            return UriComponentsBuilder.fromUriString(targetUrl)
                    .build().toUriString();
        }

        return UriComponentsBuilder.fromUriString(targetUrl)
                .queryParam("error", "LoginFailed")
                .build().toUriString();

    }

    private OAuth2UserPrincipal getOAuth2UserPrincipal(Authentication authentication) {

        Object principal = authentication.getPrincipal();

        if (principal instanceof OAuth2UserPrincipal) {
            return (OAuth2UserPrincipal) principal;
        }

        return null;
    }

    protected void clearAuthenticationAttributes(HttpServletRequest request, HttpServletResponse response) {

        super.clearAuthenticationAttributes(request);
        httpCookieOAuth2AuthorizationRequestRepository.removeAuthorizationRequestCookies(request, response);
    }
}
/**
 * OAuth2 인증 성공시 호출되는 핸들러
 * 프론트앤트에서 백엔드 로그인 요청시 mode 쿼리 파라미터에 담긴 값에 따라 분기하여 처리
 * mode=login -> 사용자 정보 DB 저장, 서비스 액세스 토큰, 리프레시 토큰 생성, 리프레시 토큰 DB 저장
 * mode=unlink -> 각 OAuth2 서비스에 맞는 연결 끊기 API 호출, 사용자 정보/ 리프레시 토큰 DB 삭제
 */