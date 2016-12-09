package com.migo.service;



import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.migo.mapper.ItemMapper;
import com.migo.pojo.EasyUIDataGridResult;
import com.migo.pojo.Item;
import com.migo.pojo.ItemDesc;
import com.migo.pojo.ItemParamItem;
import com.migo.utils.IDUtils;
import com.migo.utils.JsonUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import tk.mybatis.mapper.entity.Example;

import java.util.List;

/**
 * Author  知秋
 * Created by kauw on 2016/11/12.
 */
@Service
public class ItemService extends BaseService<Item> {
    @Value("${REDIS_KEY}")
    private String REDIS_KEY;
    @Value("${REDIS_TIME}")
    private Integer REDIS_TIME;
    private static final String ITEM_DETAIL_KEY = ":ITEM_DETAIL";
    @Autowired
    private JedisClient jedisClient;

    @Autowired
    private ItemMapper itemMapper;
    @Autowired
    private ItemDescService itemDescService;
    @Autowired
    private ItemParamItemService itemParamItemService;
    //desc参考前端页面传过来的数据是序列化成字符串的
    public Boolean saveItem(Item item,String desc,String itemParams){
        // 1、生成商品id
        long itemId = IDUtils.genItemId();
        // 2、对TbItem对象补全属性。
        item.setId(itemId);

        //'商品状态，1-正常，2-下架，3-删除'
        item.setStatus(1);


        //保存商品数据
        Integer save = super.save(item);

        ItemDesc itemDesc=new ItemDesc();
        itemDesc.setItemDesc(desc);
        itemDesc.setItemId(itemId);

        //保存商品描述数据
        Integer save1 = this.itemDescService.save(itemDesc);

        //保存商品规格参数数据
        ItemParamItem itemParamItem=new ItemParamItem();
        itemParamItem.setItemId(itemId);
        itemParamItem.setParamData(itemParams);
        Integer save2 = this.itemParamItemService.save(itemParamItem);
        return save.intValue()==1&&save1.intValue()==1&&save2==1;

    }

    /**
     * 查询商品列表
     */
    public EasyUIDataGridResult getItemList(Integer page,Integer rows){

        //执行查询
        Example example=new Example(Item.class);
        example.orderBy("updated").desc();

       // example.setOrderByClause("updated DESC");
        PageHelper.startPage(page,rows);

        List<Item> itemList = this.itemMapper.selectByExample(example);

        PageInfo<Item> pageInfo=new PageInfo<>(itemList);
        //返回处理结果
        EasyUIDataGridResult result=new EasyUIDataGridResult();
        result.setTotal(pageInfo.getTotal());
        result.setRows(pageInfo.getList());
        //return new EasyUIDataGridResult(pageInfo.getList(), pageInfo.getTotal());
        return result;
    }

    /**
     * 商品修改
     */
    public Boolean updateItem(Item item,String desc,String itemParams){
        //强制设置不能更新的字段为空,防止恶意修改
        item.setStatus(null);
        item.setCreated(null);

        Integer change1 = super.updateSelective(item);

        //更新商品描述
        ItemDesc itemDesc=new ItemDesc();
        itemDesc.setItemId(item.getId());
        itemDesc.setItemDesc(desc);
        Integer change2 = this.itemDescService.updateSelective(itemDesc);

        //更新商品规格参数数据
        Integer change3 = this.itemParamItemService.updateItemParamItem(item.getId(), itemParams);

        return change1.intValue()==1&&change2.intValue()==1&&change3.intValue()==1;

    }

    public Item queryByIdse(Long itemId) {
        String key=REDIS_KEY+":"+itemId+ITEM_DETAIL_KEY;
        //添加缓存逻辑
        try {
            String jsonData = jedisClient.get(key);
            if (StringUtils.isNotEmpty(jsonData)){
                return JsonUtils.jsonToPojo(jsonData,Item.class);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }


        Item item = super.queryById(itemId);

        //数据加入缓存
        try {
            jedisClient.set(key,JsonUtils.objectToJson(item),REDIS_TIME);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return item;
    }
}
