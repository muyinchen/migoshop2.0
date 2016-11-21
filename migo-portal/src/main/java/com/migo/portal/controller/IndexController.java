package com.migo.portal.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Author  知秋
 * Created by kauw on 2016/11/16.
 */
@Controller
public class IndexController {
    /**
     * 首页
     */
    @RequestMapping(value = "index",method = RequestMethod.GET)
    public String index(){



        return "index";
    }
}
