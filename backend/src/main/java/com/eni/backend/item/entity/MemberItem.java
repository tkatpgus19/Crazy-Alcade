package com.eni.backend.item.entity;

import com.eni.backend.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

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
    @ColumnDefault("0")
    private Integer count;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="item_id", nullable = false)
    private Item item;

    @Builder
    public MemberItem(Integer count, Member member, Item item) {
        this.count = count;
        this.member = member;
        this.item = item;
    }
}