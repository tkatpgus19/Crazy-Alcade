package com.eni.backend.item.service;

import com.eni.backend.common.exception.CustomBadRequestException;
import com.eni.backend.item.dto.request.PutMemberItemRequest;
import com.eni.backend.item.dto.response.PutMemberItemResponse;
import com.eni.backend.item.entity.Item;
import com.eni.backend.item.entity.MemberItem;
import com.eni.backend.item.repository.ItemRepository;
import com.eni.backend.item.repository.MemberItemRepository;
import com.eni.backend.member.entity.Member;
import com.eni.backend.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static com.eni.backend.common.response.BaseResponseStatus.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberItemService {

    private final MemberService memberService;
    private final MemberItemRepository memberItemRepository;
    private final ItemRepository itemRepository;

    @Transactional
    public PutMemberItemResponse putMemberItem(Authentication authentication, PutMemberItemRequest putMemberItemRequest, boolean operator) {

        // authentication으로 해당 Member를 찾는다.
        Member member = memberService.findMemberByAuthentication(authentication);

        // Member가 존재하지 않는다면 예외처리
        if (member == null) {
            throw new CustomBadRequestException(MEMBER_NOT_FOUND);
        }

        // Member가 존재한다면
        else {
            Long itemId = putMemberItemRequest.getItemId();

            // 바꾸고자 하는 itemId로 해당 Item을 찾는다.
            Optional<Item> optionalItem = itemRepository.findById(itemId);

            // 해당 Item이 존재하지 않는다면 예외처리
            if (optionalItem.isEmpty()) {
                throw new CustomBadRequestException(ITEM_NOT_FOUND);
            }

            //Item이 존재한다면
            else {
                // 해당 Item을 가져온다.
                Item item = optionalItem.get();

                // Member의 Item 구매 이력을 불러온다.
                Optional<MemberItem> optionalMemberItem = memberItemRepository.findMemberItemByMemberAndItem(member, item);
                MemberItem memberItem;

                // 구매 이력 있음
                if (optionalMemberItem.isPresent()) {
                    // 구매 이력 불러오기
                    memberItem = optionalMemberItem.get();

                    // Item 구매
                    if (operator) {
                        putMemberItemAdd(member, item, memberItem, putMemberItemRequest.getPutValue(), true);
                    }

                    // Item 사용
                    else {
                        putMemberItemSub(memberItem, putMemberItemRequest.getPutValue());
                    }
                }

                // 구매 이력 없음
                else {
                    // Item 구매
                    if (operator) {
                        memberItem = MemberItem.from(member, putMemberItemRequest.getPutValue(), item);
                        putMemberItemAdd(member, item, memberItem, putMemberItemRequest.getPutValue(), false);
                    }

                    // Item 사용 : 구매 이력 없으면 아이템 사용 불가
                    else {
                        throw new CustomBadRequestException(MEMBER_ITEM_USE_FAIL);
                    }

                }

                return PutMemberItemResponse.of(member.getId(), item.getId());
            }
        }
    }

    @Transactional
    public void putMemberItemAdd(Member member, Item item, MemberItem memberItem, Integer putValue, boolean isPresent) {

        // member가 가진 코인이 Item의 가격보다 많거나 같아야 Item 구매 가능
        if (member.getCoin() >= item.getPrice() && member.getCoin() > 0) {

            // 코인 차감하기
            member.updateCoin(item.getPrice());

            // DB에 구매 이력이 존재한다면
            if (isPresent) {
                memberItem.updateMemberItem(putValue, true);
            }

            // 구매 이력이 존재하지 않는다면
            else {
                try {
                    memberItemRepository.save(memberItem);     // DB에 넣어주기
                } catch (Exception e) {
                    throw new CustomBadRequestException(DATABASE_ERROR);         // DB 삽입 실패 -> 구매 실패
                }
            }
        }

        // 코인이 부족하면 구매 실패
        else {
            throw new CustomBadRequestException(MEMBER_ITEM_PURCHASE_FAIL);
        }
    }

    @Transactional
    public void putMemberItemSub(MemberItem memberItem, Integer putValue) {

        // member가 가진 Item의 수가 사용하려는 수보다 많거나 같아야 Item 사용 가능
        if (memberItem.getCount() >= putValue && memberItem.getCount() > 0) {
            // 아이템 개수 변경(차감)
            memberItem.updateMemberItem(putValue, false);
        }

        // Item 보유 개수 부족하면 사용 실패
        else {
            throw new CustomBadRequestException(MEMBER_ITEM_USE_FAIL);
        }
    }
}