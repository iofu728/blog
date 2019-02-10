package com.github.iofu728.blog.repository.repository.impl;

import com.github.iofu728.blog.repository.entity.TitleDo;
import com.github.iofu728.blog.repository.mapper.TitleViewsMapper;
import com.github.iofu728.blog.repository.repository.TitleViewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * TitleViewsRepositoryImpl class
 *
 * @author gunjianpan
 * @date 19-02-06
 */
@Repository
public class TitleViewsRepositoryImpl implements TitleViewsRepository {

    @Autowired
    private TitleViewsMapper titleViewsMapper;

    @Override
    public Map<String, Integer> selectTitleViewsForAll(){
        List<TitleDo> titleViewsList = titleViewsMapper.selectTitleViewsForAll();
        return titleViewsList.stream()
                .collect(
                        Collectors.toMap(TitleDo::getTitleName,
                                titleDo -> titleDo.getLocalViews() + titleDo.getZhihuViews()
                                        + titleDo.getCsdnViews() + titleDo.getCsdnViews()));
    }

    @Override
    public Integer getNowTitleViews(String titleName){
        List<Integer> nowTitleViewsList = titleViewsMapper.getNowTitleViews(titleName);
        if (nowTitleViewsList.size() == 0) {
            return -1;
        }
        return nowTitleViewsList.get(0);
    }

    @Override
    public Boolean updateNowTitleViews(String titleName, Integer nowViews){
        return titleViewsMapper.updateNowTitleViews(titleName, nowViews);
    }
}
