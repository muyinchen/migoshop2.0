package com.migo.portal.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.migo.portal.pojo.Content;
import com.migo.utils.HttpClientUtil;
import com.migo.utils.JsonUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Author  知秋
 * Created by kauw on 2016/12/4.
 */
@Service
public class IndexService {

    @Value("${MIGO_MANAGE_URL}")
    private String MIGO_MANAGE_URL;

    @Value("${AD1_URL}")
    private String AD1_URL;

    private static final ObjectMapper MAPPER = new ObjectMapper();

    public String queryAD1(){
        try {
            //调用后台管理系统的接口服务获取数据
            String url=MIGO_MANAGE_URL+AD1_URL;
            String jsonData = HttpClientUtil.doGet(url);
            if (jsonData==null){
                return null;
            }
            //解析json数据
            JsonNode jsonNode = MAPPER.readTree(jsonData);
            ArrayNode rows = (ArrayNode) jsonNode.get("rows");
            List<Content> contents = JsonUtils.jsonToList(String.valueOf(rows), Content.class);
            List<Map<String,Object>> result1=new ArrayList<>();
            for (Content content : contents) {
                Map<String,Object> map=new LinkedHashMap<>();
                map.put("srcB",content.getPic());
                map.put("height",240);
                map.put("alt",content.getTitle());
                map.put("width",670);
                map.put("src",content.getPic2());
                map.put("widthB",550);
                map.put("href",content.getUrl());
                map.put("heightB",240);
                result1.add(map);
            }

            return JsonUtils.objectToJson(result1);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;


    }
}
