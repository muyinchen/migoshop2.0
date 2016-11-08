package com.migo.service;

import com.migo.mapper.ItemCatMapper;
import com.migo.pojo.ItemCat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Author  知秋
 * Created by kauw on 2016/11/8.
 */
@Service
public class ItemCatService {
    @Autowired
    private ItemCatMapper itemCatMapper;


    public List<ItemCat> getItemCatList(Long parentId) {
        ItemCat example = new ItemCat();
        example.setParentId(parentId);
        return this.itemCatMapper.select(example);
    }
}
