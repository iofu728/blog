package com.github.iofu728.blog.collector.service;

import javax.servlet.http.HttpServletRequest;

/**
 * PermissionFilterService class
 *
 * @author gunjianpan
 * @date 19-02-07
 */
public interface PermissionFilterService {
    /**
     * judge have time permission
     *
     * @param timestamp time
     * @return true or false
     */
    Boolean haveTimePermission (Long timestamp);

    /**
     * judge have header permission
     *
     * @param request request
     * @return ScoreConst
     */
    int haveHeaderPermission (HttpServletRequest request);
}
