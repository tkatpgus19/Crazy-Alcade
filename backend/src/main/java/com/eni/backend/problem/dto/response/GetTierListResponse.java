package com.eni.backend.problem.dto.response;

import com.eni.backend.problem.entity.Tier;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class GetTierListResponse {

    private Long tierId;
    private String tierName;

    @Builder
    private GetTierListResponse(Long tierId, String tierName) {
        this.tierId = tierId;
        this.tierName = tierName;
    }

    public static GetTierListResponse from(Tier tier) {
        return builder()
                .tierId(tier.getId())
                .tierName(tier.getStringTier())
                .build();
    }

}
