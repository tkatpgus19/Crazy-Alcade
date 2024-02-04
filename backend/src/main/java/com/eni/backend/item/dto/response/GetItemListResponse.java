package com.eni.backend.item.dto.response;

import com.eni.backend.item.entity.Item;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class GetItemListResponse {
    private Long itemId;
    private String name;
    private Integer price;
    private String description;
    private Integer duration;

    @Builder
    private GetItemListResponse(Long itemId, String name, Integer price, String description, Integer duration) {
        this.itemId = itemId;
        this.name = name;
        this.price = price;
        this.description = description;
        this.duration = duration;
    }

    public static GetItemListResponse of(Item item) {
        return builder()
                .itemId(item.getId())
                .name(item.getName())
                .price(item.getPrice())
                .description(item.getDescription())
                .duration(item.getDuration())
                .build();
    }
}
