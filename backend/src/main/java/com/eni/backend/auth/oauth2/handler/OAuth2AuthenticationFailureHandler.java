package com.eni.backend.auth.oauth2.handler;

import com.eni.backend.common.exception.CustomUnauthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import static com.eni.backend.common.response.BaseResponseStatus.SOCIAL_AUTHORIZATION_FAIL;

@Component
@Slf4j
public class OAuth2AuthenticationFailureHandler implements AuthenticationFailureHandler {
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) {
        // 인증 실패
        log.error("fail {}", exception.getMessage());
        throw new CustomUnauthorizedException(SOCIAL_AUTHORIZATION_FAIL);
    }
}

