package com.eni.backend.auth.oauth2.service;

import com.eni.backend.auth.oauth2.user.OAuth2UserInfo;
import com.eni.backend.auth.oauth2.user.OAuth2UserInfoFactory;
import com.eni.backend.common.entity.Language;
import com.eni.backend.common.exception.CustomUnauthorizedException;
import com.eni.backend.member.dto.request.MemberRequestDto;
import com.eni.backend.member.entity.Member;
import com.eni.backend.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Optional;

import static com.eni.backend.common.response.BaseResponseStatus.SOCIAL_EMAIL_NOT_FOUND;


/*
    - UserPrincipalDetailsService 클래스 역할 = User 정보를 가져오는 역할
    - 가져온 User의 정보는 UserPrincipal로 변경해 Spring Security로 전달
    - OAuth2 공급자로부터 Access Token을 받은 이후 호출
    - If, 동일한 이메일이 DB에 존재하지 않을 경우 사용자 정보를 등록
    - 사용자가 존재하면 사용자 정보 업데이트
 */
@RequiredArgsConstructor
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberService memberService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);

        try {
            return processOAuth2User(oAuth2UserRequest, oAuth2User);
        } catch (AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            // Throwing an instance of AuthenticationException will trigger the OAuth2AuthenticationFailureHandler
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oAuth2User) {

        String registrationId = userRequest.getClientRegistration()
                .getRegistrationId();

        String accessToken = userRequest.getAccessToken().getTokenValue();

        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(registrationId,
                accessToken,
                oAuth2User.getAttributes());

        // OAuth2UserInfo field value validation
        if (!StringUtils.hasText(oAuth2UserInfo.getEmail())) {
            throw new CustomUnauthorizedException(SOCIAL_EMAIL_NOT_FOUND);
        }

        String email = oAuth2UserInfo.getEmail();
        Optional<Member> findMember = memberService.findByEmail(email);

        if (findMember.isEmpty()) {
            //회원이 존재하지 않는 경우
            oAuth2UserInfo.getAttributes().put("exist", false);

            MemberRequestDto memberRequestDto = MemberRequestDto.of(oAuth2UserInfo.getEmail(), oAuth2UserInfo.getProvider(), oAuth2UserInfo.getName(), oAuth2UserInfo.getProfile(),
                    0, 0, Language.JAVA, null, 0, Timestamp.valueOf(LocalDateTime.now()));

            Long memberId = memberService.joinMember(memberRequestDto);
            oAuth2UserInfo.getAttributes().put("memberId", memberId);
        } else {
            //회원이 존재하는 경우
            oAuth2UserInfo.getAttributes().put("exist", true);
            oAuth2UserInfo.getAttributes().put("memberId", findMember.get().getId());
        }

        return new OAuth2UserPrincipal(oAuth2UserInfo);
    }
}
