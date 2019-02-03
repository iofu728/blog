package com.github.iofu728.blog.repository.dataSource;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
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
public class DefaultDataSourceConfig {
    @Primary
    @Bean(destroyMethod = "close", name = "dataSource")
    public DataSource dataSource() throws Exception {
        HikariConfig config = new HikariConfig();
        config.setDriverClassName("com.mysql.cj.jdbc.Driver");
        config.setJdbcUrl("jdbc:mysql://localhost:3306");
        config.setUsername("blog");
        config.setPassword("82537213,a");
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
