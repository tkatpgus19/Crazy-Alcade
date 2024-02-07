package com.eni.backend.member.dto.response;

import com.eni.backend.auth.oauth2.user.OAuth2Provider;
import com.eni.backend.member.entity.Language;
import com.eni.backend.member.entity.Level;
import com.eni.backend.member.entity.Member;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.sql.Timestamp;

@ToString
@Getter
public class GetMemberListResponse {
    private Long memberId;
    private String email;
    private OAuth2Provider provider;
    private String socialId;
    private String nickname;
    private String profile;
    private Integer coin;
    private Integer exp;
    private Language lang;
    private Integer complaint;
    private Timestamp connectedAt;
    private Level level;

    @Builder
    private GetMemberListResponse(Long memberId, String email, OAuth2Provider provider, String socialId, String nickname, String profile, Integer coin, Integer exp, Language lang, Integer complaint, Timestamp connectedAt, Level level) {
        this.memberId = memberId;
        this.email = email;
        this.provider = provider;
        this.socialId = socialId;
        this.nickname = nickname;
        this.profile = profile;
        this.coin = coin;
        this.exp = exp;
        this.lang = lang;
        this.complaint = complaint;
        this.connectedAt = connectedAt;
        this.level = level;
    }

    public static GetMemberListResponse of(Member member) {
        return builder()
                .memberId(member.getId())
                .email(member.getEmail())
                .provider(member.getProvider())
                .socialId(member.getSocialId())
                .nickname(member.getNickname())
                .profile(member.getProfile())
                .coin(member.getCoin())
                .exp(member.getExp())
                .lang(member.getLang())
                .complaint(member.getComplaint())
                .connectedAt(member.getConnectedAt())
                .level(member.getLevel())
                .build();
    }
}
