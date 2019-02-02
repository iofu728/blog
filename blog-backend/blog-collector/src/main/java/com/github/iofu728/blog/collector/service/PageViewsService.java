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
     * @return PageViewBO
     */
    PageViewsBo getPageViewsLists();
}
