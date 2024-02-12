package com.eni.backend.problem.entity;

import com.eni.backend.common.entity.BaseTime;
import com.eni.backend.problem.dto.request.PostProblemRequest;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Problem extends BaseTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "problem_id", nullable = false)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProblemPlatform platform;

    @Column(nullable = false)
    private Integer no;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String description;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String input;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String output;

    @Column(nullable = false)
    private Integer time;

    @Column(nullable = false)
    private Integer memory;

    @OneToMany(mappedBy = "problem", cascade = CascadeType.REMOVE)
    private List<Code> codes = new ArrayList<>();

    @OneToMany(mappedBy = "problem", cascade = CascadeType.REMOVE)
    private List<Testcase> testcases = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tier_id", referencedColumnName = "tier_id")
    private Tier tier;

    @Builder
    private Problem(ProblemPlatform platform, Integer no, String title, String description, String input, String output, Integer time, Integer memory, Tier tier) {
        this.platform = platform;
        this.no = no;
        this.title = title;
        this.description = description;
        this.input = input;
        this.output = output;
        this.time = time;
        this.memory = memory;
        this.tier = tier;
    }

    public static Problem from(ProblemPlatform platform, PostProblemRequest request, Tier tier) {
        return builder()
                .platform(platform)
                .no(request.getNo())
                .title(request.getTitle())
                .description(request.getDescription())
                .input(request.getInput())
                .output(request.getOutput())
                .time(request.getTime())
                .memory(request.getMemory())
                .tier(tier)
                .build();
    }

    public String getStringPlatform() {
        return this.platform.getPlatformName();
    }

    public String getStringTime() {
        return this.time + "초";
    }

    public String getStringMemory() {
        return this.memory + "MB";
    }

    public String getStringTier() {
        return this.tier.getStringTier();
    }

}