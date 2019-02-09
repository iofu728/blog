package com.github.iofu728.blog.collector.filter;

import com.github.iofu728.blog.collector.consts.ErrorCodeConsts;
import com.github.iofu728.blog.collector.service.PermissionFilterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;

/**
 * CorsFilter class
 *
 * @author gunjianpan
 * @date 19-02-06
 */
@Configuration
public class CorsFilter implements Filter {

    @Autowired
    private PermissionFilterService permissionFilterService;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        String domain = request.getHeader("Origin");

        if (permissionFilterService.haveHeaderPermission(request)) {
            response.setHeader("Access-Control-Allow-Origin", domain);
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
            response.setHeader("Access-Control-Max-Age", "3600");
            response.setHeader("Access-Control-Allow-Headers", " X-Requested-With, Content-Type,X-Requested-With, Content-Type, X-File-Name,token,Access-Control-Allow-Origin,Access-Control-Allow-Methods,Access-Control-Max-Age,authorization");
        } else {
            request.setAttribute("gunjianpan", "Error");
            response.sendError(ErrorCodeConsts.STATUS_FORBIDDEN);
        }
        chain.doFilter(req, res);
    }

    @Override
    public void destroy() {
    }
}
