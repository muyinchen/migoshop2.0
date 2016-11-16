package com.migo.controller;

import com.migo.pojo.ItemParamItem;
import com.migo.service.ItemParamItemService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Author  知秋
 * Created by kauw on 2016/11/14.
 */
@Controller
@RequestMapping("item/param/item/")
public class ItemParamItemController {
    private static final Logger logger= LoggerFactory.getLogger(ItemParamItemController.class);

    @Autowired
    private ItemParamItemService itemParamItemService;
    /**
     * 根据商品Id查询商品规格参数数据
     */
    @RequestMapping(value = "{itemId}",method = RequestMethod.GET)
    public ResponseEntity<ItemParamItem> showItemParam(@PathVariable("itemId") Long itemId){

        try {
            if(logger.isInfoEnabled()){
                logger.info("根据商品Id查询商品规格参数数据 itemId = {}",itemId);
            }
            ItemParamItem example=new ItemParamItem();
            example.setItemId(itemId);
            ItemParamItem itemParamItem = this.itemParamItemService.queryOne(example);
            if (null==itemParamItem){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            return ResponseEntity.ok(itemParamItem);
        } catch (Exception e) {
          logger.error("根据商品Id查询商品规格参数数据 失败 itemId = {}",itemId,e);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
}
