package com.github.iofu728.blog.collector.filter;

import com.github.iofu728.blog.collector.consts.ScoreConst;
import com.github.iofu728.blog.collector.service.PermissionFilterService;
import com.github.iofu728.blog.repository.entity.WebConfigurationDO;
import com.github.iofu728.blog.repository.enums.TimestampEnums;
import com.github.iofu728.blog.repository.util.NumericRelated;
import com.github.iofu728.blog.repository.util.RSAProvider;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.GeneralSecurityException;

/**
 * CorsFilter class
 *
 * @author gunjianpan
 * @date 19-02-06
 */
@Configuration
public class CorsFilter implements Filter {

    @Autowired
    private WebConfigurationDO webConfigurationDO;

    @Autowired
    private RSAProvider rsaProvider;

    @Autowired
    private PermissionFilterService permissionFilterService;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @SneakyThrows
    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        String domain = request.getHeader("Origin");

        int score = permissionFilterService.haveHeaderPermission(request);

        if (score <= ScoreConst.BOUNDARY_SCORE) {
            response.setHeader("Access-Control-Allow-Origin", domain);
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
            response.setHeader("Access-Control-Max-Age", "3600");
            response.setHeader("Access-Control-Allow-Headers", " X-Requested-With, Content-Type,X-Requested-With, Content-Type, X-File-Name,token,Access-Control-Allow-Origin,Access-Control-Allow-Methods,Access-Control-Max-Age,authorization");

            if (score == ScoreConst.NORMAL_SCORE) {
                Cookie[] cookies = request.getCookies();
                boolean have_cookie = false;
                if (cookies != null) {
                    for (Cookie cookie : cookies) {
                        if (cookie.getName().equals(webConfigurationDO.getCookieKey())) {
                            have_cookie = !isCookieInvalid(cookie.getValue(), request);
                        }
                    }
                }
                if (!have_cookie ) {
                    response.addCookie(cookieGenerator(request));
                }
            }
        }

        request.setAttribute("sliceScore", score);
        chain.doFilter(req, res);
    }

    @Override
    public void destroy() {
    }

    private Cookie cookieGenerator(HttpServletRequest request) throws IOException, GeneralSecurityException {
        String ip = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");
        String message = new StringBuilder()
                .append(ip).append("\t")
                .append(userAgent).append("\t")
                .append(System.currentTimeMillis())
                .toString();
        System.out.println(ip);
        Cookie c = new Cookie(webConfigurationDO.getCookieKey(), rsaProvider.encrypt(message));
        c.setMaxAge(86400);
        c.setHttpOnly(true);
        c.setSecure(true);

        return c;
    }

    private boolean isCookieInvalid(String cookie, HttpServletRequest request) throws IOException, GeneralSecurityException {
        String message = rsaProvider.decrypt(cookie);
        String[] mList = message.split("\t");

        return mList.length != 3
                || !request.getRemoteAddr().equals(mList[0])
                || !request.getHeader("User-Agent").equals(mList[1])
                || !NumericRelated.isNumeric(mList[2])
                || System.currentTimeMillis() - Long.parseLong(mList[2]) > TimestampEnums.ADAY.getTimestamp();
    }
}
