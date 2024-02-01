package com.eni.backend.member.dto.response;

import lombok.Builder;

public class MemberResponseDto {
    private Long memberId;

    @Builder
    private MemberResponseDto(Long memberId) {
        this.memberId = memberId;
    }

    public static MemberResponseDto of(Long memberId) {
        return builder().memberId(memberId).build();
    }
}
