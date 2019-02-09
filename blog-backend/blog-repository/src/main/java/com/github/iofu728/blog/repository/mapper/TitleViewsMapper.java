package com.github.iofu728.blog.repository.mapper;

import com.github.iofu728.blog.repository.entity.TitleDo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

/**
 * TitleViewsMapper class
 *
 * @author gunjianpan
 * @date 19-02-04
 */
@Mapper
public interface TitleViewsMapper {

    /**
     * title views list
     *
     * @return title views list
     */
    @Select({"SELECT `id`, `title_name` AS `titleName`, `local_views` AS `localViews`, `zhihu_views` AS `zhihuViews`," +
            "`csdn_views` AS `csdnViews`, `csdn_views` AS `csdnViews` from title_views WHERE `is_deleted` = 0"})
    List<TitleDo> selectTitleViewsForAll();

    /**
     * get title views
     *
     * @param titleName title name
     * @return now title views
     */
    @Select({"SELECT `local_views` AS `localViews` from title_views WHERE `title_name` = #{now_title, jdbcType=VARCHAR}"})
    List<Integer> getNowTitleViews(@Param("now_title") String titleName);

    /**
     * update now title views
     *
     * @param titleName title name
     * @param nowViews now views
     * @return update result
     */
    @Update("UPDATE title_views SET `local_views` = #{now_views} WHERE `title_name` = #{now_title, jdbcType=VARCHAR}")
    Boolean updateNowTitleViews(@Param("now_title") String titleName,
                               @Param("now_views") Integer nowViews);
}
