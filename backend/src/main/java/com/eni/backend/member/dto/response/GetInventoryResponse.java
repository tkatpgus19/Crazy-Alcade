package com.eni.backend.member.dto.response;

import com.eni.backend.member.entity.Member;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@ToString
@Getter
public class GetInventoryResponse {
    private Integer memberCoin;
    private List<GetItemInventoryResponse> memberItemInventory;

    @Builder
    private GetInventoryResponse(Integer memberCoin, List<GetItemInventoryResponse> memberItemInventory) {
        this.memberCoin = memberCoin;
        this.memberItemInventory = memberItemInventory;
    }

    public static GetInventoryResponse of(Integer memberCoin, List<GetItemInventoryResponse> memberItemInventory) {
        return builder()
                .memberCoin(memberCoin)
                .memberItemInventory(memberItemInventory)
                .build();
    }

    public static GetInventoryResponse from(Member member, List<GetItemInventoryResponse> memberItemInventory) {
        return builder()
                .memberCoin(member.getCoin())
                .memberItemInventory(memberItemInventory)
                .build();
    }
}
