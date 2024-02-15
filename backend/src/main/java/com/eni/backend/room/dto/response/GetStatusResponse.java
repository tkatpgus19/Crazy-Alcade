package com.eni.backend.room.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.LinkedHashMap;

@Getter
@ToString
public class GetStatusResponse {
    private LinkedHashMap<String, String> readyList;
    private LinkedHashMap<String, String> profileList;

    @Builder
    private GetStatusResponse(LinkedHashMap<String, String> readyList, LinkedHashMap<String, String> profileList) {
        this.readyList = readyList;
        this.profileList = profileList;
    }

    public static GetStatusResponse of(LinkedHashMap<String, String> readyList, LinkedHashMap<String, String> profileList) {
        return builder()
                .readyList(readyList)
                .profileList(profileList)
                .build();
    }
}
