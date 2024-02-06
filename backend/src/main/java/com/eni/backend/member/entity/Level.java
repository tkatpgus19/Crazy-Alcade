package com.eni.backend.member.entity;

import com.eni.backend.code.entity.Code;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Level {

    @Id
    @Column(name = "level_id", nullable = false)
    private Integer id;

    @Column(nullable = false)
    private String image;

    @Column(nullable = false)
    private Integer exp;

    @Column(nullable = false)
    private Integer coin;

    @OneToMany(mappedBy = "level", cascade = CascadeType.REMOVE)
    private List<Member> members = new ArrayList<>();

}