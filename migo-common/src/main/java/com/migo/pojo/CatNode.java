package com.migo.pojo;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * Author  知秋
 * Created by kauw on 2016/10/9.
 */
public class CatNode {
    @JsonProperty("u")
    private String url;
    @JsonProperty("n")
    private String name;
    @JsonProperty("i")
    private List items;

    public List getItems() {
        return items;
    }

    public void setItems(List items) {
        this.items = items;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
