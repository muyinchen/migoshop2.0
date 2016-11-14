package com.migo.controller;

import com.migo.service.PicService;
import com.migo.utils.JsonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

/**
 * 图片上传controller
 * Author  知秋
 * Created by kauw on 2016/11/11.
 */
@Controller
public class PicController {
    @Autowired
    private PicService picService;

    @RequestMapping("/pic/upload")
    @ResponseBody
    public String uploadFile(MultipartFile uploadFile){
        Map result = picService.uploadFile(uploadFile);

        //把Java对象手工转换成json数据
        String json = JsonUtils.objectToJson(result);
        return json;

    }
}
