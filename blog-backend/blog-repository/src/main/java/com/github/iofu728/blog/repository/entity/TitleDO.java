package com.github.iofu728.blog.repository.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

/**
 * TitleDO class
 *
 * @author gunjianpan
 * @date 19-02-06
 */
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TitleDO {

    @NonNull
    private Integer id;

    private String titleName;

    private Integer localViews;

    private Integer zhihuViews;

    private Integer csdnViews;

    private Integer jianshuViews;
}
