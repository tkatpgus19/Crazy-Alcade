package com.eni.backend.room.service;

import com.eni.backend.common.exception.CustomBadRequestException;
import com.eni.backend.problem.entity.Problem;
import com.eni.backend.problem.entity.Tier;
import com.eni.backend.problem.repository.ProblemRepository;
import com.eni.backend.problem.repository.TierRepository;
import com.eni.backend.room.dto.ChatDto;
import com.eni.backend.room.dto.RoomDto;
import com.eni.backend.room.dto.request.*;
import com.eni.backend.room.dto.response.PostRoomResponse;
import com.eni.backend.room.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import static com.eni.backend.common.response.BaseResponseStatus.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final TierRepository tierRepository;
    private final ProblemRepository problemRepository;
    private final SimpMessageSendingOperations template;

    // 방 등록
    public PostRoomResponse post(PostRoomRequest request){
        // 티어 조회
        Tier tier = findTierById(request.getProblemTier());

        // 문제 조회
        Problem problem = findProblemById(request.getProblemId());

        // 저장
        String roomId = roomRepository.saveRoom(request, tier, problem);

        template.convertAndSend("/sub/normal/room-list", roomRepository.getRoomListByRoomType("normal"));
        template.convertAndSend("/sub/item/room-list", roomRepository.getRoomListByRoomType("item"));

        // 생성된 방 ID 값 반환
        return PostRoomResponse.of(roomId);
    }

    // 조건에 부합하는 방 리스트 조회
    public List<RoomDto> getSortedRoomList(String roomType, String language, String tier, Boolean codeReview, Boolean isSolved, Integer page){
        List<RoomDto> resultList = roomRepository.getRoomListByRoomType(roomType);
        if(language != null){
            resultList = resultList
                    .stream()
                    .filter(entry -> entry.getLanguage().equals(language))
                    .toList();
        }
        if(tier != null){
            resultList = resultList
                    .stream()
                    .filter(entry -> entry.getProblemTier().equals(tier))
                    .toList();
        }
        if(codeReview != null){
            resultList = resultList
                    .stream()
                    .filter(entry -> entry.getCodeReview() == codeReview)
                    .toList();
        }

        if(resultList.size() > (page-1)*4){
            if(resultList.size()<(page-1)*4+4){
                resultList = resultList.subList((page-1)*4, resultList.size());
            }
            else{
                resultList = resultList.subList((page-1)*4, (page-1)*4+4);
            }
        }
        else{
            return Collections.emptyList();
        }
        return resultList;
    }

    public Boolean enter(PostRoomEnterRequest request){
        RoomDto room = roomRepository.getRoomById(request.getRoomId());
        if(room != null) {
            if(room.getIsStarted()){
                throw new CustomBadRequestException(ROOM_ENTER_FAIL_STARTED_ROOM);
            }
            if (room.getUserCnt() < room.getMaxUserCnt()) {
                String userUUID = UUID.randomUUID().toString();
                room.setUserCnt(room.getUserCnt() + 1);
                room.getUserList().put(userUUID, request.getNickname());

                // 마스터 등록
                if (room.getUserCnt() == 1) {
                    room.getReadyList().put(request.getNickname(), "MASTER");
                }
                // 참가자 대기상태 설정
                else {
                    room.getReadyList().put(request.getNickname(), "WAITING");
                }

                ChatDto chat = new ChatDto();
                chat.setSender(request.getNickname());
                chat.setMessage(chat.getSender() + " 님 입장!!");

                template.convertAndSend("/sub/chat/room/" + request.getRoomId(), chat);
                template.convertAndSend("/sub/room/" + request.getRoomId() + "/status", getUserStatus(request.getRoomId()));

                template.convertAndSend("/sub/normal/room-list", getSortedRoomList("normal", null, null, null, null, 1));
                template.convertAndSend("/sub/item/room-list", getSortedRoomList("item", null, null, null, null, 1));
                return true;
            }
            template.convertAndSend("/sub/normal/room-list", getSortedRoomList("normal", null, null, null, null, 1));
            template.convertAndSend("/sub/item/room-list", getSortedRoomList("item", null, null, null, null, 1));
            throw new CustomBadRequestException(ROOM_ENTER_FAIL);
        }
        template.convertAndSend("/sub/normal/room-list", getSortedRoomList("normal", null, null, null, null, 1));
        template.convertAndSend("/sub/item/room-list", getSortedRoomList("item", null, null, null, null, 1));
        throw new CustomBadRequestException(ROOM_NOT_EXIST);
    }
    // 방에 인원 추가
    public String addUser(String roomId, String nickname){
        String userUUID = UUID.randomUUID().toString();

        RoomDto room = roomRepository.getRoomById(roomId);
        room.setUserCnt(room.getUserCnt()+1);
        room.getUserList().put(userUUID, nickname);

        // 마스터 등록
        if(room.getUserCnt()==1){
            room.getReadyList().put(nickname, "MASTER");
        }
        // 참가자 대기상태 설정
        else {
            room.getReadyList().put(nickname, "WAITING");
        }

        return userUUID;
    }

    // 방에서 인원 삭제
    public Boolean delUser(String roomId, String userUUID){
        if(roomId != null) {
            RoomDto room = roomRepository.getRoomById(roomId);
            if(room != null) {
                String user = room.getUserList().get(userUUID);

                if(user != null){
                    if (room.getReadyList().get(user).equals("MASTER") && room.getUserCnt() != 1) {
                        room.getReadyList().remove(user);
                        Map.Entry<String, String> firstEntry = room.getReadyList().entrySet().iterator().next();
                        room.getReadyList().replace(firstEntry.getKey(), "MASTER");
                        room.setMaster(firstEntry.getKey());
                    } else {
                        room.getReadyList().remove(user);
                    }
                    room.setUserCnt(room.getUserCnt() - 1);
                    room.getUserList().remove(userUUID);

                    log.info("User exit : " + user);
                }

                // builder 어노테이션 활용
                ChatDto chat = ChatDto.builder()
                        .type(ChatDto.MessageType.LEAVE)
                        .sender(user)
                        .message(user + " 님 퇴장!!")
                        .build();
                template.convertAndSend("/sub/chat/room/" + roomId, chat);

                if (getUserStatus(roomId) != null) {
                    template.convertAndSend("/sub/room/" + roomId + "/status", getUserStatus(roomId));
                }
                if (room.getUserCnt() == 0) {
                    roomRepository.getRoomMap().remove(roomId);
                }
            }
            template.convertAndSend("/sub/normal/room-list", getSortedRoomList("normal", null, null, null, false, 1));
            template.convertAndSend("/sub/item/room-list", getSortedRoomList("item", null, null, null, null, 1));
        }
        clearRooms();
        return true;
    }

    // 게임방 참여인원 조회
    public LinkedHashMap<String, String> getUserStatus(String roomId){
        if(roomRepository.getRoomById(roomId) != null){
            return roomRepository.getRoomById(roomId).getReadyList();
        }
        return null;
    }

    // 게임방 정보 조회
    public RoomDto getRoomInfo(String roomId){
        return roomRepository.getRoomById(roomId);
    }

    // 채팅방 userName 조회
    public String getUserName(String roomId, String userUUID){
        if(roomId != null) {
            RoomDto room = roomRepository.getRoomById(roomId);
            return room.getUserList().get(userUUID);
        }
        return null;
    }

    public Boolean ready(PutReadyRequest request){
        RoomDto room = roomRepository.getRoomById(request.getRoomId());
        String status = room.getReadyList().get(request.getNickname());
        if(status.equals("WAITING")){
            room.getReadyList().replace(request.getNickname(), "READY");
        }
        else{
            room.getReadyList().replace(request.getNickname(), "WAITING");
        }
        template.convertAndSend("/sub/room/"+request.getRoomId()+"/status", getUserStatus(request.getRoomId()));
        return true;
    }

    public Boolean checkPwd(String roomId, String password){
        RoomDto room = roomRepository.getRoomById(roomId);
        return room.getRoomPassword().equals(password);
    }

    //
    public Boolean checkPersonnel(String roomId){
        RoomDto room = roomRepository.getRoomById(roomId);
        return !Objects.equals(room.getUserCnt(), room.getMaxUserCnt());
    }

    public Boolean checkReady(String roomId) {
        int cnt = 0;
        RoomDto room = roomRepository.getRoomById(roomId);
        List<String> list = room
                .getReadyList()
                .values()
                .stream()
                .toList();
        for (String status : list) {
            if (status.equals("READY")) {
                cnt++;
            }
        }
        if (cnt == room.getUserCnt() - 1) {
            if (cnt == 0) {
                throw new CustomBadRequestException(ROOM_GAME_START_FAIL);
            }
            room.setIsStarted(true);
            template.convertAndSend("/sub/room/" + roomId + "/start", room);
            template.convertAndSend("/sub/normal/room-list", getSortedRoomList("normal", null, null, null, null, 1));
            template.convertAndSend("/sub/item/room-list", getSortedRoomList("item", null, null, null, null, 1));

            ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
            final long[] timeLimit = {room.getTimeLimit()};
            scheduler.scheduleAtFixedRate(() -> {
                template.convertAndSend("/sub/timer/" + roomId, timeLimit[0]);
                log.warn("초: " + timeLimit[0]);
                if (timeLimit[0] == 0) {
                    scheduler.shutdown();
                }
                timeLimit[0]--;
            }, 0, 1, TimeUnit.SECONDS);

            return true;
        }
        template.convertAndSend("/sub/normal/room-list", getSortedRoomList("normal", null, null, null, null, 1));
        template.convertAndSend("/sub/item/room-list", getSortedRoomList("item", null, null, null, null, 1));
        throw new CustomBadRequestException(ROOM_GAME_START_FAIL_NOT_READY);
    }

    public void clearRooms(){
        for(RoomDto room : roomRepository.getRoomList()){
            if(room.getUserCnt() <= 0){
                roomRepository.getRoomMap().remove(room.getRoomId());
            }
        }
        template.convertAndSend("/sub/normal/room-list", getSortedRoomList("normal", null, null, null, null, 1));
        template.convertAndSend("/sub/item/room-list", getSortedRoomList("item", null, null, null, null, 1));
    }

    public Boolean startTimer(String roomId){
        RoomDto room = roomRepository.getRoomById(roomId);
        long timerValue = 0;

        for (long i = room.getTimeLimit(); i >= 0; i--) {
            timerValue = i;
            template.convertAndSend("/sub/timer/"+roomId, timerValue);
            log.warn("초: " + timerValue);
            try {
                Thread.sleep(1000); // 1초 대기
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        return true;
    }

    public Boolean delete(DeleteRoomRequest request){
        if(roomRepository.getRoomMap().getOrDefault(request.getRoomId(), null) != null) {
            roomRepository.getRoomMap().remove(request.getRoomId());
            template.convertAndSend("/sub/room/" + request.getRoomId() + "/finished", true);
            template.convertAndSend("/sub/normal/room-list", roomRepository.getRoomListByRoomType("normal"));
            template.convertAndSend("/sub/item/room-list", roomRepository.getRoomListByRoomType("item"));
            return true;
        }
        return false;
    }

    private Tier findTierById(Long tierId) {
        return tierRepository.findById(tierId)
                .orElseThrow(() -> new CustomBadRequestException(TIER_NOT_FOUND));
    }

    private Problem findProblemById(Long problemId) {
        return problemRepository.findById(problemId)
                .orElseThrow(() -> new CustomBadRequestException(PROBLEM_NOT_FOUND));
    }

    public Boolean attackUser(PostAttackRequest request){
        if(request.getRoomId() != null && request.getNickname() != null) {
            template.convertAndSend("/sub/game/" + request.getRoomId(), request);
            return true;
        }
        return false;
    }

    public void test(){
        roomRepository.test();
    }
}
