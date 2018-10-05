package com.wyydsb.service.blog.api.controller;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor

public class KPI {

    private String remote_addr;
    private String time_local;
    private String request;
    private String status;
    private String body_bytes_sent;
    private String http_referer;
    private String http_user_agent;
    private Integer valid;

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("valid:" + this.valid);
        sb.append("\nremote_addr:" + this.remote_addr);
        sb.append("\ntime_local:" + this.time_local);
        sb.append("\nrequest:" + this.request);
        sb.append("\nstatus:" + this.status);
        sb.append("\nbody_bytes_sent:" + this.body_bytes_sent);
        sb.append("\nhttp_referer:" + this.http_referer);
        sb.append("\nhttp_user_agent:" + this.http_user_agent);
        return sb.toString();
    }

    /**
     * line split
     */
    private static KPI parser(String line) {
        KPI kpi = new KPI();
        String[] arr = line.split(" ", 12);

        if (arr.length > 11) {
            kpi.setRemote_addr(arr[0]);
            kpi.setTime_local(arr[3].substring(1));
            kpi.setRequest(arr[5].substring(1));
            kpi.setBody_bytes_sent(arr[9]);
            kpi.setStatus(arr[8]);
            kpi.setHttp_referer(arr[10]);
            kpi.setHttp_user_agent(arr[11]);

            if (kpi.getStatus().matches("^\\d{3}")) {
                if (Integer.parseInt(kpi.getStatus()) == 301) {
                    kpi.setValid(2);
                } else if (Integer.parseInt(kpi.getStatus()) != 200) {
                    kpi.setValid(0);
                } else {
                    kpi.setValid(1);
                }
            } else {
                kpi.setValid(0);
            }
        } else {
            kpi.setValid(0);
        }
        return kpi;
    }

    /**
     * filter spider
     */
    public static KPI filterPVs(String line) {
        KPI kpi = parser(line);
        List<String> keywordList = new ArrayList<>();
        keywordList.add("spider");
        keywordList.add("taishan");

        if (kpi.getHttp_user_agent() != null && keywordList.stream().filter(key -> !kpi.getHttp_user_agent().contains(key)).collect(Collectors.toList()).size() != keywordList.size()){
            kpi.setValid(0);
        }
        SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd", Locale.US);
        System.out.println(df.format(kpi.getTime_local()));
        if (kpi.getTime_local())
        return kpi;
    }
    public static void main(String args[]) {
        String line = "103.192.224.177 - - [19/Aug/2018:17:54:00 +0800] \"GET / HTTP/1.1\" 301 612 \"-\" \"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3526.0 Safari/537.36\"";
        System.out.println(filterPVs(line).toString());
    }
}