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
            // 바꾸고자 하는 itemId로 해당 Item을 찾는다.
            Optional<Item> optionalItem = itemRepository.findById(putMemberItemRequest.getItemId());

            // 해당 Item이 존재하지 않는다면 예외처리
            if (optionalItem.isEmpty()) {
                throw new CustomBadRequestException(ITEM_NOT_FOUND);
            }

            //Item이 존재한다면
            else {
                // 해당 Item을 가져온다.
                Item item = optionalItem.get();

                // member가 가진 코인이 Item의 가격보다 많아야 구매 가능
                if (member.getCoin() >= item.getPrice()) {
                    // Member의 Item 구매 이력을 불러온다.
                    Optional<MemberItem> optionalMemberItem = memberItemRepository.findMemberItemByMemberAndItem(member, item);

                    // MemberItem에 구매한 이력이 있다면,
                    if (optionalMemberItem.isPresent()){
                        MemberItem memberItem = optionalMemberItem.get();

                        if (!memberItem.updateMemberItem(putMemberItemRequest, operator)) {
                            throw new CustomBadRequestException(MEMBER_ITEM_USE_FAIL);
                        }
                    }

                    // 구매한 이력이 없다면, DB에 새로 넣어준다.
                    else {
                        memberItemRepository.save(MemberItem.from(member, putMemberItemRequest, item));
                    }
                }
                // 코인이 부족하면 구매 실패
                else {
                    throw new CustomBadRequestException(MEMBER_ITEM_PURCHASE_FAIL);
                }

                return PutMemberItemResponse.of(member.getId(), item.getId());
            }
        }
    }
}