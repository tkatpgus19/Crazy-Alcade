package com.eni.backend.problem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Testcase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "testcase_id", nullable = false)
    private Long id;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String input;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String output;

    @Column(name = "is_hidden", nullable = false)
    private Boolean isHidden;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", referencedColumnName = "problem_id")
    private Problem problem;

    @Builder
    public Testcase(String input, String output, Boolean isHidden, Problem problem) {
        this.input = input;
        this.output = output;
        this.isHidden = isHidden;
        this.problem = problem;
    }
}