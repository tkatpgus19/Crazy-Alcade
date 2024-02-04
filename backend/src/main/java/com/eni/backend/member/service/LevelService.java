package com.eni.backend.member.service;

import com.eni.backend.member.dto.response.GetLevelListResponse;
import com.eni.backend.member.repository.LevelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LevelService {

    private final LevelRepository levelRepository;

    public List<GetLevelListResponse> getList() {
        return levelRepository.findAll()
                .stream().map(GetLevelListResponse::of)
                .collect(Collectors.toList());
    }
}