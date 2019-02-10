package com.github.iofu728.blog.collector.bo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import javax.validation.constraints.NotNull;
import java.util.Map;

/**
 * PageViewsBo class
 *
 * @author gunjianpan
 * @date 19-02-02
 */
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageViewsBo {
    @NonNull
    private Integer totalPageViews;

    @NonNull
    private Integer totalSpider;

    @NotNull
    private Integer yesterdayPageViews;

    @NonNull
    private Integer yesterdayPageSpider;

    @NonNull
    private Map<String, Integer> titleViewsMap;

}
