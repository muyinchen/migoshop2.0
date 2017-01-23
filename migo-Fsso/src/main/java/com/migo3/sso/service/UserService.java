package com.migo3.sso.service;

import com.migo.service.JedisClient;
import com.migo.utils.JsonUtils;
import com.migo3.sso.pojo.User;
import com.migo3.sso.pojo.UserImpl;
import com.migo3.sso.pojo.UserManager;
import com.speedment.runtime.field.StringField;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Date;


/**
 * Author  知秋
 * Created by kauw on 2016/12/29.
 */
@Service
public class UserService {
    @Autowired
    private JedisClient jedisClient;
    @Autowired
    private UserManager userManager;

    public Boolean doRegister(UserImpl user) {
        Date date=new Date();
        Timestamp time = new Timestamp(date.getTime());

        user.setCreated(time);
        user.setUpdated(time);
        //密码加密，md5已经不安全，故采用sha256
        user.setPassword(DigestUtils.sha256Hex(user.getPassword()));

        return userManager.persist(user) != null;
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

    public String doLogin(String username, String password) {
        User user=userManager.stream()
                .filter(User.USERNAME.equal(username))
                .filter(User.PASSWORD.equal(DigestUtils.sha256Hex(password)))
                .findAny().orElse(null);

        //生成token
        String token=DigestUtils.md5Hex(System.currentTimeMillis()+username);

        this.jedisClient.set("REDIS_SESSION_TOKEN:"+token, JsonUtils.objectToJson(user));
        return token;
    }

    public Boolean check(String param, Integer type) {
        StringField<User, String> userparam;
        switch (type){
            case 1:
                userparam = User.USERNAME;
                break;
            case 2:
                userparam=User.PHONE;
                break;
            case 3:
                userparam=User.EMAIL;
                break;
            default:
                return null;
        }
        return null!= userManager.stream()
                .filter(userparam.equal(param))
                .findAny()
                .orElse(null);
       /* if (type==1)return userManager.stream().filter(User.USERNAME.equal(param)).findAny().orElse(null)!=null;
        else if(type==2) return  userManager.stream().filter(User.PHONE.equal(param)).findAny().orElse(null)!=null;
        else if (type==3) return userManager.stream().filter(User.EMAIL.equal(param)).findAny().orElse(null)!=null;
        else return null;*/



    }
}
