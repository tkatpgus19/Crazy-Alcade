package com.eni.backend.auth.oauth2.user;

import com.eni.backend.member.entity.Member;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
public class LoginInfo {
    Member member;
    boolean isNew;
    boolean isConnected;

    @Builder
    private LoginInfo(Member member, boolean isNew, boolean isConnected) {
        this.member = member;
        this.isNew = isNew;
        this.isConnected = isConnected;
    }

    public static LoginInfo of(Member member, boolean isNew, boolean isConnected) {
        return builder()
                .member(member)
                .isNew(isNew)
                .isConnected(isConnected)
                .build();
    }

    public static LoginInfo from(Member member, boolean isNew, boolean isConnected) {
        return builder()
                .member(member)
                .isNew(isNew)
                .isConnected(isConnected)
                .build();
    }
}
