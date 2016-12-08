package com.migo.service.impl;

import com.migo.service.JedisClient;
import com.migo.service.WorkCallback;
import org.springframework.beans.factory.annotation.Autowired;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

/**
 * Author  知秋
 * Created by kauw on 2016/12/7.
 */
public class JedisClientSingle implements JedisClient {
    /**
     * 有些系统可能不需要添加redis缓存，反而依赖了common项目，但是自己容器内又没有对redis做相应配置,
     * 故 required = false 这样就可以做到，容器内有则注入，没有就忽略
     */

    @Autowired(required = false)
    private JedisPool jedisPool;

    private <T> T excute(WorkCallback<T,Jedis> workCallback){
        Jedis jedis=null;
        try {
            jedis = jedisPool.getResource();
            return workCallback.doWorkCallback(jedis);
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            if (null !=jedis){
                jedis.close();
            }
        }
        return null;
    }

    @Override
    public String get(final String key) {
        /*Jedis jedis=jedisPool.getResource();
        String result=jedis.get(key);
        jedis.close();
        return result;*/
        return this.excute(new WorkCallback<String, Jedis>() {
            @Override
            public String doWorkCallback(Jedis jedis) {
                return jedis.get(key);
            }
        });
    }

    @Override
    public String set(final String key, final String value) {

        return this.excute(new WorkCallback<String, Jedis>() {
            @Override
            public String doWorkCallback(Jedis jedis) {
                return jedis.set(key, value);
            }
        });
    }

    @Override
    public String set(final String key, final String value, final Integer seconds) {
        return this.excute(new WorkCallback<String, Jedis>() {
            @Override
            public String doWorkCallback(Jedis jedis) {
                return jedis.setex(key,seconds,value);
            }
        });
    }

    @Override
    public String hget(final String hkey, final String key) {
        /*Jedis jedis=jedisPool.getResource();
        String result=jedis.hget(hkey, key);
        jedis.close();
        return result;*/
        return this.excute(new WorkCallback<String, Jedis>() {
            @Override
            public String doWorkCallback(Jedis jedis) {
                return jedis.hget(hkey, key);
            }
        });
    }

    @Override
    public Long hset(final String hkey, final String key, final String value) {
        /*Jedis jedis=jedisPool.getResource();
        Long result = jedis.hset(hkey, key, value);
        jedis.close();
        return result;*/
        return this.excute(new WorkCallback<Long, Jedis>() {
            @Override
            public Long doWorkCallback(Jedis jedis) {
                return jedis.hset(hkey, key, value);
            }
        });
    }

    @Override
    public Long incr(final String key) {
        /*Jedis jedis=jedisPool.getResource();
        Long result = jedis.incr(key);
        jedis.close();
        return result;*/
        return this.excute(new WorkCallback<Long, Jedis>() {
            @Override
            public Long doWorkCallback(Jedis jedis) {
                return jedis.incr(key);
            }
        });
    }

    @Override
    public Long decr(final String key) {
        /*Jedis jedis=jedisPool.getResource();
        Long result = jedis.decr(key);
        jedis.close();
        return result;*/
        return this.excute(new WorkCallback<Long, Jedis>() {
            @Override
            public Long doWorkCallback(Jedis jedis) {
                return jedis.decr(key);
            }
        });
    }

    @Override
    public Long expire(final String key, final int second) {
        /*Jedis jedis=jedisPool.getResource();
        Long result = jedis.expire(key, second);
        jedis.close();
        return result;*/
        return this.excute(new WorkCallback<Long, Jedis>() {
            @Override
            public Long doWorkCallback(Jedis jedis) {
                return jedis.expire(key, second);
            }
        });
    }

    @Override
    public Long ttl(final String key) {
        /*Jedis jedis=jedisPool.getResource();
        Long result = jedis.ttl(key);
        jedis.close();
        return result;*/
        return this.excute(new WorkCallback<Long, Jedis>() {
            @Override
            public Long doWorkCallback(Jedis jedis) {
                return jedis.ttl(key);
            }
        });
    }

    @Override
    public Long del(final String key) {
        /*Jedis jedis=jedisPool.getResource();
        Long result = jedis.del(key);
        jedis.close();
        return result;*/
        return this.excute(new WorkCallback<Long, Jedis>() {
            @Override
            public Long doWorkCallback(Jedis jedis) {
                return jedis.del(key);
            }
        });
    }

    @Override
    public Long hdel(final String hkey, final String key) {
        /*Jedis jedis=jedisPool.getResource();
        Long result = jedis.hdel(hkey, key);
        jedis.close();
        return result;*/
        return this.excute(new WorkCallback<Long, Jedis>() {
            @Override
            public Long doWorkCallback(Jedis jedis) {
                return jedis.hdel(hkey,key);
            }
        });
    }
}
