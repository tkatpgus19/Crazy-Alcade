package com.eni.backend.member.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class PutLanguageResponse {
    private Long memberId;

    @Builder
    private PutLanguageResponse(Long memberId) {
        this.memberId = memberId;
    }

    public static PutLanguageResponse of(Long memberId) {
        return builder()
                .memberId(memberId)
                .build();
    }
}
