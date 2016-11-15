package com.migo.mapper;

import com.migo.pojo.ItemParamexd;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * Author  知秋
 * Created by kauw on 2016/10/6.
 */
public interface ItemparamexdMapper {

    @Select(" select\n" +
            "         a.id id ,a.item_cat_id itemCatId,a.created created,a.updated updated,a.param_data paramData,b.`name` itemCatName\n" +
            "        FROM\n" +
            "        tb_item_param AS a LEFT JOIN  tb_item_cat  as b\n" +
            "        ON\n" +
            "        a.item_cat_id=b.id ")
    List<ItemParamexd> selectList();
}
