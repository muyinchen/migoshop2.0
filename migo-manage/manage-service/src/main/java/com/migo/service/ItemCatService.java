package com.migo.service;

import com.migo.pojo.CatNode;
import com.migo.pojo.ItemCat;
import com.migo.pojo.ItemCatResult;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Author  知秋
 * Created by kauw on 2016/11/8.
 */
@Service
public class ItemCatService extends BaseService<ItemCat> {
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
        return resultList;
    }
}
