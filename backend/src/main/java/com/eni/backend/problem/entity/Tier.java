package com.eni.backend.problem.entity;

import com.eni.backend.common.entity.TierValue;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Tier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tier_id",nullable = false)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TierValue value;

    @Column(nullable = false)
    private Integer success_exp;

    @Column(nullable = false)
    private Integer normal_fail_exp;

    @Column(nullable = false)
    private Integer item_fail_exp;

    @Column(nullable = false)
    private Integer retry_exp;

    @OneToMany(mappedBy = "tier", cascade = CascadeType.REMOVE)
    private List<Problem> problems = new ArrayList<>();

    @Builder
    private Tier(TierValue value, Integer success_exp, Integer normal_fail_exp, Integer item_fail_exp, Integer retry_exp) {
        this.value = value;
        this.success_exp = success_exp;
        this.normal_fail_exp = normal_fail_exp;
        this.item_fail_exp = item_fail_exp;
        this.retry_exp = retry_exp;
    }
}
