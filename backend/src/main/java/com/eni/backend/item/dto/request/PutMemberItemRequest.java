package com.eni.backend.item.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class PutMemberItemRequest {

    @NotNull(message = "아이템 아이디를 입력해주세요.")
    private Long itemId;

    @NotNull(message = "아이템 수를 입력해주세요.")
    private Integer putValue;
}
