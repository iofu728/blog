package com.github.iofu728.blog.collector.service.impl;

import com.github.iofu728.blog.collector.service.PermissionFilterService;
import com.github.iofu728.blog.repository.enums.TimestampEnums;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
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

    @Override
    public Boolean haveTimePermission (Long timestamp){
        Long systemTime = System.currentTimeMillis();

        return timestamp > systemTime - TimestampEnums.ASEC.getTimestamp() * 10 &&
                timestamp < systemTime + TimestampEnums.ASEC.getTimestamp() * 5;
    }

    @Override
    public Boolean haveHeaderPermission (HttpServletRequest request){

        // Origin
        String domain = request.getHeader("Origin");
        List<String> allowedDomain = new ArrayList<>();
        allowedDomain.add("http://192.168.31.147:8080");
        allowedDomain.add("https://wyydsb.xin");
        allowedDomain.add("https://wyydsb.com");
        allowedDomain.add("https://wyydsb.cn");

        // User Agent
        String userAgent = request.getHeader("User-Agent");
        String re = "ython|Hakai|Gemini|Shinka|LMAO|Ronin|WinHttp|WebZIP|Postman|FetchURL|node-superagent|java|FeedDemon|Jullo|JikeSpider|Indy Library|Alexa Toolbar|AskTbFXTV|AhrefsBot|CrawlDaddy|Java|Feedly|Apache-HttpAsyncClient|UniversalFeedParser|ApacheBench|Microsoft URL Control|Swiftbot|ZmEu|oBot|jaunty|Python-urllib|lightDeckReports Bot|YYSpider|DigExt|HttpClient|MJ12bot|heritrix|EasouSpider|Ezooms|BOT/0.1|FlightDeckReports|Bot|pider|bot|Yahoo!  Slurp|^$";
        Pattern p=Pattern.compile(re);

        return allowedDomain.contains(domain) && userAgent.length() != 0 && !p.matcher(userAgent).find();
    }
}
