package com.eni.backend.member.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Level {

    @Id
    @Column(name = "level_id", nullable = false)
    private Integer id;

    @Column(nullable = false)
    private String image;

    @Column(nullable = false)
    private Integer exp;

    @Column(nullable = false)
    private Integer coin;

    @Builder
    public Level(Integer id, String image, Integer exp, Integer coin) {
        this.id = id;
        this.image = image;
        this.exp = exp;
        this.coin = coin;
    }
}