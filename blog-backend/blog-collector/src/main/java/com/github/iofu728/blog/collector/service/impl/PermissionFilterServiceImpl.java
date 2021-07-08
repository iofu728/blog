package com.github.iofu728.blog.collector.service.impl;

import com.github.iofu728.blog.collector.consts.ScoreConst;
import com.github.iofu728.blog.collector.service.PermissionFilterService;
import com.github.iofu728.blog.repository.entity.WebConfigurationDO;
import com.github.iofu728.blog.repository.enums.TimestampEnums;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

/**
 * PermissionFilterServiceImpl class
 *
 * @author gunjianpan
 * @date 19-02-07
 */
@Service
public class PermissionFilterServiceImpl implements PermissionFilterService {

    @Autowired
    private WebConfigurationDO webConfigurationDO;

    private String REGEX = "ython|Hakai|Gemini|Shinka|LMAO|Ronin|WinHttp|WebZIP|Postman|FetchURL|node-superagent|java|FeedDemon|Jullo|JikeSpider|Indy Library|Alexa Toolbar|AskTbFXTV|AhrefsBot|CrawlDaddy|Java|Feedly|Apache-HttpAsyncClient|UniversalFeedParser|ApacheBench|Microsoft URL Control|Swiftbot|ZmEu|oBot|jaunty|Python-urllib|lightDeckReports Bot|YYSpider|DigExt|HttpClient|MJ12bot|heritrix|EasouSpider|Ezooms|BOT/0.1|FlightDeckReports|Bot|pider|bot|Yahoo!  Slurp|^$";

    @Override
    public Boolean haveTimePermission (Long timestamp){
        Long systemTime = System.currentTimeMillis();

        return timestamp > systemTime - TimestampEnums.ASEC.getTimestamp() * 10 &&
                timestamp < systemTime + TimestampEnums.ASEC.getTimestamp() * 5;
    }

    @Override
    public int haveHeaderPermission (HttpServletRequest request) {
        String method = request.getMethod();
        String domain = request.getHeader("Origin");
        List<String> allowedDomain = Arrays.asList(webConfigurationDO.getHosts().split(",").clone());
        List<String> allowedHost = Arrays.asList(webConfigurationDO.getApiHost().split(",").clone());

        String userAgent = request.getHeader("User-Agent");
        String host = request.getHeader("Host");
        Pattern p = Pattern.compile(REGEX);

        if (!(allowedDomain.contains(domain)
                && userAgent != null
                && userAgent.length() >= 10
                && !p.matcher(userAgent).find()
                && allowedHost.contains(host))) {
            return ScoreConst.HEADER_ERROR_SCORE;
        }

        if (!method.equals("GET")) {
            if (!method.equals("OPTIONS")) {
                return ScoreConst.METHOD_ERROR_SCORE;
            }

            return ScoreConst.NO_UPDATE_SCORE;
        }

        return ScoreConst.WAITED_CHECK_SCORE;
    }
}
