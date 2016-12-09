package com.migo.controller.webs;

import com.migo.pojo.Item;
import com.migo.pojo.ItemDesc;
import com.migo.pojo.ItemParamItem;
import com.migo.service.ItemDescService;
import com.migo.service.ItemParamItemService;
import com.migo.service.ItemService;
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
 * Created by kauw on 2016/12/9.
 */
@Controller
@RequestMapping("webs/item")
public class WebsItemController {
    private static final Logger logger= LoggerFactory.getLogger(WebsItemController.class);
    @Autowired
    private ItemService itemService;
    @Autowired
    private ItemDescService itemDescService;
    @Autowired
    private ItemParamItemService itemParamItemService;

    /**
     * 根据itemId查询商品详情
     * @param itemId
     * @return
     */
    @RequestMapping(value = "{itemId}",method = RequestMethod.GET)
    public ResponseEntity<Item> queryByItemId(@PathVariable("itemId") Long itemId){
        try {
            if (logger.isInfoEnabled()){
                logger.info("根据itemId查询商品详情 itemId = {}",itemId);
            }
            Item item = this.itemService.queryByIdse(itemId);
            if (null==item){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            logger.error("根据itemId查询商品详情出错，服务器傲娇了 itemId = {}",itemId,e);

        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }


    /**
     * 根据itemId查询商品描述
     * @param itemId
     * @return
     */
    @RequestMapping(value = "/desc/{itemId}",method = RequestMethod.GET)
    public ResponseEntity<ItemDesc> queryDescByitemId(@PathVariable("itemId") Long itemId){

        try {
            if (logger.isInfoEnabled()){
                logger.info("根据itemId查询商品描述 itemId = {}",itemId);
            }
            ItemDesc itemDesc = this.itemDescService.queryByIdse(itemId);
            if (null==itemDesc) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            return ResponseEntity.ok(itemDesc);
        } catch (Exception e) {
            logger.error("根据itemId查询商品描述出错，服务器傲娇了 itemId = {}",itemId,e);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }

    /**
     * 根据itemId查询商品规格参数
     * @param itemId
     * @return
     */
    @RequestMapping(value = "/paramitem/{itemId}",method = RequestMethod.GET)
    public ResponseEntity<ItemParamItem> queryItemParamItemByitemId(
            @PathVariable("itemId") Long itemId){
        try {
            if (logger.isInfoEnabled()){
                logger.info("根据itemId查询商品规格参数 itemId = {}",itemId);
            }
            ItemParamItem itemParamItem = this.itemParamItemService.queryByIdse(itemId);
            if (itemParamItem==null){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            return ResponseEntity.ok(itemParamItem);
        } catch (Exception e) {
            logger.error("根据itemId查询商品规格参数出错，服务器傲娇了 itemId = {}",itemId,e);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }

}
