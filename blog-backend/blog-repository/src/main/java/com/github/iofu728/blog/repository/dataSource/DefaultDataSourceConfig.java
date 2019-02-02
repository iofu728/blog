package com.github.iofu728.blog.repository.dataSource;

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
        HikariDataSource masterDataSource = new HikariDataSource();
        masterDataSource.setDriverClassName("com.mysql.jdbc.Driver");
        masterDataSource.setJdbcUrl("blog");
        masterDataSource.setUsername("gunjianpan");
        masterDataSource.setPassword("82537213,a");
        masterDataSource.setIdleTimeout(25000);
        masterDataSource.setMinimumIdle(5);
        masterDataSource.setMaximumPoolSize(30);
        masterDataSource.setPoolName("db_pool_wyydsb");
        return masterDataSource;
    }
}
