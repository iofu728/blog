package com.github.iofu728.blog.repository.entity;

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

}
