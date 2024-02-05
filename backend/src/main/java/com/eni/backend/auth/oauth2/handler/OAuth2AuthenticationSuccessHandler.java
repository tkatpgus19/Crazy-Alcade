package com.eni.backend.auth.oauth2.handler;

import com.eni.backend.common.response.BaseSuccessResponse;
import com.eni.backend.member.dto.response.LoginResponseDto;
import com.eni.backend.member.service.MemberService;
import com.nimbusds.jose.shaded.gson.Gson;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final MemberService memberService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        LoginResponseDto loginResponseDto = memberService.login(authentication);
        // 로그인 응답 객체 생성
        BaseSuccessResponse<?> result = BaseSuccessResponse.of("소셜 로그인에 성공하였습니다.", loginResponseDto);
//        String acceessToken = loginResponseDto.getAccessToken();

        // response
        response.setContentType(MediaType.APPLICATION_JSON_VALUE + ";charset=UTF-8");
        Gson gson = new Gson();
        String jsonStr = gson.toJson(result);
        response.getWriter().println(jsonStr);

//        getRedirectStrategy().sendRedirect(request, response, "");
    }


}