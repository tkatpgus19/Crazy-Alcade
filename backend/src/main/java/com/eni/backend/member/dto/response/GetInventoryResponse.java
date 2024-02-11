package com.eni.backend.member.dto.response;

import com.eni.backend.member.entity.Member;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@ToString
@Getter
public class GetInventoryResponse {
    private Integer coin;
    private List<GetItemInventoryResponse> memberItemInventory;

    @Builder
    private GetInventoryResponse(Integer coin, List<GetItemInventoryResponse> memberItemInventory) {
        this.coin = coin;
        this.memberItemInventory = memberItemInventory;
    }

    public static GetInventoryResponse of(Integer coin, List<GetItemInventoryResponse> memberItemInventory) {
        return builder()
                .coin(coin)
                .memberItemInventory(memberItemInventory)
                .build();
    }

    public static GetInventoryResponse from(Member member, List<GetItemInventoryResponse> memberItemInventory) {
        return builder()
                .coin(member.getCoin())
                .memberItemInventory(memberItemInventory)
                .build();
    }
}
