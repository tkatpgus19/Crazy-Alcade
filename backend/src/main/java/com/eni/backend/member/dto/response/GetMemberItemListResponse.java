package com.eni.backend.member.dto.response;

import com.eni.backend.item.entity.Item;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class GetMemberItemListResponse {
    private Long itemId;
    private String itemImg;
    private Integer memberItemCount;

    @Builder
    private GetMemberItemListResponse(Long itemId, String itemImg, Integer memberItemCount) {
        this.itemId = itemId;
        this.itemImg = itemImg;
        this.memberItemCount = memberItemCount;
    }

    public static GetMemberItemListResponse from(Item item, Integer memberItemCount) {
        return builder()
                .itemId(item.getId())
                .itemImg(item.getImage())
                .memberItemCount(memberItemCount)
                .build();
    }
}
