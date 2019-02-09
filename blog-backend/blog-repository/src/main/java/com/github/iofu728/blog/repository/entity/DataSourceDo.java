package com.github.iofu728.blog.repository.entity;

import com.github.iofu728.blog.repository.utils.JsonUtils;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * DataSourceDo class
 *
 * @author gunjianpan
 * @date 19-02-06
 */
@Data
@ConfigurationProperties(prefix = "db.mysql")
public class DataSourceDo {

    private String databaseName;

    private String mysqlUserName;

    private String mysqlPassage;

    @Override
    public String toString() {
        return JsonUtils.transfer2JsonString(this);
    }
}
