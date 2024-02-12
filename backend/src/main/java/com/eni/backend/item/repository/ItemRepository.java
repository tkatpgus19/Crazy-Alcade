package com.eni.backend.item.repository;

import com.eni.backend.item.entity.Item;
import com.eni.backend.member.entity.Level;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    boolean existsById(Long itemId);
    Optional<Item> findById(Long ItemId);
}
