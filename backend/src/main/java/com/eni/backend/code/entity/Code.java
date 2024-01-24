package com.eni.backend.code.entity;

import com.eni.backend.common.entity.BaseTimeEntity;
import com.eni.backend.common.entity.CodeStatus;
import com.eni.backend.common.entity.Language;
import com.eni.backend.member.entity.Member;
import com.eni.backend.problem.entity.Problem;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "code")
@Entity
public class Code extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "code_id",nullable = false)
    private Long id;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Language lang;

    @Column
    private Integer time;

    @Column
    private Integer memory;

    @Enumerated(EnumType.STRING)
    private CodeStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="problem_id", nullable = false)
    private Problem problem;

    @Builder
    public Code(String content, Language lang, Integer time, Integer memory, CodeStatus status, Member member, Problem problem) {
        this.content = content;
        this.lang = lang;
        this.time = time;
        this.memory = memory;
        this.status = status;
        this.member = member;
        this.problem = problem;
    }
}
