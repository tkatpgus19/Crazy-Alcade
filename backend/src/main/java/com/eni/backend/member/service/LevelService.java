package com.eni.backend.member.service;

import com.eni.backend.member.dto.response.GetLevelListResponseDto;
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

    public List<GetLevelListResponseDto> getList() {
        return levelRepository.findAll()
                .stream().map(GetLevelListResponseDto::of)
                .collect(Collectors.toList());
    }
}