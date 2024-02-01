package com.eni.backend.auth.jwt;

import com.eni.backend.common.response.BaseResponseStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;

@Slf4j
@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class JwtController {

    private final JwtTokenService jwtTokenService;

    @PostMapping("/token/logout")
    public ResponseEntity<BaseResponseStatus> logout(@RequestHeader(value = "Authorization") final String accessToken) throws UnsupportedEncodingException {
        System.out.println("access token : " + accessToken);
        // 엑세스 토큰으로 현재 Redis 정보 삭제
        jwtTokenService.removeRefreshToken(accessToken);

        return ResponseEntity.ok(BaseResponseStatus.LOGOUT_SUCCESS);
    }

    @PostMapping("/token/refresh")
    public ResponseEntity<String> refresh(@RequestHeader("Authorization") final String accessToken) {

        String newAccessToken = jwtTokenService.reCreatAccessToken(accessToken);
        if (StringUtils.hasText(newAccessToken)) {
            return ResponseEntity.ok(newAccessToken);
        }

        return ResponseEntity.badRequest().body("access token을 만들지 못했습니다.");
    }
}
