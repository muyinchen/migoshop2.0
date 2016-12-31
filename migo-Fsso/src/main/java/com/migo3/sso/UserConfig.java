package com.migo3.sso;

import com.alibaba.druid.pool.DruidDataSource;
import com.migo.messageconverter.CallbackMappingJackson2HttpMessageConverter;
import com.migo.service.impl.JedisClientSingle;
import com.migo3.sso.pojo.UserManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import redis.clients.jedis.JedisPool;

import java.util.List;

/**
 * Author  知秋
 * Created by kauw on 2016/12/29.
 */
@Configuration
public class UserConfig extends WebMvcConfigurerAdapter {


    @Autowired
    private Environment env;


    @Bean
    public Migo2Application geMigo2Application() {
        return new Migo2ApplicationBuilder()
                .withPassword("123")
                .build();
    }

    @Bean
    public UserManager getUserManager(Migo2Application application) {
        return application.getOrThrow(UserManager.class);
    }




    @Bean
    public CallbackMappingJackson2HttpMessageConverter converter() {
        CallbackMappingJackson2HttpMessageConverter msc = new CallbackMappingJackson2HttpMessageConverter();
        msc.setCallbackName("callback");
        return msc;
    }

    @Bean("jedisPool")
    public JedisPool jedisPool() {
        return new JedisPool("192.168.42.131", 6379);

    }

    @Bean("jedisClientSingle")
    public JedisClientSingle jedisClientSingle() {
        return new JedisClientSingle();
    }



    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        super.extendMessageConverters(converters);
        converters.add(converter());
    }

    @Bean
    public DruidDataSource dataSource() {
        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setUrl(env.getProperty("spring.datasource.url"));
        dataSource.setUsername(env.getProperty("spring.datasource.username"));//用户名
        dataSource.setPassword(env.getProperty("spring.datasource.password"));//密码
        dataSource.setInitialSize(2);
        dataSource.setMaxActive(20);
        dataSource.setMinIdle(0);
        dataSource.setMaxWait(60000);
        dataSource.setValidationQuery("SELECT 1");
        dataSource.setTestOnBorrow(false);
        dataSource.setTestWhileIdle(true);
        dataSource.setPoolPreparedStatements(false);
        return dataSource;
    }

}