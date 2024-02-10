package com.eni.backend.item.service;

import com.eni.backend.item.dto.response.GetItemListResponse;
import com.eni.backend.item.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;

    public List<GetItemListResponse> getList() {
        return itemRepository.findAll()
                .stream().map(GetItemListResponse::of)
                .collect(Collectors.toList());
    }
}
