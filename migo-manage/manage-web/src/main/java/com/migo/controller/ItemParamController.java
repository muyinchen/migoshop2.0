package com.migo.controller;

import com.migo.pojo.EasyUIDataGridResult;
import com.migo.pojo.ItemParam;
import com.migo.service.ItemParmService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Author  知秋
 * Created by kauw on 2016/11/14.
 */
@Controller
@RequestMapping("item/param")
public class ItemParamController {
    private final Logger logger= LoggerFactory.getLogger(ItemParamController.class);
    @Autowired
    private ItemParmService itemParmService;

    @RequestMapping(value = "{itemCatId}" ,method = RequestMethod.GET)
    public ResponseEntity<ItemParam> getItemParamByCid(@PathVariable("itemCatId") Long itemCatId){
        try {
            if (logger.isInfoEnabled()) {
                logger.info("查询某商品规格模板参数模板 itemCatId= {}",itemCatId);
            }
            ItemParam example=new ItemParam();
            example.setItemCatId(itemCatId);
            ItemParam itemParam = this.itemParmService.queryOne(example);
            if (itemParam==null) {
                if (logger.isInfoEnabled()) {
                    logger.info("所查询商品规格模板参数模板 不存在 itemCatId= {}",itemCatId);
                }
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);

            }
            return ResponseEntity.ok(itemParam);
        } catch (Exception e) {
            logger.error("查询某商品规格模板参数模板 失败 itemCatId= {}",itemCatId,e);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }


    /**
     * 新增规格参数模板
     */
    @RequestMapping(value = "{itemCatId}",method = RequestMethod.POST)
    public ResponseEntity<Void> addItemParamByItemCatId(
            @PathVariable("itemCatId") Long itemCatId,@RequestParam("paramData") String paramData
    ){
        try {
            if (logger.isInfoEnabled()) {
                logger.info("新增某商品规格模板参数模板 itemCatId= {}，paramData = {}",itemCatId,paramData);
            }
            ItemParam itemparam=new ItemParam();
            itemparam.setId(null);   //置空，防止恶意修改 `id` bigint(20) NOT NULL AUTO_INCREMENT
            itemparam.setItemCatId(itemCatId);
            itemparam.setParamData(paramData);
            this.itemParmService.save(itemparam);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            logger.error("新增某商品规格模板参数模板 失败 itemCatId= {}，"+itemCatId+"paramData = {}"+paramData,e);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    /**
     * 查询规格参数模板列表
     */
    @RequestMapping(value = "/list",method = RequestMethod.GET)
    public ResponseEntity<EasyUIDataGridResult> getItemparmList(Integer page,Integer rows){
        try {
            if (logger.isInfoEnabled()) {
                logger.info("查询商品规格模板参数模板 page= {}，rows = {}",page,rows);
            }
            EasyUIDataGridResult result=this.itemParmService.getItemParamList(page,rows);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("查询商品规格参数模板列表出错：page="+page+",rows="+rows,e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
