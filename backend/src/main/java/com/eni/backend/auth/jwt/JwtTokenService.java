package com.eni.backend.auth.jwt;

import com.eni.backend.auth.redis.RedisProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Optional;

// imports 생략

@Service
@RequiredArgsConstructor
public class JwtTokenService {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";

    private final JwtTokenRepository jwtTokenRepository;
    private JwtUtil jwtUtil;

    @Autowired
    public void setJwtUtil(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public void saveTokenInfo(String email, String refreshToken, String accessToken) {
        jwtTokenRepository.save(new RedisProperties(email, accessToken, refreshToken));
    }

    @Transactional
    public String reCreatAccessToken(String accessToken) {
        Optional<RedisProperties> refreshToken = jwtTokenRepository.findByAccessToken(resolveToken(accessToken));

        if (refreshToken.isPresent() && (jwtUtil.validateToken(refreshToken.get().getRefreshToken()) == JwtStatus.ACCESS)) {
            RedisProperties resultToken = refreshToken.get();
            String newAccessToken = jwtUtil.createAccessToken(resultToken.getId(), jwtUtil.getMemberId(resultToken.getId()));
            resultToken.updateAccessToken(newAccessToken);
            jwtTokenRepository.save(resultToken);
            return newAccessToken;
        }

        return null;
    }

    @Transactional
    public void removeRefreshToken(String accessToken) {
        RedisProperties token = jwtTokenRepository.findByAccessToken(resolveToken(accessToken))
                .orElseThrow(IllegalArgumentException::new);

        jwtTokenRepository.delete(token);
    }

    private String resolveToken(String token) {
        if (StringUtils.hasText(token) && token.startsWith(BEARER_PREFIX)) {
            return token.substring(BEARER_PREFIX.length());
        }

        return null;
    }
}
