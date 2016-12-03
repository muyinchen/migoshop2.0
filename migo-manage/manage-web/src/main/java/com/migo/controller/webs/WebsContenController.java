package com.migo.controller.webs;

import com.migo.pojo.EasyUIDataGridResult;
import com.migo.service.ContentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Author  知秋
 * Created by kauw on 2016/12/4.
 */
@Controller
@RequestMapping("webs/content")
public class WebsContenController {
    private static final Logger logger= LoggerFactory.getLogger(WebsContenController.class);
    @Autowired
    private ContentService contentService;
    /**
     * 根据categoryId查询内容列表
     * @param categoryId
     * @param page
     * @param rows
     * @return
     */
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<EasyUIDataGridResult> queryListByCategoryId(
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "page",defaultValue = "1") Integer page,
            @RequestParam(value = "rows",defaultValue = "20") Integer rows

    ){

        try {
            if (logger.isInfoEnabled()){
                logger.info("根据categoryId查询内容列表 categoryId = {}",categoryId);
            }
            EasyUIDataGridResult result=this.contentService.queryListByCategoryId(categoryId,page,rows);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("根据categoryId查询内容列表 服务器傲娇了 categoryId = {}",categoryId,e);

        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
}
