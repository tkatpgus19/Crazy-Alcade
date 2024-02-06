package com.eni.backend.auth.oauth2.user;

import java.util.Map;

// 추상 클래스를 각각의 서비스(Facebook, Google, Guthub 등)에 맞게 구현
public interface OAuth2UserInfo {

    Map<String, Object> getAttributes();

    OAuth2Provider getProvider();
    String getId();
    String getEmail();
    String getAccessToken();

}