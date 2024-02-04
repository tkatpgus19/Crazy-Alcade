package com.eni.backend.auth.jwt;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class JwtController {

//    private final JwtAuthTokenService jwtAuthTokenService;
//
//    @PostMapping("/token/logout")
//    public ResponseEntity<BaseResponseStatus> logout(@RequestHeader(value = "Authorization") final String accessToken) throws UnsupportedEncodingException {
//        System.out.println("access token : " + accessToken);
//        // 엑세스 토큰으로 현재 Redis 정보 삭제
//        jwtAuthTokenService.removeRefreshToken(accessToken);
//
//        return ResponseEntity.ok(BaseResponseStatus.LOGOUT_SUCCESS);
//    }
//
//    @PostMapping("/token/refresh")
//    public ResponseEntity<String> refresh(@RequestHeader("Authorization") final String accessToken) {
//
//        String newAccessToken = jwtAuthTokenService.recreateAccessToken(accessToken);
//        if (StringUtils.hasText(newAccessToken)) {
//            return ResponseEntity.ok(newAccessToken);
//        }
//
//        return ResponseEntity.badRequest().body("access token을 만들지 못했습니다.");
//    }
}
