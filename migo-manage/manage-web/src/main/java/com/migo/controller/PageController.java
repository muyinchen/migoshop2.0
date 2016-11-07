package com.migo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Author  知秋
 * Created by kauw on 2016/11/7.
 * 通用页面的跳转
 */
@Controller
public class PageController {

    @RequestMapping(value = "/page/{pageName}",method = RequestMethod.GET)
    public String tpage(@PathVariable String pageName){
        return pageName;
    }
}
