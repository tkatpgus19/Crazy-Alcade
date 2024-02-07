package com.eni.backend.auth.jwt;

import com.eni.backend.common.exception.CustomBadRequestException;
import com.eni.backend.common.exception.CustomUnauthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import static com.eni.backend.common.response.BaseResponseStatus.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthInterceptor implements HandlerInterceptor {

    private static final String JWT_TOKEN_PREFIX = "Bearer ";
    private final JwtTokenProvider jwtTokenProvider;


    // 인가 과정 -> 컨트롤러 호출 전에 진행되어야 한다.
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        log.info("[JwtAuthInterceptor.preHandle]");

        String accessToken = resolveAccessToken(request);
        validateAccessToken(accessToken);

        return true;
    }

    private String resolveAccessToken(HttpServletRequest request) {
        String token = request.getHeader(HttpHeaders.AUTHORIZATION);
        validateToken(token);
        return token.substring(JWT_TOKEN_PREFIX.length());
    }

    private void validateToken(String token) {
        if (token == null) {
            throw new CustomBadRequestException(TOKEN_NOT_FOUND);
        }
        if (!token.startsWith(JWT_TOKEN_PREFIX)) {
            throw new CustomBadRequestException(UNSUPPORTED_TOKEN_TYPE);
        }
    }

    private void validateAccessToken(String accessToken) {
        if (jwtTokenProvider.isExpiredToken(accessToken)) {
            throw new CustomUnauthorizedException(EXPIRED_TOKEN);
        }
    }

}