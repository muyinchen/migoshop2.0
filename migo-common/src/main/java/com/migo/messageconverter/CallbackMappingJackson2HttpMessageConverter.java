package com.migo.messageconverter;

import com.fasterxml.jackson.core.JsonEncoding;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

public class CallbackMappingJackson2HttpMessageConverter extends MappingJackson2HttpMessageConverter {

    // 做jsonp的支持的标识，在请求参数中加该参数
    private String callbackName;

    @Override
    protected void writeInternal(Object object, HttpOutputMessage outputMessage) throws IOException,
            HttpMessageNotWritableException {
        // 从threadLocal中获取当前的Request对象
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder
                .currentRequestAttributes()).getRequest();
        String callbackParam = request.getParameter(callbackName);
        if (StringUtils.isEmpty(callbackParam)) {
            // 没有找到callback参数，直接返回json数据
            super.writeInternal(object, outputMessage);
        } else {
            JsonEncoding encoding = getJsonEncoding(outputMessage.getHeaders().getContentType());
            try {
                String result = callbackParam + "(" + super.getObjectMapper().writeValueAsString(object)
                        + ");";
                IOUtils.write(result, outputMessage.getBody(), encoding.getJavaName());
            } catch (JsonProcessingException ex) {
                throw new HttpMessageNotWritableException("Could not write JSON: " + ex.getMessage(), ex);
            }
        }

    }

    public String getCallbackName() {
        return callbackName;
    }

    public void setCallbackName(String callbackName) {
        this.callbackName = callbackName;
    }

}
