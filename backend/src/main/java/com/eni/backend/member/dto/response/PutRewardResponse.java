package com.eni.backend.member.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class PutRewardResponse {

    private Long memberId;
    private Boolean levelUp;
    private Integer levelId;

    @Builder
    private PutRewardResponse(Long memberId, Boolean levelUp, Integer levelId) {
        this.memberId = memberId;
        this.levelUp = levelUp;
        this.levelId = levelId;
    }

    public static PutRewardResponse of(Long memberId, Boolean levelUp, Integer levelId) {
        return builder()
                .memberId(memberId)
                .levelUp(levelUp)
                .levelId(levelId)
                .build();
    }

}
