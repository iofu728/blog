package com.github.iofu728.blog.repository.entity;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * WebConfigurationDO class
 *
 * @author gunjianpan
 * @date 21-07-07
 */
@Data
@ConfigurationProperties(prefix = "web")
public class WebConfigurationDO {

    private String hosts;

    private String apiHost;

    private String rsaPublicKeyPath;

    private String rsaPrivateKeyPath;

    private String cookieKey;

}