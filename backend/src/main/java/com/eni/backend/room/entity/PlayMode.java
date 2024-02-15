package com.eni.backend.room.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PlayMode {

    NORMAL("normal"),
    ITEM("item"),
    ;

    private final String roomType;

}
