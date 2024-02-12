package com.eni.backend.item.controller;

import com.eni.backend.common.exception.CustomBadRequestException;
import com.eni.backend.common.response.BaseSuccessResponse;
import com.eni.backend.item.dto.request.PutMemberItemRequest;
import com.eni.backend.item.service.ItemService;
import com.eni.backend.item.service.MemberItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import static com.eni.backend.common.response.BaseResponseStatus.*;
import static com.eni.backend.common.util.BindingResultUtils.getErrorMessages;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/items")
@CrossOrigin
public class ItemController {

    private final ItemService itemService;
    private final MemberItemService memberItemService;

    @GetMapping("/list")
    public BaseSuccessResponse<?> getList() {
        log.info("ItemController.getList");
        return BaseSuccessResponse.of(GET_ITEM_LIST_SUCCESS, itemService.getList());
    }

    @PutMapping("/members/add")
    public BaseSuccessResponse<?> putItemAdd(Authentication authentication, @RequestBody @Valid PutMemberItemRequest putMemberItemRequest, BindingResult bindingResult) {
        log.info("ItemController.item.add");

        // validation 오류
        if (bindingResult.hasErrors()) {
            throw new CustomBadRequestException(BAD_REQUEST, getErrorMessages(bindingResult));
        }

        return BaseSuccessResponse.of(PUT_ITEM_ADD_SUCCESS, memberItemService.putMemberItem(authentication, putMemberItemRequest, true));
    }

    @PutMapping("/members/sub")
    public BaseSuccessResponse<?> putItemSub(Authentication authentication, @RequestBody @Valid PutMemberItemRequest putMemberItemRequest, BindingResult bindingResult) {
        log.info("ItemController.item.sub");

        // validation 오류
        if (bindingResult.hasErrors()) {
            throw new CustomBadRequestException(BAD_REQUEST, getErrorMessages(bindingResult));
        }

        return BaseSuccessResponse.of(PUT_ITEM_SUB_SUCCESS, memberItemService.putMemberItem(authentication, putMemberItemRequest, false));
    }
}
