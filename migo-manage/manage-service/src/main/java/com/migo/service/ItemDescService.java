package com.migo.service;

import com.migo.pojo.ItemDesc;
import com.migo.utils.JsonUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Author  知秋
 * Created by kauw on 2016/11/12.
 */
@Service
public class ItemDescService extends BaseService<ItemDesc> {
    @Value("${REDIS_KEY}")
    private String REDIS_KEY;
    @Value("${REDIS_TIME}")
    private Integer REDIS_TIME;
    private static final String ITEM_DESC_KEY = ":ITEM_DESC";

    @Autowired
    private JedisClient jedisClient;

    public ItemDesc queryByIdse(Long itemId) {
        //加入缓存逻辑
        String key=REDIS_KEY+":"+itemId+ITEM_DESC_KEY;
        try {
            String jsonData = jedisClient.get(key);
            if (StringUtils.isNotEmpty(jsonData)){
                return JsonUtils.jsonToPojo(jsonData,ItemDesc.class);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        ItemDesc itemDesc = super.queryById(itemId);

        //数据添加到缓存中
        try {
            jedisClient.set(key,JsonUtils.objectToJson(itemDesc),REDIS_TIME);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return itemDesc;
    }
}
