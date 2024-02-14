package com.eni.backend.item.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class PutMemberItemResponse {
    private Long memberId;
    private Long itemId;

    @Builder
    private PutMemberItemResponse(Long memberId, Long itemId) {
        this.memberId = memberId;
        this.itemId = itemId;
    }

    public static PutMemberItemResponse of(Long memberId, Long itemId) {
        return builder()
                .memberId(memberId)
                .itemId(itemId)
                .build();
    }
}
