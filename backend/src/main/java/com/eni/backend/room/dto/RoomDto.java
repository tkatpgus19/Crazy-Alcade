package com.eni.backend.room.dto;

import com.eni.backend.problem.entity.Problem;
import com.eni.backend.problem.entity.Tier;
import com.eni.backend.room.dto.request.PostRoomRequest;
import lombok.Builder;
import lombok.Data;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.UUID;

@Data
public class RoomDto {
    private String roomId;
    private String roomType;
    private String roomName;
    private Boolean hasPassword;
    private String roomPassword;
    private Long problemTier;
    private String problemTierValue;
    private Integer problemNo;
    private String problemName;
    private Long timeLimit;
    private String language;
    private Boolean codeReview;
    private Integer userCnt;
    private Integer maxUserCnt;
    private String master;
    private Boolean isStarted;

    private LinkedHashMap<String, String> userList = new LinkedHashMap<>();
    private LinkedHashMap<String, String> readyList = new LinkedHashMap<>();

    @Builder
    private RoomDto(String roomId, String roomType, String roomName, Boolean hasPassword,
                    String roomPassword, Long problemTier, String problemTierValue, Integer problemNo, String problemName,
                    Long timeLimit, String language, Boolean codeReview, Integer maxUserCnt,
                    String master, Boolean isStarted) {
        this.roomId = roomId != null ? roomId : UUID.randomUUID().toString();
        this.roomType = roomType;
        this.roomName = roomName;
        this.hasPassword = hasPassword;
        this.roomPassword = roomPassword;
        this.problemTier = problemTier;
        this.problemTierValue = problemTierValue;
        this.problemNo = problemNo;
        this.problemName = problemName;
        this.timeLimit = timeLimit;
        this.language = language;
        this.codeReview = codeReview;
        this.userCnt = 0;
        this.maxUserCnt = maxUserCnt != null ? maxUserCnt : 6;
        this.master = master;
        this.isStarted = isStarted != null ? isStarted : false;
    }

    public static RoomDto from(PostRoomRequest request, Tier tier, Problem problem) {
        return builder()
                .roomType(request.getRoomType())
                .roomName(request.getRoomName())
                .hasPassword(request.getHasPassword())
                .roomPassword(request.getRoomPassword())
                .problemTier(tier.getId())
                .problemTierValue(tier.getStringTier())
                .problemNo(problem.getNo())
                .problemName(problem.getProblemName())
                .timeLimit(request.getTimeLimit())
                .language(request.getLanguage())
                .codeReview(request.getCodeReview())
                .master(request.getMaster())
                .build();
    }

}
