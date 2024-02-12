package com.eni.backend.problem.entity;

import com.eni.backend.common.entity.BaseTime;
import com.eni.backend.member.entity.Language;
import com.eni.backend.member.entity.Member;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "code")
@Entity
public class Code extends BaseTime {

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
    private Long time;

    @Column
    private Long memory;

    @Enumerated(EnumType.STRING)
    private CodeStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="problem_id", nullable = false)
    private Problem problem;

    @Builder
    private Code(String content, Language lang, Long time, Long memory, CodeStatus status, Member member, Problem problem) {
        this.content = content;
        this.lang = lang;
        this.time = time;
        this.memory = memory;
        this.status = status;
        this.member = member;
        this.problem = problem;
    }

    public static Code of(String content, Language lang, Long time, Long memory, CodeStatus status, Member member, Problem problem) {
        return builder()
                .content(content)
                .lang(lang)
                .time(time)
                .memory(memory)
                .status(status)
                .member(member)
                .problem(problem)
                .build();
    }

}
