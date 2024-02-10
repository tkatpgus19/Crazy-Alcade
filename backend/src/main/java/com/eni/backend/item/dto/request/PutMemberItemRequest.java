package com.eni.backend.item.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class PutMemberItemRequest {

    @NotNull(message = "아이템 아이디를 입력해주세요.")
    private Long itemId;

    @NotNull(message = "아이템 수를 입력해주세요.")
    private Integer putValue;
}
