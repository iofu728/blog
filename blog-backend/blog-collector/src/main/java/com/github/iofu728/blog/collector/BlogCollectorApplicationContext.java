package com.github.iofu728.blog.collector;

import com.github.iofu728.blog.repository.BlogRepositoryApplicationContext;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main class
 *
 * @author gunjianpan
 * @date 19-02-01
 */
@SpringBootApplication
@Import(value = {
        BlogRepositoryApplicationContext.class
})
@EnableCaching
@EnableScheduling
@Configuration
@ComponentScan(value = "com.github.iofu728.blog")
public class BlogCollectorApplicationContext {

    public static void main(String[] args) {
        SpringApplication.run(BlogCollectorApplicationContext.class, args);
    }
}
