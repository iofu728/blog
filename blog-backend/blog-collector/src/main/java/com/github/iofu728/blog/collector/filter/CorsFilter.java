package com.github.iofu728.blog.collector.filter;

import com.github.iofu728.blog.collector.consts.ScoreConst;
import com.github.iofu728.blog.collector.service.PermissionFilterService;
import com.github.iofu728.blog.repository.entity.WebConfigurationDO;
import com.github.iofu728.blog.repository.enums.TimestampEnums;
import com.github.iofu728.blog.repository.util.UtilsHelper;
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
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) {
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

            if (score <= ScoreConst.WAITED_CHECK_SCORE) {
                Cookie[] cookies = request.getCookies();
                if (cookies != null) {
                    for (Cookie cookie : cookies) {
                        if (cookie.getName().equals(webConfigurationDO.getCookieKey())) {
                            try {
                                score = checkCookieInvalid(cookie.getValue(), request);
                            } catch (Exception e) {
                                score = ScoreConst.DECRYPTION_ERROR_SCORE;
                            }
                        }
                    }
                }
                if (score >= ScoreConst.RENEW_BOUNDARY_SCORE) {
                    response.setHeader("Set-Cookie", cookieGenerator(request));
                }
            }
        }

        String currentTimeStamp = UtilsHelper.getCurrentTimeStamp();
        System.out.println(currentTimeStamp + " " + getRemoteAddr(request) + " " + score);
        request.setAttribute("sliceScore", score);
        chain.doFilter(req, res);
    }

    @Override
    public void destroy() {
    }

    private String cookieGenerator(HttpServletRequest request) throws IOException, GeneralSecurityException {
        String ip = getRemoteAddr(request);
        String userAgent = request.getHeader("User-Agent");
        String message = new StringBuilder()
                .append(ip).append("\t")
                .append(userAgent).append("\t")
                .append(System.currentTimeMillis())
                .toString();

        return new StringBuilder(webConfigurationDO.getCookieKey())
                .append("=").append(rsaProvider.encrypt(message))
                .append("; Secure; HttpOnly; SameSite=None;").toString();
    }

    private int checkCookieInvalid(String cookie, HttpServletRequest request) throws IOException, GeneralSecurityException {
        String message = rsaProvider.decrypt(cookie);
        String[] mList = message.split("\t");
        if (mList.length != 3
                || !UtilsHelper.isNumeric(mList[2])) {
            return ScoreConst.DECRYPTION_ERROR_SCORE;
        }

        if (!getRemoteAddr(request).equals(mList[0])
                && !request.getHeader("User-Agent").equals(mList[1])) {
            return ScoreConst.NO_UPDATE_SCORE;
        }

        if (!getRemoteAddr(request).equals(mList[0])
                || !request.getHeader("User-Agent").equals(mList[1])) {
            return ScoreConst.HEADER_CHANGE_SCORE;
        }

        if (System.currentTimeMillis() - Long.parseLong(mList[2]) > TimestampEnums.ADAY.getTimestamp()) {
            return ScoreConst.TIMESTAMP_EXPIRED_SCORE;
        }

        return ScoreConst.NORMAL_SCORE;
    }

    private String getRemoteAddr(HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        if (ip.equals("127.0.0.1")) {
            ip = request.getHeader("X-Forwarded-For");
        }

        return ip;
    }
}
