package com.eni.backend.member.entity;

import com.eni.backend.problem.entity.Code;
import com.eni.backend.common.entity.BaseTime;
import com.eni.backend.item.entity.MemberItem;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member extends BaseTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id", nullable = false)
    private Long id;

    @Column(nullable = false)
    private String nickname;

    @Column
    private String avatar;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private Integer coin;

    @Column(nullable = false)
    private Integer exp;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Timestamp connectedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Language lang;

    @Column
    @ColumnDefault("0")
    private Integer complaint;

    @OneToOne
    @JoinColumn(name = "level_id")
    private Level level;

    @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE)
    private List<Code> codes = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE)
    private List<MemberItem> memberItems = new ArrayList<>();

    @Builder
    public Member(String nickname, String avatar, String email, Integer coin, Integer exp, Timestamp connectedAt, Language lang, Integer complaint, Level level) {
        this.nickname = nickname;
        this.avatar = avatar;
        this.email = email;
        this.coin = coin;
        this.exp = exp;
        this.connectedAt = connectedAt;
        this.lang = lang;
        this.complaint = complaint;
        this.level = level;
    }
}