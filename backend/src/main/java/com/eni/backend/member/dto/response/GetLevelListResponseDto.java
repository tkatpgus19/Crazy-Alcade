package com.eni.backend.member.dto.response;

import com.eni.backend.member.entity.Level;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class GetLevelListResponseDto {

    private Integer levelId;
    private String image;
    private Integer exp;
    private Integer coin;

    @Builder
    private GetLevelListResponseDto(Integer levelId, String image, Integer exp, Integer coin) {
        this.levelId = levelId;
        this.image = image;
        this.exp = exp;
        this.coin = coin;
    }

    public static GetLevelListResponseDto of(Level level) {
        return builder()
                .levelId(level.getId())
                .image(level.getImage())
                .exp(level.getExp())
                .coin(level.getCoin())
                .build();
    }
}