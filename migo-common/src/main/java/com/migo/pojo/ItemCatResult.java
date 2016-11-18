package com.migo.pojo;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

/**
 * Author  知秋
 * Created by kauw on 2016/10/9.
 */
public class ItemCatResult {
    @JsonProperty("data")
    private List<CatNode> catNodes=new ArrayList<>();

    public List<CatNode> getCatNodes() {
        return catNodes;
    }

    public void setCatNodes(List<CatNode> catNodes) {
        this.catNodes = catNodes;
    }
}
