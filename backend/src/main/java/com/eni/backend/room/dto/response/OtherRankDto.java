package com.eni.backend.room.dto.response;

import com.eni.backend.problem.entity.CodeStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class OtherRankDto {

    private int rank;
    private String status;
    private String nickname;
    private String time;
    private String memory;

    @Builder
    private OtherRankDto(int rank, String status, String nickname, String time, String memory) {
        this.rank = rank;
        this.status = status;
        this.nickname = nickname;
        this.time = time;
        this.memory = memory;
    }

}
