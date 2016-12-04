package com.migo.portal.controller;

import com.migo.portal.service.IndexService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Author  知秋
 * Created by kauw on 2016/11/16.
 */
@Controller
public class IndexController {
    @Autowired
    private IndexService indexService;
    /**
     * 首页
     */
    @RequestMapping(value = "index",method=RequestMethod.GET)
    public String index(Model model){

        String ad1 = this.indexService.queryAD1();
        //传递给页面
        model.addAttribute("indexAd1",ad1);

        return "index";
    }
}
