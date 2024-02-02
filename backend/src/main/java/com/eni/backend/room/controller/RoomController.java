package com.eni.backend.room.controller;

import com.eni.backend.room.dto.ChatDto;
import com.eni.backend.room.dto.RoomDto;
import com.eni.backend.room.service.RoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin("*")
@RequestMapping("/rooms")
public class RoomController {
    private final SimpMessageSendingOperations template;

    private final RoomService roomService;

    // 방 등록
    @PostMapping("")
    public ResponseEntity<?> makeRoom(@RequestBody RoomDto roomDto){
        log.info("roomInfo {}", roomDto);
        roomService.save(roomDto);
        template.convertAndSend("/sub/normal/room-list", roomService.getNormalRoomList());
        template.convertAndSend("/sub/item/room-list", roomService.getItemRoomList());

        log.info("normalRoom Info: {}", roomService.getNormalRoomList());
        log.info("itemRoom info: {}", roomService.getItemRoomList());
        return new ResponseEntity<>(roomDto.getRoomId(), HttpStatus.OK);
    }

    // 노멀전 방 리스트 조회
    @GetMapping("/normal")
    public ResponseEntity<?> getNormalRoomList(){
        log.warn("노말룸 정보: {}", roomService.getNormalRoomList());
        return new ResponseEntity<>(roomService.getNormalRoomList(), HttpStatus.OK);
    }

    // 아이템전 방 리스트 조회
    @GetMapping("/item")
    public ResponseEntity<?> getItemRoomList(){
        return new ResponseEntity<>(roomService.getItemRoomList(), HttpStatus.OK);
    }

    // 방 입장
    @MessageMapping("/chat/enterUser")
    public void enterUser(@Payload ChatDto chat, SimpMessageHeaderAccessor headerAccessor) {
        // 채팅방에 유저 추가 및 UserUUID 반환
        String userUUID = roomService.addUser(chat);

        // 반환 결과를 socket session 에 userUUID 로 저장
        headerAccessor.getSessionAttributes().put("userUUID", userUUID);
        headerAccessor.getSessionAttributes().put("roomId", chat.getRoomId());
        headerAccessor.getSessionAttributes().put("roomType", chat.getRoomType());

        chat.setMessage(chat.getSender() + " 님 입장!!");
        template.convertAndSend("/sub/chat/room/" + chat.getRoomId(), chat);

        template.convertAndSend("/sub/normal/room-list", roomService.getNormalRoomList());
        template.convertAndSend("/sub/item/room-list", roomService.getItemRoomList());
    }
}
