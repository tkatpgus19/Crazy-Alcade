package com.eni.backend.member.dto.response;

import com.eni.backend.member.entity.Member;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@ToString
@Getter
public class GetMemberResponse {
    private String nickname;
    private String profile;
    private Integer levelId;
    private Integer tempExp;
    private Integer expLimit;
    private Integer coin;
    private List<GetMemberItemListResponse> memberItemList;

    @Builder
    private GetMemberResponse(String nickname, String profile, Integer levelId, Integer tempExp, Integer expLimit, Integer coin, List<GetMemberItemListResponse> memberItemList) {
        this.nickname = nickname;
        this.profile = profile;
        this.levelId = levelId;
        this.tempExp = tempExp;
        this.expLimit = expLimit;
        this.coin = coin;
        this.memberItemList = memberItemList;
    }

    public static GetMemberResponse from(Member member, Integer tempExp, Integer expLimit, List<GetMemberItemListResponse> memberItemList) {
        return builder()
                .nickname(member.getNickname())
                .profile(member.getProfile())
                .levelId(member.getLevel().getId())
                .tempExp(tempExp)
                .expLimit(expLimit)
                .coin(member.getCoin())
                .memberItemList(memberItemList)
                .build();
    }
}
