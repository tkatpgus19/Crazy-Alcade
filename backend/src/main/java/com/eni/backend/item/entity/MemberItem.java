package com.eni.backend.item.entity;

import com.eni.backend.common.exception.CustomBadRequestException;
import com.eni.backend.common.response.BaseResponseStatus;
import com.eni.backend.item.dto.request.PutMemberItemRequest;
import com.eni.backend.item.dto.response.PutMemberItemResponse;
import com.eni.backend.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.security.core.Authentication;

import static com.eni.backend.common.response.BaseResponseStatus.MEMBER_ITEM_USE_FAIL;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "member_item")
@Entity
public class MemberItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_item_id", nullable = false)
    private Long id;

    @Column
    @ColumnDefault("1")
    private Integer count;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="item_id", nullable = false)
    private Item item;

    @Builder
    private MemberItem(Integer count, Member member, Item item) {
        this.count = count;
        this.member = member;
        this.item = item;
    }

    public static MemberItem of(Member member, Item item, Integer count) {
        return builder()
                .member(member)
                .item(item)
                .count(count)
                .build();
    }

    public static MemberItem from(Member member, PutMemberItemRequest putMemberItemRequest, Item item) {
        return builder()
                .member(member)
                .item(item)
                .count(putMemberItemRequest.getPutValue())
                .build();
    }

    public boolean updateMemberItem(PutMemberItemRequest putMemberItemRequest, boolean operator) throws CustomBadRequestException {
        if (operator) {
            this.count += putMemberItemRequest.getPutValue();
            return true;
        }
        else {
            if(this.count <= putMemberItemRequest.getPutValue()) {
                this.count -= putMemberItemRequest.getPutValue();
                return true;
            }

            return false;
        }
    }
}