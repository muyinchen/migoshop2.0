package com.migo.controller;

import com.migo.pojo.ContentCategory;
import com.migo.service.ContentCategoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
 * Created by kauw on 2016/11/20.
 */
@Controller
@RequestMapping("content/category")
public class ContentCategoryController {
    private static final Logger logger= LoggerFactory.getLogger(ContentCategoryController.class);
    @Autowired
    private ContentCategoryService contentCategoryService;


    /**
     * 根据父节点id查询节点列表
     * @param parentId
     * @return
     */
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<List<ContentCategory>> getContentCatList(
            @RequestParam(value = "id", defaultValue = "0") Long parentId) {

        try {
            if (logger.isInfoEnabled()){
                logger.info("根据父节点id查询节点列表 parentId = {}",parentId);
            }
            ContentCategory example=new ContentCategory();
            example.setParentId(parentId);
            List<ContentCategory> categoryList = this.contentCategoryService.queryListByWhere(example);
            if (categoryList==null||categoryList.isEmpty()){
                if (logger.isInfoEnabled()){
                    logger.info("根据父节点id查询节点列表 未找到 parentId = {}",parentId);
                }
                return  ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            return  ResponseEntity.ok(categoryList);
        } catch (Exception e) {
           logger.error("根据父节点id查询节点列表 服务器傲娇了 parentId = {}",parentId,e);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
}
