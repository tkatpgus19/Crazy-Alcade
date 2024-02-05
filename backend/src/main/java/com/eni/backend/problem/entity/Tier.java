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

    @Column(name = "success_exp", nullable = false)
    private Integer successExp;

    @Column(name = "normal_fail_exp", nullable = false)
    private Integer normalFailExp;

    @Column(name = "item_fail_exp", nullable = false)
    private Integer itemFailExp;

    @Column(name = "retry_exp", nullable = false)
    private Integer retryExp;

    @OneToMany(mappedBy = "tier", cascade = CascadeType.REMOVE)
    private List<Problem> problems = new ArrayList<>();

//    @Builder
//    private Tier(TierValue value, Integer successExp, Integer normalFailExp, Integer itemFailExp, Integer retryExp) {
//        this.value = value;
//        this.successExp = successExp;
//        this.normalFailExp = normalFailExp;
//        this.itemFailExp = itemFailExp;
//        this.retryExp = retryExp;
//    }

    public String getStringTier() {
        return this.value.name();
    }

}
