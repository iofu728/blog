package com.github.iofu728.blog.repository.repository;

import java.util.Map;

/**
 * TitleViewsRepository class
 *
 * @author gunjianpan
 * @date 19-02-06
 */
public interface TitleViewsRepository {
    /**
     * select title views for all
     *
     * @return title views map
     */
    Map<String, Integer> selectTitleViewsForAll();

    /**
     * get now title views
     *
     * @return get now title views
     */
    Integer getNowTitleViews(String titleName);

    /**
     * update now title views
     *
     * @return update result
     */
    Boolean updateNowTitleViews(String titleName, Integer nowViews);
}
