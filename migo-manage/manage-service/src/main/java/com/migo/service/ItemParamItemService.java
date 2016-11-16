package com.migo.service;

import com.migo.mapper.ItemParamItemMapper;
import com.migo.pojo.ItemParamItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tk.mybatis.mapper.entity.Example;

import java.util.Date;

/**
 * Author  知秋
 * Created by kauw on 2016/11/14.
 */
@Service
public class ItemParamItemService extends BaseService<ItemParamItem> {
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
}
