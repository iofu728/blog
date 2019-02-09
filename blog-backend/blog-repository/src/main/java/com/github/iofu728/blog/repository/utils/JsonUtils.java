package com.github.iofu728.blog.repository.utils;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.CollectionUtils;

import java.io.IOException;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * JsonUtils class
 *
 * @author gunjianpan
 * @date 19-02-06
 */
@Slf4j
public class JsonUtils {

    /**
     * 把JSON字符串转换为指定的对象
     *
     * @param jsonString
     * @param valueType
     * @return
     */
    public static <T> T transferToObj(String jsonString, Class<T> valueType) {
        if (StringUtils.isBlank(jsonString)) {
            throw new IllegalArgumentException("[Assertion failed] - the object argument must be blank");
        }

        T value = null;
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            mapper.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);
            mapper.configure(SerializationFeature.INDENT_OUTPUT, false);
            mapper.configure(JsonParser.Feature.ALLOW_UNQUOTED_CONTROL_CHARS, true);
            value = mapper.readValue(jsonString, valueType);
        } catch (IOException e) {
            log.warn("Error happens when transfer to object, jsonString=[{}]", jsonString, e);
        }

        return value;
    }

    /**
     * 把指定的对象生成JSON字符串
     *
     * @param value
     * @return
     */
    public static <T> String transfer2JsonString(T value) {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(SerializationFeature.WRITE_ENUMS_USING_TO_STRING, true);
        StringWriter sw = new StringWriter();
        JsonGenerator gen;
        try {
            gen = new JsonFactory().createGenerator(sw);
            mapper.writeValue(gen, value);
            gen.close();
        } catch (IOException e) {
            log.error("Error happens when transfer to Json, value=[{}]", value, e);

        }

        return sw.toString();
    }

    /**
     * 把指定的对象生成JSON字符串
     *
     * @param value
     * @return
     */
    public static <T> String transfer2JsonStringWithoutNull(T value) {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(SerializationFeature.WRITE_ENUMS_USING_TO_STRING, true);
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        StringWriter sw = new StringWriter();
        JsonGenerator gen;
        try {
            gen = new JsonFactory().createGenerator(sw);
            mapper.writeValue(gen, value);
            gen.close();
        } catch (IOException e) {
            log.error("Error happens when transfer to Json without null, value=[{}]", value, e);
        }
        return sw.toString();
    }

    public static Map<String, String> transferObject2MapWithoutNull(Object obj) {
        String json = transfer2JsonStringWithoutNull(obj);
        return readJson2Map(json);
    }

    /**
     * @param map
     * @return
     */
    @SuppressWarnings("rawtypes")
    public static String writeMap2JsonString(Map map) {
        if (CollectionUtils.isEmpty(map)) {
            return "";
        }
        String jsonString = "";
        try {
            ObjectMapper mapper = new ObjectMapper();
            jsonString = mapper.writeValueAsString(map);
        } catch (JsonProcessingException e) {
            log.warn("Error happens when writing map to Json string, value=[{}]", map, e);
        }

        return jsonString;
    }

    /**
     * @param jsonString
     * @return
     */
    @SuppressWarnings("unchecked")
    public static Map<String, String> readJson2Map(String jsonString) {
        if (!jsonFormatCheck(jsonString)) {
            return null;
        }
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(jsonString, Map.class);
        } catch (IOException e) {
            log.error("Error happens when reading json to map, jsonString=[{}]", jsonString, e);
        }

        return null;
    }

    /**
     * 对于复杂集合类的转换 例如：
     * <p>
     * <li>1.List<JavaBean>: 调用方法是：readJson2Map(jsonString,List.class,JavaBean.class);</li>
     * <li>2.Map<JavaBean1,JavaBean2>:调用方法是:readJson2Map(jsonString,Map.class,JavaBean1.class,JavaBean2.class);</li>
     * </p>
     *
     * @param jsonString
     * @return
     */
    public static <T> T readJson2Collection(String jsonString, Class<?> parametrized, Class<?>... parameterClasses) {
        if (StringUtils.isBlank(jsonString)) {
            return null;
        }

        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            mapper.enable(DeserializationFeature.READ_UNKNOWN_ENUM_VALUES_AS_NULL);
            JavaType javaType = mapper.getTypeFactory().constructParametricType(parametrized, parameterClasses);
            return mapper.<T>readValue(jsonString, javaType);
        } catch (IOException e) {
            log.error("Error happens when reading json to collection, jsonString=[{}]", jsonString, e);
        }

        return null;
    }

    @SuppressWarnings("unchecked")
    public static <T> List<T> readJson2List(String jsonString, Class<T> clsT) {
        if (StringUtils.isBlank(jsonString)) {
            return null;
        }
        List<T> list = null;
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.configure(JsonParser.Feature.ALLOW_UNQUOTED_CONTROL_CHARS, true);
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            JavaType javaType = objectMapper.getTypeFactory().constructParametricType(ArrayList.class, clsT);
            list = (List<T>) objectMapper.readValue(jsonString, javaType);
        } catch (Exception e) {
            log.error("Error happens when reading json to list, jsonString=[{}], class=[{}]", jsonString, clsT, e);
        }
        return list;

    }

    public static boolean jsonFormatCheck(String str) {

        return StringUtils.startsWith(str, "{");
    }
}


