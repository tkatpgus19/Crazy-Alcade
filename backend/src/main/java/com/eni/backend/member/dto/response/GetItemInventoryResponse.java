package com.eni.backend.member.dto.response;

import com.eni.backend.item.entity.Item;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class GetItemInventoryResponse {
    private Integer memberCount;
    private Long itemId;
    private Integer itemPrice;
    private Integer itemDuration;
    private String itemDescription;
    private String itemImage;

    @Builder
    private GetItemInventoryResponse(Integer memberCount, Long itemId, Integer itemPrice, Integer itemDuration, String itemDescription, String itemImage) {
        this.memberCount = memberCount;
        this.itemId = itemId;
        this.itemPrice = itemPrice;
        this.itemDuration = itemDuration;
        this.itemDescription = itemDescription;
        this.itemImage = itemImage;
    }

    public static GetItemInventoryResponse of(Integer memberCount, Long itemId, Integer itemPrice, Integer itemDuration, String itemDescription, String itemImage) {
        return builder()
                .memberCount(memberCount)
                .itemId(itemId)
                .itemPrice(itemPrice)
                .itemDuration(itemDuration)
                .itemDescription(itemDescription)
                .itemImage(itemImage)
                .build();
    }

    public static GetItemInventoryResponse from(Item item, Integer memberCount) {
        return builder()
                .memberCount(memberCount)
                .itemId(item.getId())
                .itemPrice(item.getPrice())
                .itemDuration(item.getDuration())
                .itemDescription(item.getDescription())
                .itemImage(item.getImage())
                .build();
    }
}
