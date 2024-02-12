package com.eni.backend.member.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class PutCoinResponse {
    private Long memberId;

    @Builder
    private PutCoinResponse(Long memberId) {
        this.memberId = memberId;
    }

    public static PutCoinResponse of(Long memberId) {
        return builder()
                .memberId(memberId)
                .build();
    }
}
