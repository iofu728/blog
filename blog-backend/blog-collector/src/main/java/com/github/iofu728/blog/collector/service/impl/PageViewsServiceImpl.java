package com.github.iofu728.blog.collector.service.impl;

import com.github.iofu728.blog.collector.bo.PageViewsBo;
import com.github.iofu728.blog.collector.service.PageViewsService;
import org.springframework.stereotype.Service;

/**
 * PageViewsService class
 *
 * @author gunjianpan
 * @date 19-02-02
 */
@Service
public class PageViewsServiceImpl implements PageViewsService {

    @Override
    public PageViewsBo getPageViewsLists() {
        return new PageViewsBo();
    }
}
