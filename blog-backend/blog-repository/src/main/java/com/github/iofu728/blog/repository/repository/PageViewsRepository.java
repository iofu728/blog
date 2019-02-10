package com.github.iofu728.blog.repository.repository;

import com.github.iofu728.blog.repository.entity.PageViewsDO;

import java.util.List;

/**
 * PageViewsRepository class
 *
 * @author gunjianpan
 * @date 19-02-06
 */
public interface PageViewsRepository {

    /**
     * select page views for lately two day
     *
     * @return title views map
     */
    List<PageViewsDO> selectPageViews(Long timestamp);


    /**
     * get now page views
     *
     * @return get now page views
     */
    Integer getNowPageViews(Long timestamp);

    /**
     * update now page views
     *
     * @return update result
     */
    Boolean updateNowPageViews(Long timestamp, Integer nowViews);
}
