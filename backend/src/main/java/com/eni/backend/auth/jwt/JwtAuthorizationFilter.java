package com.eni.backend.auth.jwt;

import com.eni.backend.auth.oauth2.exception.GlobalExceptionCode;
import com.eni.backend.auth.oauth2.exception.JwtCustomException;
import com.eni.backend.member.dto.SecurityMemberDto;
import com.eni.backend.member.entity.Member;
import com.eni.backend.member.service.MemberService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
@Component
@Lazy
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";

    private final JwtUtil jwtUtil;
    private final MemberService memberService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return request.getRequestURI().contains("api/auth/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String tokenValue = resolveToken(request);

        if (StringUtils.hasText(tokenValue)) {
            JwtStatus jwtStatus = jwtUtil.validateToken(tokenValue);

            switch (jwtStatus) {
                case FAIL -> throw new JwtCustomException(GlobalExceptionCode.INVALID_TOKEN_VALUE);
                case ACCESS -> successValidatedToken(tokenValue);
                case EXPIRED -> throw new JwtException("Access Token 만료!");
            }
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String token = request.getHeader(AUTHORIZATION_HEADER);

        if (StringUtils.hasText(token) && token.startsWith(BEARER_PREFIX)) {
            return token.substring(BEARER_PREFIX.length());
        }

        return null;
    }

    private void successValidatedToken(String tokenValue) {
        Member findMember = memberService.findByEmail(jwtUtil.getUid(tokenValue))
                .orElseThrow(IllegalStateException::new);

        SecurityMemberDto securityMemberDto = SecurityMemberDto.of(findMember.getId(), findMember.getOAuth2Provider(), findMember.getEmail(),
                findMember.getNickname(), findMember.getProfile());

        Authentication authentication = jwtUtil.getAuthentication(securityMemberDto);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
