package com.eni.backend.member.dto.request;

import com.eni.backend.auth.oauth2.user.OAuth2Provider;
import lombok.Getter;

@Getter
public class SignUpRequest {
    private String socialId;
    private OAuth2Provider provider;


}
