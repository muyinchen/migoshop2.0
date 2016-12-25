package com.migo.sso.service;

import com.migo.sso.mapper.UserMapper;
import com.migo.sso.pojo.User;
import org.apache.commons.codec.digest.DigestUtils;
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
}
