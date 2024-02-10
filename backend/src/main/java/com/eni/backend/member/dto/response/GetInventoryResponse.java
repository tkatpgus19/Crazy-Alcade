package com.eni.backend.member.dto.response;

import com.eni.backend.item.entity.Item;
import com.eni.backend.member.entity.Member;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class GetInventoryResponse {
    private Long memberId;
    private Integer memberCount;
    private Long itemId;
    private Integer itemPrice;
    private Integer itemDuration;
    private String itemDescription;
    private String itemImage;

    @Builder
    private GetInventoryResponse(Long memberId, Integer memberCount, Long itemId, Integer itemPrice, Integer itemDuration, String itemDescription, String itemImage) {
        this.memberId = memberId;
        this.memberCount = memberCount;
        this.itemId = itemId;
        this.itemPrice = itemPrice;
        this.itemDuration = itemDuration;
        this.itemDescription = itemDescription;
        this.itemImage = itemImage;
    }

    public static GetInventoryResponse of(Long memberId, Integer memberCount, Long itemId, Integer itemPrice, Integer itemDuration, String itemDescription, String itemImage) {
        return builder()
                .memberId(memberId)
                .memberCount(memberCount)
                .itemId(itemId)
                .itemPrice(itemPrice)
                .itemDuration(itemDuration)
                .itemDescription(itemDescription)
                .itemImage(itemImage)
                .build();
    }

    public static GetInventoryResponse from(Member member, Item item, Integer memberCount) {
        return builder()
                .memberId(member.getId())
                .memberCount(memberCount)
                .itemId(item.getId())
                .itemPrice(item.getPrice())
                .itemDuration(item.getDuration())
                .itemDescription(item.getDescription())
                .itemImage(item.getImage())
                .build();
    }
}
