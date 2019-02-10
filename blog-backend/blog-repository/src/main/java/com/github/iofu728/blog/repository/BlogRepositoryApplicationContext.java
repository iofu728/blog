package com.github.iofu728.blog.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.util.Properties;

/**
 * BlogResposityApplicationContext class
 *
 * @author gunjianpan
 * @date 19-02-02
 */
@Configuration
@ComponentScan(value = "com.github.iofu728.blog.repository")
@MapperScan(value = "com.github.iofu728.blog.repository.mapper")
public class BlogRepositoryApplicationContext {
    @Autowired
    @Qualifier("dataSource")
    private DataSource dataSource;

    @Bean
    public SqlSessionFactoryBean sqlSessionFactoryBean() throws Exception {
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(dataSource);
        Properties properties = new Properties();
        properties.setProperty("dialect", "mysql");
        sqlSessionFactoryBean.setConfigurationProperties(properties);
        return sqlSessionFactoryBean;
    }
}
