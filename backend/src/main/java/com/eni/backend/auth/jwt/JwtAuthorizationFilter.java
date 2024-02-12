package com.eni.backend.auth.jwt;

//import com.eni.backend.common.exception.CustomUnauthorizedException;

import com.eni.backend.member.dto.SecurityMemberDto;
import com.eni.backend.member.entity.Member;
import com.eni.backend.member.service.MemberService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
@Component
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";
    private final JwtTokenProvider jwtTokenProvider;
    private final MemberService memberService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return request.getRequestURI().contains("auth/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // 사용자가 보낸 토큰을 확인
        String accessToken = resolveToken(request);

//        // 토큰 검사 생략(모두 허용 URL의 경우 토큰 검사 통과)
//        if (!StringUtils.hasText(accessToken)) {
//            doFilter(request, response, filterChain);
//            return;
//        }

        // access token이 유효
        if (jwtTokenProvider.validateToken(accessToken) == JwtStatus.ACCESS) {
            // memberId로 member 찾기
            Member member = memberService.validateMemberByToken(jwtTokenProvider.getMemberId(accessToken));

            //SecurityContext에 저장할 Member 객체 생성
            SecurityMemberDto securityDto = SecurityMemberDto.from(member);

            Authentication authentication = jwtTokenProvider.getAuthentication(securityDto);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

//        // access token 이 만료
//        else if (jwtTokenProvider.validateToken(accessToken) == JwtStatus.EXPIRED) {
//            //만료된 토큰이므로 Exception 던지기 -> 프론트에서 다시 토큰 재발급 요청
//            throw new CustomUnauthorizedException(EXPIRED_TOKEN);
//        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String token = request.getHeader(AUTHORIZATION_HEADER);

        if (StringUtils.hasText(token) && token.startsWith(BEARER_PREFIX)) {
            return token.substring(BEARER_PREFIX.length());
        }

        return null;
    }

}