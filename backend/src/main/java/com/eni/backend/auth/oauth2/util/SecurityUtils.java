package com.eni.backend.auth.oauth2.util;

import com.eni.backend.member.dto.SecurityMemberDto;
import org.springframework.security.core.context.SecurityContextHolder;

public abstract class SecurityUtils {

    public static SecurityMemberDto getUser() {
        return (SecurityMemberDto) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}