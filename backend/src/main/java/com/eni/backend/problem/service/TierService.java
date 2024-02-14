package com.eni.backend.problem.service;

import com.eni.backend.problem.dto.response.GetTierListResponse;
import com.eni.backend.problem.repository.TierRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TierService {

    private final TierRepository tierRepository;

    public List<GetTierListResponse> getList() {
        return tierRepository.findAll()
                .stream().map(GetTierListResponse::from)
                .collect(Collectors.toList());
    }

}
