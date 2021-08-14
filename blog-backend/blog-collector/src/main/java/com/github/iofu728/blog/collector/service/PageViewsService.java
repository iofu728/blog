package com.github.iofu728.blog.collector.service;

import com.github.iofu728.blog.collector.bo.PageViewsBo;

/**
 * PageViewsService class
 *
 * @author gunjianpan
 * @date 19-02-02
 */
public interface PageViewsService {

    /**
     * get PageViewsLists
     *
     * @param timestamp time
     * @return PageViewBO
     */
    PageViewsBo getPageViewsLists(Long timestamp);

    /**
     * update pageViews
     *
     * @param timestamp time
     * @param titleName title name
     * @return true or false
     */
    Boolean updatePageViews(Long timestamp, String titleName, boolean isUpdated);
}
