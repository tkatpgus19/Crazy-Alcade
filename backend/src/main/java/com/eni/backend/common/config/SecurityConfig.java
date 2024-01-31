package com.eni.backend.common.config;

import lombok.RequiredArgsConstructor;
import com.eni.backend.auth.jwt.JwtAuthorizationFilter;
import com.eni.backend.auth.jwt.JwtCustomExceptionFilter;
import com.eni.backend.auth.oauth2.HttpCookieOAuth2AuthorizationRequestRepository;
import com.eni.backend.auth.oauth2.handler.OAuth2AuthenticationFailureHandler;
import com.eni.backend.auth.oauth2.handler.OAuth2AuthenticationSuccessHandler;
import com.eni.backend.auth.oauth2.service.CustomOAuth2UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;

// Security 작업 설정

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtCustomExceptionFilter jwtCustomExceptionFilter;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
    private final OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;
    private final HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository;
    private final JwtAuthorizationFilter jwtAuthorizationFilter;

    // JWT를 사용하면 Session에 저장하지 않고 Authorization Request를 Based64 encoded cookie에 저장
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests((requests) -> requests
                        .requestMatchers(antMatcher("/api/admin/**")).hasRole("ADMIN")
                        .requestMatchers(antMatcher("/api/member/**")).hasRole("MEMBER")
                        .requestMatchers(antMatcher("/api/**")).permitAll()
                        .anyRequest().authenticated()
                )

                //Session 방식이 아닌 Token을 만들어 Cookie에 저장 할 것이기 때문에
                //sessionCreationPolicy에서 STATELESS를 넣어 Session에 저장하지 않도록 함
                .sessionManagement(sessions -> sessions.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .oauth2Login(configure ->
                        configure.authorizationEndpoint(config -> config.authorizationRequestRepository(httpCookieOAuth2AuthorizationRequestRepository))
                                //userService()는 OAuth2 인증 과정에서 Authentication 생성에 필요한 OAuth2User 를 반환하는 클래스를 지정한다.
                                .userInfoEndpoint(config -> config.userService(customOAuth2UserService))  // 회원 정보 처리
                                //결과에 따른 custom handler 사용
                                .successHandler(oAuth2AuthenticationSuccessHandler)
                                .failureHandler(oAuth2AuthenticationFailureHandler)
                );

        // 지정된 필터 앞에 커스텀 필터를 추가 (UsernamePasswordAuthenticationFilter 보다 먼저 실행)
        http.addFilterBefore(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class);
        // 지정된 필터 앞에 커스텀 필터를 추가 (jwtCustomExceptionFilter 보다 먼저 실행)
        http.addFilterBefore(jwtCustomExceptionFilter, AuthorizationFilter.class);
        return http.build();
    }
}