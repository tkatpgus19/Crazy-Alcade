package com.eni.backend.room.dto.response;

import com.eni.backend.room.entity.Ranking;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class MyRankDto {

    private int rank;
    private int getExp;
    private int getCoin;

    @Builder
    private MyRankDto(int rank, int getExp, int getCoin) {
        this.rank = rank;
        this.getExp = getExp;
        this.getCoin = getCoin;
    }

    public static MyRankDto from(Ranking ranking, int getExp) {
        return builder()
                .rank(ranking.getValue())
                .getExp(getExp)
                .getCoin(ranking.getCoin())
                .build();
    }
}
