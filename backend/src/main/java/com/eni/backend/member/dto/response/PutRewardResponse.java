package com.eni.backend.member.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class PutRewardResponse {

    private Long memberId;

    @Builder
    private PutRewardResponse(Long memberId) {
        this.memberId = memberId;
    }

    public static PutRewardResponse of(Long memberId) {
        return builder()
                .memberId(memberId)
                .build();
    }

}
