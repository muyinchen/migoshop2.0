package com.migo.sso.service;

import com.migo.service.JedisClient;
import com.migo.sso.mapper.UserMapper;
import com.migo.sso.pojo.User;
import com.migo.utils.JsonUtils;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * Author  知秋
 * Created by kauw on 2016/12/25.
 */
@Service
public class UserService {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private JedisClient jedisClient;

    public Boolean check(String param, Integer type) {
        User example = new User();
        switch (type) {
            case 1:
                example.setUsername(param);
                break;
            case 2:
                example.setPhone(param);
                break;
            case 3:
                example.setEmail(param);
                break;
            default:
                return null;
        }


        return null != this.userMapper.selectOne(example);
    }

    public Boolean doRegister(User user) {
        user.setId(null);
        Date date=new Date();
        user.setCreated(date);
        user.setUpdated(date);
        //密码加密，md5已经不安全，故采用sha256
        user.setPassword(DigestUtils.sha256Hex(user.getPassword()));
        return this.userMapper.insert(user)==1;
    }

    public String doLogin(String username, String password) {
        User user=new User();
        user.setUsername(username);
        User selectOne = this.userMapper.selectOne(user);
        if (selectOne == null) {
            return null;
        }
        if (!StringUtils.equals(DigestUtils.sha256Hex(password),selectOne.getPassword())){
            return null;
        }
        //生成token
        String token=DigestUtils.md5Hex(System.currentTimeMillis()+username);

        this.jedisClient.set("REDIS_SESSION_TOKEN:"+token, JsonUtils.objectToJson(selectOne));
        return token;
    }

    public User queryByToken(String token) {

        String tokenkey="REDIS_SESSION_TOKEN:" + token;
        //根据token取用户信息
        String json = jedisClient.get(tokenkey);
        if (StringUtils.isEmpty(json)){
            return null;
        }

        //假如出错，为了不影响业务逻辑，故自己来处理异常
        try {
            this.jedisClient.expire(tokenkey,1800);
            return JsonUtils.jsonToPojo(json,User.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
