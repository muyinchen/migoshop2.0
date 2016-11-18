package com.migo.controller.webs;

import com.migo.pojo.ItemCatResult;
import com.migo.service.ItemCatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Author  知秋
 * Created by kauw on 2016/11/17.
 */
@Controller
@RequestMapping("webs/item/cat")
public class WebsItemCatController {
    private static final Logger logger= LoggerFactory.getLogger(WebsItemCatController.class);
    @Autowired
    private ItemCatService itemCatService;

   /* @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<Object> getItemCatList(String callback){
        try {
            if (logger.isInfoEnabled()) {
                logger.info("查询商品类目数据服务");
            }
            ItemCatResult itemCatList = this.itemCatService.getItemCatList();
            if (StringUtils.isEmpty(callback)) {
                String json = JsonUtils.objectToJson(itemCatList);

                return ResponseEntity.ok((Object) json);
            }
            //如果字符串不为空，需要支持jsonp调用
            MappingJacksonValue mappingJacksonValue=new MappingJacksonValue(itemCatList);
            mappingJacksonValue.setJsonpFunction(callback);
            return ResponseEntity.ok((Object) mappingJacksonValue);
        } catch (Exception e) {
           logger.error("查询商品类目数据服务 失败", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }*/
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<ItemCatResult> getItemCatList(){
        try {
            if (logger.isInfoEnabled()) {
                logger.info("查询商品类目数据服务");
            }
            ItemCatResult itemCatList = this.itemCatService.getItemCatList();
            return ResponseEntity.ok(itemCatList);
        } catch (Exception e) {
            logger.error("查询商品类目数据服务 失败", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }
}
