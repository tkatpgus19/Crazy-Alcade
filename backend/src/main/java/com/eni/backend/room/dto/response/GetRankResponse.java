package com.eni.backend.room.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@ToString
public class GetRankResponse {

    private String roomId;
    private List<OtherRankDto> totalRanks;
    private MyRankDto myRank;

    @Builder
    private GetRankResponse(String roomId, List<OtherRankDto> totalRanks, MyRankDto myRank) {
        this.roomId = roomId;
        this.totalRanks = totalRanks;
        this.myRank = myRank;
    }

}
