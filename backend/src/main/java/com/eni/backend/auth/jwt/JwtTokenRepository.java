package com.eni.backend.auth.jwt;

import com.eni.backend.auth.redis.RedisProperties;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JwtTokenRepository extends CrudRepository<RedisProperties, String> {

    // accessToken으로 RefreshToken을 찾아온다.
    Optional<RedisProperties> findByAccessToken(String accessToken);
}
