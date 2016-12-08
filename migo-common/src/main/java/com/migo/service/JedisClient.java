package com.migo.service;

/**
 * Author  知秋
 * Created by kauw on 2016/12/7.
 */
public interface JedisClient {
    String get(String key);
    String set(String key,String value);
    String set(String key,String value,Integer seconds);
    String hget(String hkey,String key);
    Long hset(String hkey,String key,String value);
    Long incr(String key);
    Long decr(String key);
    Long expire(String key,int second);
    Long ttl(String key);
    Long del(String key);
    Long hdel(String hkey,String key);
}
