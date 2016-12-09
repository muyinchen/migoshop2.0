package com.migo.portal.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.migo.portal.pojo.Item;
import com.migo.portal.pojo.ItemDesc;
import com.migo.portal.pojo.ItemParamItem;
import com.migo.service.JedisClient;
import com.migo.utils.HttpClientUtil;
import com.migo.utils.JsonUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Author  知秋
 * Created by kauw on 2016/12/9.
 */
@Service
public class ItemService {
    private static final ObjectMapper MAPPER = new ObjectMapper();
    @Autowired
    private JedisClient jedisClient;

    private static final String REDIS_KEY = "MIGO_PORTAL";


    private static final Integer REDIS_TIME = 60 * 60 * 24 * 30;
    @Value("${MIGO_MANAGE_URL}")
    private String MIGO_MANAGE_URL;
    public Item queryItemByItemId(Long itemId) {

        //添加缓存逻辑
        String key=REDIS_KEY+":"+itemId+":ITEM_DETAIL";
        try {

            String redisJsonData = jedisClient.get(key);
            if (StringUtils.isNotEmpty(redisJsonData)){
                return JsonUtils.jsonToPojo(redisJsonData,Item.class);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        //正常业务逻辑
        try {
            String URL=MIGO_MANAGE_URL+"/rest/webs/item/"+itemId;
            String doGetJsonData = HttpClientUtil.doGet(URL);
            //将数据写入缓存中
            try {
                jedisClient.set(key,doGetJsonData,REDIS_TIME);
            } catch (Exception e) {
                e.printStackTrace();
            }

            return JsonUtils.jsonToPojo(doGetJsonData,Item.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public ItemDesc queryItemDescByItemId(Long itemId) {
        //添加缓存逻辑
        String key=REDIS_KEY+":"+itemId+":ITEM_DESC";
        try {

            String redisJsonData = jedisClient.get(key);
            if (StringUtils.isNotEmpty(redisJsonData)){
                return JsonUtils.jsonToPojo(redisJsonData,ItemDesc.class);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        try {
            String URL=MIGO_MANAGE_URL+"/rest/webs/item/desc/"+itemId;
            String doGetJsonData = HttpClientUtil.doGet(URL);

            //将数据写入缓存中
            try {
                jedisClient.set(key,doGetJsonData,REDIS_TIME);
            } catch (Exception e) {
                e.printStackTrace();
            }

            return JsonUtils.jsonToPojo(doGetJsonData,ItemDesc.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public String queryItemParamItemByItemId(Long itemId) {
        //添加缓存逻辑
        String key=REDIS_KEY+":"+itemId+":ITEM_PARAM_ITEM";
        try {
            String redisJsonData = jedisClient.get(key);
            if (StringUtils.isNotEmpty(redisJsonData)){
                return redisJsonData;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            String URL=MIGO_MANAGE_URL+"/rest/webs/item/paramitem/"+itemId;
            String doGetJsonData = HttpClientUtil.doGet(URL);
            ItemParamItem itemParamItem = JsonUtils.jsonToPojo(doGetJsonData, ItemParamItem.class);
            String paramData = itemParamItem.getParamData();
            ArrayNode arrayNode = (ArrayNode) MAPPER.readTree(paramData);
            StringBuilder sb = new StringBuilder();
            sb.append("<table cellpadding=\"0\" cellspacing=\"1\" width=\"100%\" border=\"0\" class=\"Ptable\"><tbody>");
            for (JsonNode param : arrayNode) {
                sb.append("<tr><th class=\"tdTitle\" colspan=\"2\">" + param.get("group").asText()
                        + "</th></tr>");
                ArrayNode params = (ArrayNode) param.get("params");
                for (JsonNode p : params) {
                    sb.append("<tr><td class=\"tdTitle\">" + p.get("k").asText() + "</td><td>"
                            + p.get("v").asText() + "</td></tr>");
                }
            }
            sb.append("</tbody></table>");

            //将数据写入缓存中
            try {
                jedisClient.set(key,sb.toString(),REDIS_TIME);
            } catch (Exception e) {
                e.printStackTrace();
            }

            return sb.toString();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
