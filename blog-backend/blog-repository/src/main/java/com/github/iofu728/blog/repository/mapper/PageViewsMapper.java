package com.github.iofu728.blog.repository.mapper;

import com.github.iofu728.blog.repository.entity.PageViewsDO;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

/**
 * PageViewsMapper class
 *
 * @author gunjianpan
 * @date 19-02-06
 */
@Mapper
public interface PageViewsMapper {
    /**
     * title views list
     *
     * @return title views list
     */
    @Select({"SELECT `today_views` AS `todayViews`, `existed_views` AS `existedViews`," +
            "`existed_spider` AS `existedSpider` from page_views WHERE `date` in (${dates}) order by `id` desc"})
    List<PageViewsDO> selectPageViews(@Param("dates") String dates);


    /**
     * get now page views
     *
     * @param dates today YEAR-MONTH
     * @return now page views
     */
    @Select({"SELECT `today_views` AS `todayViews` from page_views WHERE `date` = #{dates, jdbcType=VARCHAR}"})
    List<Integer> getNowPageViews(@Param("dates") String dates);


    /**
     * update now page views
     *
     * @param dates today YEAR-MONTH
     * @param nowViews now views
     * @return update result
     */
    @Update("UPDATE page_views SET `today_views` = #{now_views} WHERE `date` = #{dates, jdbcType=VARCHAR}")
    Boolean updateNowPageViews(@Param("dates") String dates,
                               @Param("now_views") Integer nowViews);
}
