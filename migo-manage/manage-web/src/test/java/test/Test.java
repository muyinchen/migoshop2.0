package test;

import com.alibaba.fastjson.JSON;
import com.migo.pojo.ItemCat;
import com.migo.service.ItemCatService;
import org.apache.log4j.Logger;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;
import java.util.List;

/**
 * Author  知秋
 * Created by kauw on 2016/11/8.
 */
@RunWith(SpringJUnit4ClassRunner.class) //表示继承了SpringJUnit4ClassRunner类
@ContextConfiguration(locations = {"classpath*:spring/*.xml"})
public class Test {
    private static Logger logger=Logger.getLogger(Test.class);
    @Resource
    private ItemCatService itemCatService;
    @org.junit.Test
    public void test1(){
        List<ItemCat> itemCatList = itemCatService.getItemCatList(0L);
        logger.info(JSON.toJSONString(itemCatList));
    }

}
