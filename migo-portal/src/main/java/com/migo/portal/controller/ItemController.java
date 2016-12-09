package com.migo.portal.controller;

import com.migo.portal.pojo.Item;
import com.migo.portal.pojo.ItemDesc;
import com.migo.portal.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Author  知秋
 * Created by kauw on 2016/12/9.
 */
@Controller
@RequestMapping("item")
public class ItemController {
    @Autowired
    private ItemService itemService;


    @RequestMapping(value = "{itemId}",method = RequestMethod.GET)
    public String getItem(Model model, @PathVariable(value = "itemId") Long itemId){
        Item item=this.itemService.queryItemByItemId(itemId);
        model.addAttribute("item",item);
        ItemDesc itemDesc=this.itemService.queryItemDescByItemId(itemId);
        model.addAttribute("itemDesc",itemDesc);
        String itemParamItem=this.itemService.queryItemParamItemByItemId(itemId);
        model.addAttribute("itemParam",itemParamItem);
        return "item";
    }
}
