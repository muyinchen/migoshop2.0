package com.migo.service;

import com.migo.utils.FastDFSClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

/**
 * 图片上传
 * Author  知秋
 * Created by kauw on 2016/11/11.
 */
@Service
public class PicService {
    @Value("${IMAGE_SERVER_BASE_URL}")
    private String IMAGE_SERVER_BASE_URL;

    public Map uploadFile(MultipartFile uploadFile){

        try {
            FastDFSClient client=new FastDFSClient("classpath:properties/env.properties");
            //获取图片原始名称
            String filename = uploadFile.getOriginalFilename();
            //取扩展名
            String extendName = filename.substring(filename.lastIndexOf(".") + 1);
            String url=client.uploadFile(uploadFile.getBytes(),extendName);
            //拼接URL
            url=IMAGE_SERVER_BASE_URL+url;
            //返回map数据
            Map result=new HashMap();
            result.put("error",0);
            result.put("url",url);
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            //返回Map数据
            Map result = new HashMap<>();
            result.put("error", 1);
            result.put("message", "上传失败");

            return result;

        }

    }
}
