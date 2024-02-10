package com.eni.backend.member.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class GetCoinResponse {
    private Integer memberCoin;

    @Builder
    private GetCoinResponse(Integer memberCoin) {
        this.memberCoin = memberCoin;
    }

    public static GetCoinResponse of(Integer memberCoin) {
        return builder()
                .memberCoin(memberCoin)
                .build();
    }
}
