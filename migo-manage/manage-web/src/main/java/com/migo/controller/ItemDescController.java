package com.migo.controller;

import com.migo.pojo.ItemDesc;
import com.migo.service.ItemDescService;
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
@RequestMapping("item/desc")
public class ItemDescController {
    private static final Logger logger= LoggerFactory.getLogger(ItemDescController.class);

    @Autowired
    private ItemDescService itemDescService;

    /**
     * 根据商品id查询商品描述信息
     */
    @RequestMapping(value = "{itemId}",method = RequestMethod.GET)
    public ResponseEntity<ItemDesc> queryItemDescByItemId(
            @PathVariable("itemId") Long itemId
    ){

        if (logger.isInfoEnabled()){
            logger.info("商品描述信息查询 id = {}",itemId);
        }
        try {
            ItemDesc itemDesc = this.itemDescService.queryById(itemId);
            if (itemDesc==null){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            return ResponseEntity.ok(itemDesc);
        } catch (Exception e) {
            logger.error("商品描述查询失败id = {}",itemId,e);

        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
}
