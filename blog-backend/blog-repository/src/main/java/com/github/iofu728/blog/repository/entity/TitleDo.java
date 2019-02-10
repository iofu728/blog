package com.github.iofu728.blog.repository.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

/**
 * TitleDo class
 *
 * @author gunjianpan
 * @date 19-02-06
 */
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TitleDo {

    @NonNull
    private Integer id;

    private String titleName;

    private Integer localViews;

    private Integer zhihuViews;

    private Integer csdnViews;

    private Integer jianshuViews;
}
