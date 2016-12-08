package com.migo.service.impl;

import com.migo.service.JedisClient;
import org.springframework.beans.factory.annotation.Autowired;
import redis.clients.jedis.JedisCluster;

/**
 * Author  知秋
 * Created by kauw on 2016/12/7.
 */
public class JedisClientCluster implements JedisClient {
    /**
     * 有些系统可能不需要添加redis缓存，反而依赖了common项目，但是自己容器内又没有对redis做相应配置,
     * 故 required = false 这样就可以做到，容器内有则注入，没有就忽略
     */
    @Autowired(required = false)
    private JedisCluster jedisCluster;


    @Override
    public String get(String key) {
        return jedisCluster.get(key);
    }

    @Override
    public String set(String key, String value) {

        return jedisCluster.set(key, value);
    }

    @Override
    public String set(String key, String value, Integer seconds) {
        return jedisCluster.setex(key,seconds,value);
    }

    @Override
    public String hget(String hkey, String key) {
        return jedisCluster.hget(hkey, key);
    }

    @Override
    public Long hset(String hkey, String key, String value) {
        return jedisCluster.hset(hkey, key, value);
    }

    @Override
    public Long incr(String key) {
        return jedisCluster.incr(key);
    }

    @Override
    public Long decr(String key) {
        return jedisCluster.decr(key);
    }

    @Override
    public Long expire(String key, int second) {
        return jedisCluster.expire(key, second);
    }

    @Override
    public Long ttl(String key) {
        return jedisCluster.ttl(key);
    }

    @Override
    public Long del(String key) {
        return jedisCluster.del(key);
    }

    @Override
    public Long hdel(String hkey, String key) {
        return jedisCluster.hdel(hkey,key);
    }
}
