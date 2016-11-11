package com.migo.controller;

import com.migo.pojo.ItemCat;
import com.migo.service.ItemCatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * Author  知秋
 * Created by kauw on 2016/11/8.
 */
@Controller
@RequestMapping("item/cat")
public class ItemCatController {
    @Autowired
    private ItemCatService itemCatService;

    /**
     * 根据父节点id查询商品类目表
     */

    @RequestMapping(method = RequestMethod.GET)
public ResponseEntity<List<ItemCat>> getItemCatList(
        @RequestParam(value = "id",defaultValue = "0") Long parentId
){

    try {
        //List<ItemCat> itemcats=itemCatService.getItemCatList(parentId);
        ItemCat example=new ItemCat();
        example.setParentId(parentId);
        List<ItemCat> itemCats = itemCatService.queryListByWhere(example);
        if (null==itemCats&&itemCats.isEmpty()){
            //资源不存在，响应404
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return  ResponseEntity.ok(itemCats);
    } catch (Exception e) {
        e.printStackTrace();
        // 出错，响应500
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
}
}
