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

    /**
     * 新增节点
     * @param contentCategory
     * @return
     */
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<ContentCategory> addContentCategery(ContentCategory contentCategory)
    {
        try {
            if (logger.isInfoEnabled()){
                logger.info("新增节点 contentCategory = {}",contentCategory);
            }
            //补全字段
            contentCategory.setId(null);
            contentCategory.setIsParent(false);
            contentCategory.setSortOrder(1);
            contentCategory.setStatus(1);
            this.contentCategoryService.save(contentCategory);

            //新增节点后可能会改变父节点的状态isParent
            ContentCategory parent = this.contentCategoryService.queryById(contentCategory.getParentId());
            if (!parent.getIsParent()) {

                parent.setIsParent(true);
                this.contentCategoryService.updateSelective(parent);
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(contentCategory);
        } catch (Exception e) {
           logger.error("新增节点 服务器傲娇了 contentCategory = {}",contentCategory,e);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }

    /**
     * 修改节点
     * @param contentCategory
     * @return
     */
    @RequestMapping(method = RequestMethod.PUT)
    public ResponseEntity<Void> updateContentCategery(ContentCategory contentCategory){
        try {
            if (logger.isInfoEnabled()){
                logger.info("修改节点 contentCategory = {}",contentCategory);
            }
            this.contentCategoryService.updateSelective(contentCategory);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
           logger.error("修改节点 服务器傲娇了 contentCategory = {}",contentCategory,e);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    /**
     * 删除节点
     * @param contentCategory
     * @return
     */
    @RequestMapping(method = RequestMethod.DELETE)
    public ResponseEntity<Void> delete(ContentCategory contentCategory){
        try {
            if (logger.isInfoEnabled()){
                logger.info("删除节点 contentCategory = {}",contentCategory);
            }
            this.contentCategoryService.deleteDuDu(contentCategory);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {

            logger.error("删除节点 服务器傲娇了 contentCategory = {}",contentCategory,e);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }


}
