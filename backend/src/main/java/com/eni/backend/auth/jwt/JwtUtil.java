package com.eni.backend.auth.jwt;

import com.eni.backend.member.dto.SecurityMemberDto;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Collections;
import java.util.Date;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtUtil {

    @Setter
    private JwtTokenService jwtTokenService;

    public static final long ACCESS_TOKEN_EXPIRE_TIME_IN_MILLISECONDS = 1000 * 60 * 60; // One Hour
    private static final long REFRESH_TOKEN_EXPIRE_TIME_IN_MILLISECONDS = 1000L * 60L * 60L * 24L * 14; // 2 weeks

    @Value("${jwt.secret}")
    private String secret;
    private Key key;

    @PostConstruct
    public void init() {
        byte[] key = Decoders.BASE64URL.decode(secret);
        this.key = Keys.hmacShaKeyFor(key);
    }

    public JwtTokenDto responseTokenDto(String email, String memberId) {
        String refreshToken = createRefreshToken(email, memberId);
        String accessToken = createAccessToken(email, memberId);

        jwtTokenService.saveTokenInfo(email, refreshToken, accessToken);

        return new JwtTokenDto(accessToken, refreshToken);
    }

    // Access Token 생성하는 메소드
    public JwtTokenDto createToken(String email, String memberId) {
        // refreshToken과 accessToken을 생성한다.
        String accessToken= createAccessToken(email, memberId);
        String refreshToken = createRefreshToken(email, memberId);

        // 토큰을 Redis에 저장한다.
        jwtTokenService.saveTokenInfo(email, refreshToken, accessToken);
        return new JwtTokenDto(accessToken, refreshToken);
    }

    public String createAccessToken(String email, String memberId) {

//        Long tokenPeriod = 1000L * 2L; //2초

        //새로운 클레임 객체 생성, 이메일 세팅
        Claims claims = Jwts.claims().setSubject(email);
        claims.put("memberId", memberId);

        //현재 시간과 날짜
        Date now = new Date();

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + ACCESS_TOKEN_EXPIRE_TIME_IN_MILLISECONDS))
//                .setExpiration(new Date(now.getTime() + tokenPeriod))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String createRefreshToken(String email , String memberId) {

        //새로운 클레임 객체 생성, 이메일 세팅
        Claims claims = Jwts.claims().setSubject(email);
        claims.put("memberId", memberId);

        //현재 시간과 날짜
        Date now = new Date();

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + REFRESH_TOKEN_EXPIRE_TIME_IN_MILLISECONDS))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 토큰 유효성 검사
    public JwtStatus validateToken(String token) {

        try {
            Jwts.parserBuilder()
                    .setSigningKey(key) // secret key로 서명되었음
                    .build()
                    .parseClaimsJws(token);

            return JwtStatus.ACCESS;
        } catch (UnsupportedJwtException | MalformedJwtException exception) {
            return JwtStatus.FAIL;
        } catch (SignatureException exception) {
            return JwtStatus.FAIL;
        } catch (ExpiredJwtException exception) {
            return JwtStatus.EXPIRED;
        } catch (IllegalArgumentException exception) {
            return JwtStatus.FAIL;
        } catch (Exception exception) {
            return JwtStatus.FAIL;
        }
    }

    public Authentication getAuthentication(SecurityMemberDto securityDto) {

        return new UsernamePasswordAuthenticationToken(securityDto, "",
                Collections.emptyList());
    }

    //토큰에서 email을 추출한다.
    public String getUid(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().getSubject();
    }

    //토큰에서 memberId를 추출한다.
    public String getMemberId(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().get("memberId", String.class);
    }
}