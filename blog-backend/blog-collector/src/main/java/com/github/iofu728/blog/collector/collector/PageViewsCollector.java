package com.github.iofu728.blog.collector.collector;

import com.github.iofu728.blog.collector.bo.BaseResponse;
import com.github.iofu728.blog.collector.bo.PageViewsBo;
import com.github.iofu728.blog.collector.consts.ErrorCodeConsts;
import com.github.iofu728.blog.collector.service.PageViewsService;
import com.github.iofu728.blog.collector.service.PermissionFilterService;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;

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
    @Autowired
    private PageViewsService pageViewsService;

    @Autowired
    private PermissionFilterService permissionFilterService;

    @GetMapping("list")
    public BaseResponse getPageViewLists(HttpServletRequest request,
                                         @NonNull Long timestamp) {
        Object headerPermission = request.getAttribute("gunjianpan");
        if (headerPermission != null && headerPermission.equals("Error")) {
            return BaseResponse.newFailResponse()
                    .errorMsg("Have no Permission!!!")
                    .errorCode(ErrorCodeConsts.STATUS_FORBIDDEN)
                    .build();
        }
        Boolean timePermission = permissionFilterService.haveTimePermission(timestamp);
        if (!timePermission) {
            return BaseResponse.newSuccResponse()
                    .result(
                            PageViewsBo.builder()
                            .titleViewsMap(new HashMap<>())
                            .totalPageViews(8273)
                            .totalSpider(1029831)
                            .yesterdayPageSpider(1091)
                            .yesterdayPageViews(21)
                            .build()
                    ).build();
        }
        return BaseResponse.newSuccResponse()
                .result(pageViewsService.getPageViewsLists(timestamp))
                .build();
    }

    @GetMapping("update")
    public BaseResponse updatePageView(HttpServletRequest request,
                                       @NonNull Long timestamp,
                                       @NonNull String titleName) {
        Object headerPermission = request.getAttribute("gunjianpan");
        if (headerPermission != null && headerPermission.equals("Error")) {
            return BaseResponse.newFailResponse()
                    .errorMsg("Have empty Permission!!!")
                    .errorCode(ErrorCodeConsts.STATUS_FORBIDDEN)
                    .build();
        }
        Boolean timePermission = permissionFilterService.haveTimePermission(timestamp);
        if (!timePermission) {
            return BaseResponse.newFailResponse()
                    .errorCode(ErrorCodeConsts.STATUS_FORBIDDEN)
                    .errorMsg("Time stamp error")
                    .build();
        }
        return BaseResponse.newSuccResponse()
                .result(pageViewsService.updatePageViews(timestamp, titleName))
                .build();
    }
}
