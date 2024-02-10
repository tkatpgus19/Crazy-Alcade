package com.eni.backend.item.repository;

import com.eni.backend.item.entity.Item;
import com.eni.backend.item.entity.MemberItem;
import com.eni.backend.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberItemRepository extends JpaRepository<MemberItem, Long> {
    Optional<MemberItem> findMemberItemByMemberAndItem(Member member, Item item);
}
