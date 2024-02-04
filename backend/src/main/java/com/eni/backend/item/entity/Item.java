package com.eni.backend.item.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id", nullable = false)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer price;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Integer duration;

    @OneToMany(mappedBy = "item", cascade = CascadeType.REMOVE)
    private List<MemberItem> memberItems = new ArrayList<>();

    @Builder
    public Item(String name, Integer price, String description, Integer duration) {
        this.name = name;
        this.price  = price;
        this.description = description;
        this.duration = duration;
    }
}