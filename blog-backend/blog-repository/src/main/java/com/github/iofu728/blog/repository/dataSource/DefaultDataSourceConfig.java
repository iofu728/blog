package com.github.iofu728.blog.repository.dataSource;

import com.github.iofu728.blog.repository.entity.DataSourceDo;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;

/**
 * DefaultDataSourceConfig class
 *
 * @author gunjianpan
 * @date 19-02-02
 */
@Configuration
@Profile(value = "default")
@EnableConfigurationProperties(DataSourceDo.class)
public class DefaultDataSourceConfig {

    private DataSourceDo dataSourceDo;

    @Autowired
    public DefaultDataSourceConfig(DataSourceDo dataSourceDo){
        this.dataSourceDo = dataSourceDo;
    }

    @Primary
    @Bean(destroyMethod = "close", name = "dataSource")
    public DataSource dataSource() throws Exception {
        String jdbcUrl = new StringBuilder("jdbc:mysql://")
                .append(dataSourceDo.getHostName())
                .append(":")
                .append(dataSourceDo.getPort())
                .append("/")
                .append(dataSourceDo.getDatabaseName()).toString();

        HikariConfig config = new HikariConfig();
        config.setDriverClassName("com.mysql.cj.jdbc.Driver");
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(dataSourceDo.getMysqlUserName());
        config.setPassword(dataSourceDo.getMysqlPassage());
        config.addDataSourceProperty("cachePrepStmts", "true");
        config.addDataSourceProperty("prepStmtCacheSize", "250");
        config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
        config.setIdleTimeout(25000);
        config.setMinimumIdle(5);
        config.setMaximumPoolSize(30);
        config.setPoolName("db_pool_blog");

        HikariDataSource ds = new HikariDataSource(config);

        return ds;
    }
}
