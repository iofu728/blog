package com.github.iofu728.blog.collector.service.impl;

import com.github.iofu728.blog.collector.bo.PageViewsBo;
import com.github.iofu728.blog.collector.service.PageViewsService;
import com.github.iofu728.blog.repository.entity.PageViewsDO;
import com.github.iofu728.blog.repository.repository.PageViewsRepository;
import com.github.iofu728.blog.repository.repository.TitleViewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * PageViewsService class
 *
 * @author gunjianpan
 * @date 19-02-02
 */
@Service
public class PageViewsServiceImpl implements PageViewsService {

    @Autowired
    private TitleViewsRepository titleViewsRepository;

    @Autowired
    private PageViewsRepository pageViewsRepository;

    @Override
    public PageViewsBo getPageViewsLists(Long timestamp) {
        List<PageViewsDO> pageViewsDOList = pageViewsRepository.selectPageViews(timestamp);

        return PageViewsBo.builder()
                .titleViewsMap(titleViewsRepository.selectTitleViewsForAll())
                .totalPageViews(pageViewsDOList.get(0).getTodayViews() + pageViewsDOList.get(0).getExistedViews())
                .totalSpider(pageViewsDOList.get(0).getExistedSpider())
                .yesterdayPageViews(pageViewsDOList.get(1).getTodayViews())
                .yesterdayPageSpider(pageViewsDOList.get(0).getExistedSpider() - pageViewsDOList.get(1).getExistedSpider())
                .build();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean updatePageViews(Long timestamp, String titleName){

        Integer nowPageViews = pageViewsRepository.getNowPageViews(timestamp);
        Boolean updatePageViewsResult = pageViewsRepository.updateNowPageViews(timestamp, nowPageViews + 1);
        if (titleName.equals("null")) {
            return true;
        }
        Integer nowTitleViews = titleViewsRepository.getNowTitleViews(titleName);
        if (nowTitleViews == -1) {
            return false;
        }
        Boolean updateTitleViewsResult = titleViewsRepository.updateNowTitleViews(titleName, nowTitleViews + 1);
        return updatePageViewsResult && updateTitleViewsResult;
    }
}
