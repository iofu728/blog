package com.github.iofu728.blog.repository.entity;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * DataSourceDO class
 *
 * @author gunjianpan
 * @date 19-02-06
 */
@Data
@ConfigurationProperties(prefix = "db.mysql")
public class DataSourceDO {

    private String hostName;

    private String port;

    private String databaseName;

    private String mysqlUserName;

    private String mysqlPassage;

}
