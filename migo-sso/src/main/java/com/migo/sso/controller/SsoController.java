package com.migo.sso.controller;

import com.migo.sso.pojo.User;
import com.migo.sso.service.UserService;
import com.migo.utils.CookieUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Author  知秋
 * Created by kauw on 2016/12/20.
 */
@Controller
@RequestMapping("user")
public class SsoController {

    private static final Logger logger= LoggerFactory.getLogger(SsoController.class);

    private static final String COOKIE_NAME = "MG_TOKEN";

    @Autowired
    private UserService userService;

    @GetMapping("register")
    public String register(){
        return "register";
    }

    @GetMapping("doLogin")
    public String doLogin(){
        return "login";
    }

    @PostMapping("doLogin")
    @ResponseBody
    public Map<String,Object> doLogin(@RequestParam("username") String username,
                                      @RequestParam("password") String password,
                                      HttpServletRequest request,
                                      HttpServletResponse response){

        Map<String,Object> map=new HashMap<>();
        try {
            if (logger.isInfoEnabled()){
                logger.info("用户登录功能 username = {} ,password = {}",username,password);
            }
            String token=this.userService.doLogin(username,password);
            if (token == null) {
                map.put("status",400);
            }else {
                //登录成功将token写入到cookie中
                map.put("status",200);
                CookieUtils.setCookie(request,response,COOKIE_NAME,token);
            }
        } catch (Exception e) {
            logger.error("用户登录失败 username = {}",username,e);
            map.put("status",500);
        }
        return map;
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
    public Map<String,Object> doRegister(@Validated User user, BindingResult bindingResult){
        Map<String,Object> map=new HashMap<>();
        try {
            if (logger.isInfoEnabled()){
                logger.info("注册用户 user = {}", user);
            }
            if (bindingResult.hasErrors()){
                List<String> megs=new ArrayList<>();
                List<ObjectError> allErrors = bindingResult.getAllErrors();

                allErrors.stream().forEach(objectError->megs.add(objectError.getDefaultMessage()));
                map.put("status","401");
                map.put("data", StringUtils.join(megs,"|"));
                return map;
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


    @GetMapping("{token}")
    public ResponseEntity<User> queryByToken(@PathVariable("token") String token){

        try {
            if (logger.isInfoEnabled()){
                logger.info("根据token查询用户信息 token = {}", token);
            }
            User user=this.userService.queryByToken(token);
            if (null==user){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            logger.error("根据token查询用户信息 出错 token = {}", token,e);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }

}
