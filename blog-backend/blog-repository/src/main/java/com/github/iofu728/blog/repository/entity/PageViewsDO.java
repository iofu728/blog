package com.github.iofu728.blog.repository.entity;

import lombok.Data;
import lombok.NonNull;

/**
 * PageViewsDO class
 *
 * @author gunjianpan
 * @date 19-02-06
 */
@Data
public class PageViewsDO {
    @NonNull
    private Integer todayViews;

    @NonNull
    private Integer existedViews;

    @NonNull
    private Integer existedSpider;
}
