package com.eni.backend.member.dto.response;

import com.eni.backend.problem.dto.response.PostProblemResponse;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class PutNicknameResponse {
    private Long memberId;

    @Builder
    private PutNicknameResponse(Long memberId) {

        this.memberId = memberId;
    }

    public static PutNicknameResponse of(Long memberId) {
        return builder()
                .memberId(memberId)
                .build();
    }
}
