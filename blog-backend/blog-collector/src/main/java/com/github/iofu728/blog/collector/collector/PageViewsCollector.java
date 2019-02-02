package com.github.iofu728.blog.collector.collector;

import com.github.iofu728.blog.collector.bo.BaseResponse;
import com.github.iofu728.blog.collector.consts.ErrorCodeConsts;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

/**
 * PageViewsCollector class
 *
 * @author gunjianpan
 * @date 19-02-02
 */
@RestController
@RequestMapping("/api/pv")
@Slf4j
public class PageViewsCollector {

    @GetMapping("list")
    public BaseResponse getPageViewLists(HttpServletRequest request) {
        String operator = new StringBuilder().toString();
        if (!operator.isEmpty()) {
            return BaseResponse.newFailResponse()
                    .errorCode(ErrorCodeConsts.STATUS_UNAUTHORIZED)
                    .build();
        }
        return BaseResponse.newSuccResponse().result(1).build();
    }
}
