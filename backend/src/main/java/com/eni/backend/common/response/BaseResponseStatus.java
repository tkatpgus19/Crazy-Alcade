package com.eni.backend.common.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum BaseResponseStatus {

    // SUCCESS
    SUCCESS(HttpStatus.OK, "요청에 성공하였습니다."),

    SIGNUP_SUCCESS(HttpStatus.OK, "회원가입에 성공하였습니다."),
    LOGIN_SUCCESS(HttpStatus.OK, "로그인에 성공하였습니다."),
    LOGOUT_SUCCESS(HttpStatus.OK, "로그아웃에 성공하였습니다."),

    GET_MEMBER_SUCCESS(HttpStatus.OK, "기본 회원 정보 조회에 성공하였습니다."),
    GET_MEMBER_DETAILS_SUCCESS(HttpStatus.OK, "상세 회원 정보 조회에 성공하였습니다."),
    GET_MEMBER_LIST_SUCCESS(HttpStatus.OK, "회원 목록 조회에 성공하였습니다."),
    GET_MEMBER_COIN_SUCCESS(HttpStatus.OK, "회원 보유 코인 조회에 성공하였습니다."),
    GET_INVENTORY_SUCCESS(HttpStatus.OK, "상점 아이템 및 보유 아이템 조회에 성공하였습니다."),
    PUT_NICKNAME_SUCCESS(HttpStatus.OK, "닉네임 변경에 성공하였습니다."),
    PUT_LANGUAGE_SUCCESS(HttpStatus.OK, "선호 언어 변경에 성공하였습니다."),
    PUT_COIN_ADD_SUCCESS(HttpStatus.OK, "코인 획득에 성공하였습니다."),
    PUT_COIN_SUB_SUCCESS(HttpStatus.OK, "코인 차감에 성공하였습니다."),
    REWARD_ADD_SUCCESS(HttpStatus.OK, "코인과 EXP 획득에 성공하였습니다."),

    GET_ITEM_LIST_SUCCESS(HttpStatus.OK, "아이템 목록 조회에 성공하였습니다."),
    PUT_ITEM_ADD_SUCCESS(HttpStatus.OK, "아이템 구매에 성공하였습니다."),
    PUT_ITEM_SUB_SUCCESS(HttpStatus.OK, "아이템 사용에 성공하였습니다."),

    POST_PROBLEM_SUCCESS(HttpStatus.OK, "문제 생성에 성공하였습니다."),
    POST_TESTCASE_SUCCESS(HttpStatus.OK, "테스트케이스 생성에 성공하였습니다."),
    EXECUTE_CODE_SUCCESS(HttpStatus.OK, "코드 실행에 성공하였습니다."),
    SUBMIT_CODE_SUCCESS(HttpStatus.OK, "코드 제출에 성공하였습니다."),
    GET_PROBLEM_LIST_SUCCESS(HttpStatus.OK, "문제 리스트 조회에 성공하였습니다."),
    GET_PROBLEM_RANDOM_PROCESS(HttpStatus.OK, "랜덤 문제 조회에 성공하였습니다."),
    GET_PROBLEM_DETAIL_SUCCESS(HttpStatus.OK, "문제 정보 조회에 성공하였습니다."),
    GET_TIER_LIST_SUCCESS(HttpStatus.OK, "티어 리스트 조회에 성공하였습니다."),

    POST_ROOM_SUCCESS(HttpStatus.OK, "방 생성에 성공하였습니다."),
    GET_ROOM_LIST_SUCCESS(HttpStatus.OK, "방 목록 조회에 성공하였습니다."),
    GET_ROOM_INFO_SUCCESS(HttpStatus.OK, "방 정보 조회에 성공하였습니다."),
    GET_USER_STATUS_SUCCESS(HttpStatus.OK, "유저 목록 조회에 성공하였습니다."),
    PUT_READY_SUCCESS(HttpStatus.OK, "준비 상태 변경에 성공하였습니다."),
    GET_ROOM_PERSONNEL_CHECK_SUCCESS(HttpStatus.OK, "방 입장 가능 여부 조회에 성공하였습니다."),
    GET_ROOM_PASSWORD_CHECK_SUCCESS(HttpStatus.OK, "방 비밀번호 일치 여부 조회에 성공하였습니다."),
    PUT_ROOM_START_SUCCESS(HttpStatus.OK, "방 시작 가능 여부 조회에 성공하였습니다."),
    GET_ROOM_TIMER_START_SUCCESS(HttpStatus.OK, "방 타이머 세팅에 성공하였습니다."),
    DELETE_ROOM_SUCCESS(HttpStatus.OK, "방 삭제에 성공하였습니다."),
    POST_ENTER_ROOM_SUCCESS(HttpStatus.OK, "방 입장에 성공하였습니다."),
    DELETE_MEMBER_SUCCESS(HttpStatus.OK, "방 퇴장에 성공하였습니다."),
    POST_ATTACK_SUCCESS(HttpStatus.OK, "공격에 성공하였습니다."),
    GET_RANK_SUCCESS(HttpStatus.OK, "순위 조회에 성공하였습니다."),

    // BAD_REQUEST
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "유효하지 않은 요청입니다."),
    URL_NOT_FOUND(HttpStatus.BAD_REQUEST, "유효하지 않은 URL 입니다."),
    METHOD_NOT_SUPPORTED(HttpStatus.BAD_REQUEST, "해당 URL에서 지원하지 않는 HTTP Method 입니다."),

    // INTERNAL_SERVER_ERROR
    SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버에서 오류가 발생하였습니다."),
    DATABASE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "데이터베이스에서 오류가 발생하였습니다."),

    // UNAUTHORIZED
    JWT_ERROR(HttpStatus.UNAUTHORIZED, "JWT에서 오류가 발생하였습니다."),
    TOKEN_NOT_FOUND(HttpStatus.BAD_REQUEST, "토큰이 HTTP Header에 없습니다."),
    UNSUPPORTED_TOKEN_TYPE(HttpStatus.BAD_REQUEST, "지원되지 않는 토큰 형식입니다."),
    SOCIAL_EMAIL_NOT_FOUND(HttpStatus.UNAUTHORIZED, "해당 소셜 플랫폼에 해당하는 이메일이 없습니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다."),
    MALFORMED_TOKEN(HttpStatus.UNAUTHORIZED, "토큰이 올바르게 구성되지 않았습니다."),
    EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "만료된 토큰입니다."),
    TOKEN_MISMATCH(HttpStatus.BAD_REQUEST, "토큰 정보에 해당하는 회원 정보가 없습니다."),

    // SOCIAL LOGIN
    EMAIL_NOT_FOUND(HttpStatus.UNAUTHORIZED, "해당 소셜 플랫폼에 해당하는 이메일이 없습니다."),
    SOCIAL_AUTHORIZATION_FAIL(HttpStatus.UNAUTHORIZED, "소셜 로그인 인증에 실패하였습니다."),
    PROVIDER_NOT_SUPPORTED(HttpStatus.UNAUTHORIZED, "지원되지 않는 소셜 플랫폼 입니다."),

    // MEMBER
    MEMBER_NOT_FOUND(HttpStatus.BAD_REQUEST, "해당하는 멤버 정보가 없습니다."),
    MEMBER_COIN_SUB_FAIL(HttpStatus.BAD_REQUEST, "코인 수가 부족합니다."),
    MEMBER_LANG_CHANGE_FAIL(HttpStatus.BAD_REQUEST, "선호 언어 변경에 실패하였습니다."),
    SAME_NICKNAME(HttpStatus.BAD_REQUEST, "현재 사용중인 닉네임과 동일한 닉네임입니다."),
    DUPLICATED_NICKNAME(HttpStatus.BAD_REQUEST, "이미 사용하고 있는 닉네임입니다."),

    // PROBLEM
    PLATFORM_NOT_SUPPORTED(HttpStatus.BAD_REQUEST, "지원하지 않는 플랫폼입니다."),
    DUPLICATE_PROBLEM(HttpStatus.BAD_REQUEST, "이미 등록되어 있는 문제입니다."),
    PROBLEM_NOT_FOUND(HttpStatus.BAD_REQUEST, "해당하는 문제가 없습니다."),

    // TIER
    TIER_NOT_FOUND(HttpStatus.BAD_REQUEST, "해당하는 티어가 없습니다."),

    // CODE
    LANGUAGE_NOT_SUPPORTED(HttpStatus.BAD_REQUEST, "지원하지 않는 언어입니다."),

    // ITEM
    ITEM_NOT_FOUND(HttpStatus.BAD_REQUEST, "해당하는 아이템이 없습니다."),

    // MEMBER ITEM
    MEMBER_ITEM_PURCHASE_FAIL(HttpStatus.BAD_REQUEST, "코인 부족으로 아이템 구매에 실패하였습니다."),
    MEMBER_ITEM_USE_FAIL(HttpStatus.BAD_REQUEST, "보유 개수 부족으로 아이템 구매에 실패하였습니다."),

    // ROOM
    ROOM_NOT_EXIST(HttpStatus.BAD_REQUEST, "방이 존재하지 않습니다."),
    ROOM_ENTER_FAIL(HttpStatus.BAD_REQUEST, "인원이 가득 찼습니다."),
    ROOM_ENTER_FAIL_STARTED_ROOM(HttpStatus.BAD_REQUEST, "이미 시작된 방입니다."),
    ROOM_GAME_START_FAIL(HttpStatus.BAD_REQUEST, "게임은 최소 2인 이상부터 시작 가능합니다."),
    ROOM_GAME_START_FAIL_NOT_READY(HttpStatus.BAD_REQUEST, "모든 인원이 준비 상태여야 게임을 시작할 수 있습니다."),
    ROOM_NOT_EXIST_MEMBER(HttpStatus.BAD_REQUEST, "방에 해당 멤버가 존재하지 않습니다."),
    ;

    private final HttpStatus status;
    private final String message;

}
