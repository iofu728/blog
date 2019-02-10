package com.github.iofu728.blog.repository.repository.impl;

import com.github.iofu728.blog.repository.entity.PageViewsDO;
import com.github.iofu728.blog.repository.enums.TimestampEnums;
import com.github.iofu728.blog.repository.mapper.PageViewsMapper;
import com.github.iofu728.blog.repository.repository.PageViewsRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * PageViewsRepositoryImpl class
 *
 * @author gunjianpan
 * @date 19-02-06
 */
@Repository
public class PageViewsRepositoryImpl implements PageViewsRepository {

    @Autowired
    private PageViewsMapper pageViewsMapper;

    @Override
    public List<PageViewsDO> selectPageViews(Long timestamp){
        List<String> dates = new ArrayList<>();
        dates.add(timestamp2StrV2(timestamp));
        dates.add(timestamp2StrV2(timestamp - TimestampEnums.ADAY.getTimestamp()));
        return pageViewsMapper.selectPageViews(StringUtils.strip(dates.toString(), "[]"));
    }

    @Override
    public Integer getNowPageViews(Long timestamp){
        List<Integer> nowPageViewsList = pageViewsMapper.getNowPageViews(timestamp2str(timestamp));
        return nowPageViewsList.get(0);
    }

    @Override
    public Boolean updateNowPageViews(Long timestamp, Integer nowViews){

        return pageViewsMapper.updateNowPageViews(timestamp2str(timestamp), nowViews);
    }

    private String timestamp2str(Long timestamp) {
        return new Timestamp(timestamp).toString().substring(0, 10);
    }

    private String timestamp2StrV2(Long timestamp) {
        return new StringBuilder()
                .append('"')
                .append(new Timestamp(timestamp).toString().substring(0, 10))
                .append('"')
                .toString();
    }

}
