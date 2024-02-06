package com.eni.backend.member.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class PutExpResponse {

    private Long memberId;

    @Builder
    private PutExpResponse(Long memberId) {
        this.memberId = memberId;
    }

    public static PutExpResponse of(Long memberId) {
        return builder()
                .memberId(memberId)
                .build();
    }

}
