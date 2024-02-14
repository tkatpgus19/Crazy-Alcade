package com.eni.backend.room.dto.response;

import com.eni.backend.problem.entity.Code;
import com.eni.backend.problem.entity.CodeStatus;
import com.eni.backend.room.dto.CodeDto;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.Optional;

@Getter
@ToString
public class OtherRankDto {

    private String rank;
    private String status;
    private String nickname;
    private String time;
    private String memory;

    @Builder
    private OtherRankDto(String rank, String status, String nickname, String time, String memory) {
        this.rank = rank;
        this.status = status;
        this.nickname = nickname;
        this.time = time;
        this.memory = memory;
    }

    public static OtherRankDto from(String rank, CodeDto code) {
        String time = "-";
        String memory = "-";
        if (code.getCodeStatus() == CodeStatus.SUCCESS) {
            time = code.getTime() + "ms";
            memory = code.getMemory() + "KB";
        }

        return builder()
                .rank(rank)
                .status(code.getCodeStatus().getStatus())
                .nickname(code.getMember().getNickname())
                .time(time)
                .memory(memory)
                .build();
    }

}
