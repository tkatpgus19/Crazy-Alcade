package com.eni.backend.member.dto.request;

import com.eni.backend.auth.oauth2.user.OAuth2Provider;
import com.eni.backend.common.entity.Language;
import com.eni.backend.member.entity.Level;
import com.eni.backend.member.entity.Member;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.sql.Timestamp;

@Getter
public class MemberRequestDto {

    @NotBlank(message = "Email 아이디가 없습니다.")
    private String email;

    @NotBlank(message = "Provider가 없습니다.")
    private OAuth2Provider provider;

    @NotBlank(message = "Social ID가 없습니다.")
    private String socialId;

    @NotBlank(message = "닉네임을 입력해주세요.")
    private String nickname;

    @NotBlank(message = "프로필 사진을 등록해주세요.")
    private String profile;

    @NotNull(message = "코인 값이 비어있습니다.")
    private Integer coin;

    @NotNull(message = "exp 값이 비어있습니다.")
    private Integer exp;

    @NotBlank(message = "선호 언어 미선택.")
    private Language lang;

    @NotNull(message = "level 값이 없습니다.")
    private Level level;

    @NotNull(message = "complaint 값이 없습니다.")
    private Integer complaint;

    @NotBlank(message = "접속 시간 값이 없습니다.")
    private Timestamp connectedAt;

    @Builder
    private MemberRequestDto(String email, OAuth2Provider provider, String socialId, String nickname, String profile, Integer coin, Integer exp, Language lang, Level level, Integer complaint, Timestamp connectedAt) {
        this.email = email;
        this.provider = provider;
        this.socialId = socialId;
        this.nickname = nickname;
        this.profile = profile;
        this.coin = coin;
        this.exp = exp;
        this.lang = lang;
        this.level = level;
        this.complaint = complaint;
        this.connectedAt = connectedAt;

    }

    public static MemberRequestDto of(String email, OAuth2Provider provider, String socialId, String nickname, String profile, Integer coin, Integer exp, Language lang, Level level, Integer complaint, Timestamp connectedAt) {
        return builder()
                .email(email)
                .provider(provider)
                .socialId(socialId)
                .nickname(nickname)
                .profile(profile)
                .coin(coin)
                .exp(exp)
                .lang(lang)
                .level(level)
                .complaint(complaint)
                .connectedAt(connectedAt)
                .build();
    }

    public Member toEntity() {
        return Member.builder()
                .email(email)
                .provider(provider)
                .socialId(socialId)
                .nickname(nickname)
                .profile(profile)
                .coin(coin)
                .exp(exp)
                .lang(lang)
                .level(level)
                .complaint(complaint)
                .connectedAt(connectedAt)
                .build();
    }
}