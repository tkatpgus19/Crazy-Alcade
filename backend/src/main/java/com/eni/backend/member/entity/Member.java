package com.eni.backend.member.entity;

import com.eni.backend.auth.oauth2.user.OAuth2Provider;
import com.eni.backend.auth.oauth2.user.OAuth2UserInfo;
import com.eni.backend.code.entity.Code;
import com.eni.backend.common.entity.BaseTimeEntity;
import com.eni.backend.common.entity.Language;
import com.eni.backend.item.entity.MemberItem;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "member")
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id", nullable = false)
    private Long id;

    @Column(nullable = false, length = 20)
    private String email;

    @Enumerated(EnumType.STRING)
    private OAuth2Provider provider;

    @Column(nullable = false)
    private String socialId;

    @Column(length = 8)
    private String nickname;

    @Column
    private String profile;

    @Column(nullable = false)
    @ColumnDefault("0")
    private Integer coin;

    @Column(nullable = false)
    @ColumnDefault("0")
    private Integer exp;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Language lang;

    @Column
    @ColumnDefault("0")
    private Integer complaint;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Timestamp connectedAt;

    @OneToOne
    @JoinColumn(name = "level_id")
    private Level level;

    @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE)
    private List<Code> codes = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE)
    private List<MemberItem> memberItems = new ArrayList<>();

    @Builder
    private Member(String email, OAuth2Provider provider, String socialId, String nickname, String profile, Integer coin, Integer exp, Language lang, Level level, Integer complaint, Timestamp connectedAt) {
        this.email = email;
        this.socialId = socialId;
        this.provider = provider;
        this.nickname = nickname;
        this.profile = profile;
        this.coin = coin;
        this.exp = exp;
        this.lang = lang;
        this.complaint = complaint;
        this.level = level;
        this.connectedAt = connectedAt;
    }

    public static Member of(String email, OAuth2Provider provider, String socialId, String nickname, String profile, Integer coin, Integer exp, Language lang, Level level, Integer complaint, Timestamp connectedAt) {
        return builder()
                .email(email)
                .provider(provider)
                .socialId(socialId)
                .nickname(nickname)
                .profile(profile)
                .lang(lang)
                .coin(coin)
                .exp(exp)
                .complaint(complaint)
                .level(level)
                .connectedAt(connectedAt)
                .build();
    }

    public static Member of(OAuth2UserInfo info) {
        return builder()
                .nickname(info.getProvider().getRegistrationId() + info.getId())
                .socialId(info.getId())
                .provider(info.getProvider())
                .email(info.getEmail())
                .connectedAt(new Timestamp(System.currentTimeMillis()))
                .build();
    }

    public Member update(String email, OAuth2Provider provider) {
        this.email = email;
        this.provider = provider;
        return this;
    }

    public void updateNickname(String nickname) {
        this.nickname = nickname;
    }

    public void updateLang(Language lang) {
        this.lang = lang;
    }

    public void updateProfile(String profile) {
        this.profile = profile;
    }
}