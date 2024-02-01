package com.eni.backend.auth.redis;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import java.io.Serializable;


/*
    @RedisHash는 Hash Collection을 명시하는 annotation
    RedisHash의 key는 value인 jwtToken과 @Id가 붙은 id 필드의 값을 합성하여 사용
    timeToLive는 초단위로 언제까지 데이터가 존재할건지 정할 수 있음
 */
@Getter
@AllArgsConstructor
@RedisHash(value = "jwtToken", timeToLive = 60 * 60 * 24 * 3) // 3일로 유효기간 설정
public class RedisProperties implements Serializable {

    @Id
    private String id;

    // @Indexed 애너테이션을 사용하면 JPA를 사용하듯이 findByAccessToken과 같은 질의가 가능
    // RefreshToken을 찾을때 AccessToken 기반으로 찾을 것이므로, @Indexed를 붙임
    @Indexed
    private String accessToken;

    private String refreshToken;

    public void updateAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
}