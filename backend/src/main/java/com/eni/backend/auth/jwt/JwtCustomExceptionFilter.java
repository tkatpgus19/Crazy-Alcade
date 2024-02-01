package com.eni.backend.auth.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


// TokenAuthenticationFilter 역할
// 요청으로부터 전달받은 JWT를 검증
// 토큰 유효성 검사 후 토큰에 있는 사용자 ID를 가져온다.
// ID를 통해 사용자의 모든 정보를 가져오고 UsernamePasswordAuthenticationToken을 만들어 인증 과정을 거친다.
@Component
@RequiredArgsConstructor
public class JwtCustomExceptionFilter extends OncePerRequestFilter {

    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (JwtException e) {
            response.setStatus(401);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding("UTF-8");
            objectMapper.writeValue(response.getWriter(), HttpStatus.UNAUTHORIZED);
        }
    }
}