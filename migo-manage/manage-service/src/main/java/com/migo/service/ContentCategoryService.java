package com.migo.service;

import com.migo.pojo.ContentCategory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Author  知秋
 * Created by kauw on 2016/11/20.
 */
@Service
public class ContentCategoryService extends BaseService<ContentCategory>{

    public void deleteDuDu(ContentCategory contentCategory) {
        List ids=new ArrayList();
        ids.add(contentCategory.getId());

        //调用递归方法添加旗下所有子节点id
        this.addAllChildrenNode(ids,contentCategory.getId());
        super.deleteByIds(ContentCategory.class,"id",ids);
        //判断该节点是否还有兄弟节点，如果没有，修改父节点的isParent为false
        ContentCategory example=new ContentCategory();
        example.setParentId(contentCategory.getParentId());
        List<ContentCategory> list = super.queryListByWhere(example);
        if (list==null||list.isEmpty()){
            ContentCategory parent=new ContentCategory();
            parent.setId(contentCategory.getParentId());
            parent.setIsParent(false);
            super.updateSelective(parent);
        }
    }
    private void addAllChildrenNode(List ids,Long pid){
        ContentCategory example=new ContentCategory();
        example.setParentId(pid);
        List<ContentCategory> contentCategories = super.queryListByWhere(example);
        for (ContentCategory contentCategory : contentCategories) {
            ids.add(contentCategory.getId());
            //判断该节点是否为父节点，如果是，继续调用该方法查找子节点
            if (contentCategory.getIsParent()) {
                //递归调用此方法
                addAllChildrenNode(ids,contentCategory.getId());
            }

        }
    }
}
