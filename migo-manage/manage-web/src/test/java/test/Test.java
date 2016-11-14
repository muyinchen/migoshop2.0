package test;

import com.alibaba.fastjson.JSON;
import com.github.pagehelper.PageHelper;
import com.migo.mapper.ItemMapper;
import com.migo.pojo.Item;
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
    @Resource
    private ItemMapper itemMapper;
    @org.junit.Test
    public void test1(){
       // List<ItemCat> itemCatList = itemCatService.getItemCatList(0L);
        ItemCat example=new ItemCat();
        example.setParentId(0L);
        List<ItemCat> itemCatList = itemCatService.queryListByWhere(example);
        logger.info(JSON.toJSONString(itemCatList));
    }
    @org.junit.Test
    public void test(){
        PageHelper.startPage(1, 20); // 核心分页代码
        List<Item> cls =  itemMapper.selectAll();
        for (Item item : cls) {
            System.out.println(item.getTitle());
        }
    }

}
