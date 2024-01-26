package com.eni.backend.room.entity;

import com.eni.backend.common.entity.PlayMode;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Ranking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ranking_id",nullable = false)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "play_mode", nullable = false)
    private PlayMode playMode;

    @Column(nullable = false)
    private Integer value;

    @Column(nullable = false)
    private Integer coin;

    @Builder
    public Ranking(PlayMode playMode, Integer value, Integer coin) {
        this.playMode = playMode;
        this.value = value;
        this.coin = coin;
    }

}