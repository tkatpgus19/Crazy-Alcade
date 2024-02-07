package com.eni.backend.auth.jwt;

import com.eni.backend.auth.oauth2.service.OAuth2UserPrincipal;
import com.eni.backend.auth.oauth2.user.OAuth2Provider;
import com.eni.backend.common.exception.CustomBadRequestException;
import com.eni.backend.common.exception.CustomUnauthorizedException;
import com.eni.backend.member.dto.SecurityMemberDto;
import com.eni.backend.member.dto.response.PutNicknameResponse;
import com.eni.backend.member.entity.Member;
import com.eni.backend.member.repository.MemberRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Base64;
import java.util.Collections;
import java.util.Date;
import java.util.Optional;

import static com.eni.backend.common.response.BaseResponseStatus.*;

@Slf4j
@RequiredArgsConstructor
@Component
public class JwtTokenProvider implements InitializingBean {

    @Value("${secret.jwt-secret-key}")
    private String JWT_SECRET_KEY;

    @Value("${secret.jwt-expired-in}")
    private long JWT_EXPIRED_IN;

    private Key key;

    private final long accessTokenValidTime = (60 * 1000) * 30; // 30분
    //    private final long refreshTokenValidTime = (60 * 1000) * 60 * 24 * 7; // 7일
    private final String AUTHORITIES_KEY = "auth";

    private final MemberRepository memberRepository;

    @PostConstruct
    protected void init() {
        String encodedKey = Base64.getEncoder().encodeToString(JWT_SECRET_KEY.getBytes());
        key = Keys.hmacShaKeyFor(encodedKey.getBytes());
    }

    public String generateToken(Authentication authentication, Long memberId, Long accessTokenValidTime) {
        OAuth2UserPrincipal principal = getOAuth2UserPrincipal(authentication);
        OAuth2Provider provider = principal.getUserInfo().getProvider();
        String socialId = principal.getUserInfo().getId();

        Date now = new Date();
        Date expiration = new Date(now.getTime() + accessTokenValidTime);

        return Jwts.builder()
                .setSubject(memberId.toString())
                .claim("provider", provider.name())
                .claim("socialId", socialId)
                .setIssuedAt(now)
                .setExpiration(expiration)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateAccessToken(Authentication authentication, Long memberId) {
        return generateToken(authentication, memberId, accessTokenValidTime);
    }

//    public String generateRefreshToken(OAuth2UserPrincipal principal) {
//        return generateToken(principal, refreshTokenValidTime);
//    }

    private Claims getClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (SecurityException e) {
            throw new CustomUnauthorizedException(INVALID_TOKEN);
        } catch (MalformedJwtException e) {
            throw new CustomUnauthorizedException(INVALID_TOKEN);
        } catch (ExpiredJwtException e) {
            throw new CustomUnauthorizedException(EXPIRED_TOKEN);
        } catch (UnsupportedJwtException e) {
            throw new CustomUnauthorizedException(UNSUPPORTED_TOKEN_TYPE);
        } catch (IllegalArgumentException e) {
            throw new CustomBadRequestException(JWT_ERROR);
        }
    }

    public Authentication getAuthentication(SecurityMemberDto memberDto) {
        return new UsernamePasswordAuthenticationToken(memberDto, "",
                Collections.emptyList());
    }

    public boolean isExpiredToken(String token) {
        try {
            return getClaims(token).getExpiration().before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        } catch (UnsupportedJwtException e) {
            throw new CustomUnauthorizedException(UNSUPPORTED_TOKEN_TYPE);
        } catch (MalformedJwtException e) {
            throw new CustomUnauthorizedException(MALFORMED_TOKEN);
        } catch (IllegalArgumentException e) {
            throw new CustomUnauthorizedException(INVALID_TOKEN);
        } catch (JwtException e) {
            log.error("[JwtTokenProvider.validateAccessToken]", e);
            throw e;
        }
    }

    public JwtStatus validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return JwtStatus.ACCESS;
        } catch (ExpiredJwtException e) {
            return JwtStatus.EXPIRED;
        } catch (Exception e) {
            return JwtStatus.DENIED;
        }
    }

    public Long getMemberId(String token) {
        String subject = Jwts.parserBuilder()
                .setSigningKey(key).build()
                .parseClaimsJws(token)
                .getBody().getSubject();
        return Long.parseLong(subject);
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        this.key = Keys.hmacShaKeyFor(JWT_SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }

    public Long getMemberIdFromExpiredToken(String token) {
        try {
            return getMemberId(token);
        } catch (ExpiredJwtException e) {
            // 만료된 토큰에서 사용자 ID를 추출
            // access token이 만료되었지만 refresh token 이 존재하는 경우
            Claims expiredClaims = e.getClaims();
            return Long.parseLong(expiredClaims.get("memberId", String.class));
        }
    }

    private OAuth2UserPrincipal getOAuth2UserPrincipal(Authentication authentication) {
        Object principal = authentication.getPrincipal();

        if (principal instanceof OAuth2UserPrincipal) {
            return (OAuth2UserPrincipal) principal;
        }

        throw new CustomUnauthorizedException(INVALID_TOKEN);
    }

    public SecurityMemberDto getSecurityMemberDto(Authentication authentication) {
        Object principal = authentication.getPrincipal();

        if (principal instanceof SecurityMemberDto) {
            return (SecurityMemberDto) principal;
        }

        throw new CustomUnauthorizedException(INVALID_TOKEN);
    }

}
