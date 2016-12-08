package com.migo.service;

import com.migo.pojo.CatNode;
import com.migo.pojo.ItemCat;
import com.migo.pojo.ItemCatResult;
import com.migo.utils.JsonUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.List;

/**
 * Author  知秋
 * Created by kauw on 2016/11/8.
 */
@Service
public class ItemCatService extends BaseService<ItemCat> {
    @Autowired
    private JedisClient jedisClient;
    private static final String REDIS_KEY = "MIGO_MANAGE_ITEM_CAT_LIST"; // 规则：项目名_模块名_业务名
    private static final Integer REDIS_TIME = 60 * 60 * 24 * 30 * 3;

    /* @Autowired
    private ItemCatMapper itemCatMapper;


    public List<ItemCat> getItemCatList(Long parentId) {
        ItemCat example = new ItemCat();
        example.setParentId(parentId);
        return this.itemCatMapper.select(example);
    }*/

    /**
     * 查询，并生成jd页面类似的树状结构
     * @return
     */
    public ItemCatResult getItemCatList(){

        try {
            // 从缓存中命中，如果命中返回，没有命中继续查询
            String jsonData = jedisClient.get(REDIS_KEY);
            if (StringUtils.isNotEmpty(jsonData)) {
                return JsonUtils.jsonToPojo(jsonData,ItemCatResult.class);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }


        ItemCatResult itemCatResult=new ItemCatResult();

        //调用递归方法查询商品分类列表
        List catList=getItemCatList(0L);
        //返回结果
        itemCatResult.setCatNodes(catList);
        return itemCatResult;
    }

    private List getItemCatList(long parentId) {
        //根据parentId查询列表


        ItemCat example=new ItemCat();
        example.setParentId(parentId);
        List<ItemCat> catList = super.queryListByWhere(example);
        List resultList=new ArrayList();
        int count=0;
        for (ItemCat itemCat : catList) {
            //如果是父节点
            if (itemCat.getIsParent()) {
                CatNode node=new CatNode();
                node.setUrl("/products/"+itemCat.getId()+".html");
                //如果当前节点为第一级节点
                if (itemCat.getParentId()==0) {
                    node.setName("<a href='/products/"+itemCat.getId()+".html'>"+itemCat.getName()+"</a>");
                }else {
                    node.setName(itemCat.getName());
                }
                node.setItems(getItemCatList(itemCat.getId()));
                //将node添加到列表
                resultList.add(node);
                count++;
                //第一层只取14条记录
                if (parentId==0&&count>=14){
                    break;
                }
            }else {
                //如果是最底层叶子节点
                String item = "/products/"+itemCat.getId()+".html|" + itemCat.getName();
                resultList.add(item);
            }
        }
        try {
            //将结果集写入到Redis中
            this.jedisClient.set(REDIS_KEY,JsonUtils.objectToJson(resultList),REDIS_TIME);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return resultList;
    }
}
