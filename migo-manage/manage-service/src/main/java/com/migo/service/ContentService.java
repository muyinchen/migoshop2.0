package com.migo.service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.migo.mapper.ContentMapper;
import com.migo.pojo.Content;
import com.migo.pojo.EasyUIDataGridResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tk.mybatis.mapper.entity.Example;

import java.util.List;

import static javafx.scene.input.KeyCode.O;

/**
 * Author  知秋
 * Created by kauw on 2016/12/3.
 */
@Service
public class ContentService extends BaseService<Content> {
   @Autowired
    private ContentMapper contentMapper;

    public EasyUIDataGridResult queryListByCategoryId(Long categoryId, Integer page, Integer rows) {
        PageHelper.startPage(page,rows);


        Example expample=new Example(Content.class);
        expample.createCriteria().andCondition("category_id").andEqualTo(categoryId);
        expample.orderBy("updated").desc();
        List<Content> contents = contentMapper.selectByExample(expample);
        PageInfo<Content> pageInfo=new PageInfo<>(contents);
        return new EasyUIDataGridResult(pageInfo.getList(),pageInfo.getTotal());

    }
}
