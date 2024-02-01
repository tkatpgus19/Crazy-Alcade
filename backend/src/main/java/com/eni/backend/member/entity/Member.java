package com.eni.backend.member.entity;

import com.eni.backend.auth.oauth2.user.OAuth2Provider;
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

    @Column
    @Enumerated(EnumType.STRING)
    private OAuth2Provider oAuth2Provider;

    @Column(length = 8)
    private String nickname;

    @Column
    private String profile;

    @Column(nullable = false)
    private Integer coin;

    @Column(nullable = false)
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
    private Member(String email, OAuth2Provider oAuth2Provider, String nickname, String profile, Integer coin, Integer exp, Language lang, Level level, Integer complaint, Timestamp connectedAt) {
        this.nickname = nickname;
        this.profile = profile;
        this.email = email;
        this.oAuth2Provider = oAuth2Provider;
        this.coin = coin;
        this.exp = exp;
        this.lang = lang;
        this.complaint = complaint;
        this.level = level;
        this.connectedAt = connectedAt;
    }

    public static Member of(String email, OAuth2Provider oAuth2Provider, String nickname, String profile, Integer coin, Integer exp, Language lang, Level level, Integer complaint, Timestamp connectedAt) {
        return builder()
                .email(email)
                .oAuth2Provider(oAuth2Provider)
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

    public Member update(String email, OAuth2Provider oAuth2Provider) {
        this.email = email;
        this.oAuth2Provider = oAuth2Provider;
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