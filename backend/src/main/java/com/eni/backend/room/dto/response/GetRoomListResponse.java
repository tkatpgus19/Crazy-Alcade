package com.eni.backend.room.dto.response;

import com.eni.backend.room.dto.RoomDto;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@ToString
@Getter
public class GetRoomListResponse {
    private Integer totalPage;
    private Integer currentPage;
    private List<RoomDto> roomList;

    @Builder
    private GetRoomListResponse(Integer totalPage, Integer currentPage, List<RoomDto> roomList) {
        this.totalPage = totalPage;
        this.currentPage = currentPage;
        this.roomList = roomList;
    }

    public static GetRoomListResponse of(Integer totalPage, Integer currentPage, List<RoomDto> roomList){
        return builder()
                .totalPage(totalPage)
                .currentPage(currentPage)
                .roomList(roomList)
                .build();
    }
}
