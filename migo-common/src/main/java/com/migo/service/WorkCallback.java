package com.migo.service;

/**
 * Author  知秋
 * Created by kauw on 2016/12/8.
 */
public interface WorkCallback<T,E> {
    T doWorkCallback(E e);
}
