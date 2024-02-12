package com.eni.backend.room.repository;

import com.eni.backend.problem.entity.Problem;
import com.eni.backend.problem.entity.Tier;
import com.eni.backend.room.dto.RoomDto;
import com.eni.backend.room.dto.request.PostRoomRequest;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Repository
@Getter
public class RoomRepository {
    private Map<String, RoomDto> roomMap;

    @PostConstruct
    private void init(){
        roomMap = new LinkedHashMap<>();
    }

    public String saveRoom(PostRoomRequest request, Tier tier, Problem problem){
        RoomDto room = RoomDto.from(request, tier, problem);
        roomMap.put(room.getRoomId(), room);
        return room.getRoomId();
    }

    public List<RoomDto> getRoomListByRoomType(String roomType){
        return roomMap.values()
                .stream()
                .filter(entry -> entry.getRoomType().equals(roomType))
                .toList();
    }

    public List<RoomDto> getRoomList(){
        return roomMap.values().stream().toList();
    }

    public RoomDto getRoomById(String roomId){
        return roomMap.getOrDefault(roomId, null);
    }

    public void test(){
        roomMap.clear();
    }

}
