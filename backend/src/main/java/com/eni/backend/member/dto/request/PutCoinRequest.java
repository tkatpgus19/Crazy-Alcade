package com.eni.backend.member.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class PutCoinRequest {

    @NotNull(message = "변경할 코인값을 입력해주세요.")
    private Integer putValue;
}
