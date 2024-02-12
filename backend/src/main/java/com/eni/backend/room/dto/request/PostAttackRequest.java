package com.eni.backend.room.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class PostAttackRequest {
    private String roomId;
    private String nickname;
    private String victim;
    private Integer itemNo;
}
