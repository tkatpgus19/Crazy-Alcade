package com.eni.backend.member.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Level {

    @Id
    @Column(name = "level_id", nullable = false)
    private Long id;

    @Column(nullable = false)
    private String image;

    @Column(nullable = false)
    private Integer exp;

    @Column(nullable = false)
    private Integer coin;

    @Builder
    public Level(String image, Integer exp, Integer coin) {
        this.image = image;
        this.exp = exp;
        this.coin = coin;
    }
}