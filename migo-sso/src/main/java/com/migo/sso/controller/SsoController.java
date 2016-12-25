package com.migo.sso.controller;

import com.migo.sso.pojo.User;
import com.migo.sso.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Author  知秋
 * Created by kauw on 2016/12/20.
 */
@Controller
@RequestMapping("user")
public class SsoController {

    private static final Logger logger= LoggerFactory.getLogger(SsoController.class);

    @Autowired
    private UserService userService;

    @GetMapping("register")
    public String register(){
        return "register";
    }

    @GetMapping("/check/{param}/{type}")
    public ResponseEntity<Boolean> check(@PathVariable String param, @PathVariable Integer type){
        try {
            if (logger.isInfoEnabled()){
                logger.info("检查数据是否可用 param = {} ,type = {}",param,type);
            }
            Boolean bool=this.userService.check(param,type);
            if (null==bool){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
            return ResponseEntity.ok(bool);
        } catch (Exception e) {
            logger.error("检查数据是否可用 出现异常",e);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }

    @PostMapping("doRegister")
    @ResponseBody
    public Map<String,Object> doRegister(User user){
        Map<String,Object> map=new HashMap<>();
        try {
            if (logger.isInfoEnabled()){
                logger.info("注册用户 user = {}", user);
            }
            Boolean bool=this.userService.doRegister(user);
            if (bool){
                map.put("status",200);
            }else {
                map.put("status",500);
                map.put("data","注册失败");
            }
        } catch (Exception e) {
           logger.error("注册失败 user = {} ",user,e);
            map.put("status",500);
            map.put("data","注册失败");
        }
        return map;
    }



}
