package com.migo.pojo;

import java.util.List;

/**
 * Author  知秋
 * Created by kauw on 2016/9/23.
 */
public class EasyUIDataGridResult {
    private long total;
    private List<?> rows;

    public EasyUIDataGridResult() {
    }

    public EasyUIDataGridResult(List<?> rows, long total) {
        this.rows = rows;
        this.total = total;
    }

    public List<?> getRows() {
        return rows;
    }

    public void setRows(List<?> rows) {
        this.rows = rows;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }
}
