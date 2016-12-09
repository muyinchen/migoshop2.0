package com.migo.service;

import com.migo.mapper.ItemParamItemMapper;
import com.migo.pojo.ItemParamItem;
import com.migo.utils.JsonUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import tk.mybatis.mapper.entity.Example;

import java.util.Date;
import java.util.List;

/**
 * Author  知秋
 * Created by kauw on 2016/11/14.
 */
@Service
public class ItemParamItemService extends BaseService<ItemParamItem> {
    @Value("${REDIS_KEY}")
    private String REDIS_KEY;
    @Value("${REDIS_TIME}")
    private Integer REDIS_TIME;
    private static final String ITEM_PARAM_KEY = ":ITEM_PARAM_ITEM";

    @Autowired
    private JedisClient jedisClient;
    @Autowired
    private ItemParamItemMapper itemParamItemMapper;

    /**
     * 更新商品规格参数数据
     * @param itemId
     * @param itemParams
     * @return
     */
    public Integer updateItemParamItem(Long itemId, String itemParams) {
        ItemParamItem itemParamItem=new ItemParamItem();
        itemParamItem.setParamData(itemParams);
        itemParamItem.setUpdated(new Date());

        //更新
        Example example=new Example(ItemParamItem.class);
        example.createCriteria().andEqualTo("itemId",itemId);
        return this.itemParamItemMapper.updateByExampleSelective(itemParamItem,example);
    }

    /**
     * 根据商品id查询商品规格参数数据
     * @param itemId
     * @return
     */
    public ItemParamItem queryByIdse(Long itemId) {
        //添加缓存逻辑
        String key=REDIS_KEY+":"+itemId+ITEM_PARAM_KEY;
        try {
            String s = jedisClient.get(key);
            if (StringUtils.isNotEmpty(s)){
                return JsonUtils.jsonToPojo(s,ItemParamItem.class);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }


        ItemParamItem example=new ItemParamItem();
        example.setItemId(itemId);

        ItemParamItem itemParamItem = this.itemParamItemMapper.select(example).get(0);

        //加入缓存
        try {
            jedisClient.set(key,JsonUtils.objectToJson(itemParamItem),REDIS_TIME);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return itemParamItem;
    }
}
