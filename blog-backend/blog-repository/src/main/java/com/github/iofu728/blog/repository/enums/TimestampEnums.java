package com.github.iofu728.blog.repository.enums;


import java.util.Objects;

/**
 * TimestampEnums class
 *
 * @author gunjianpan
 * @date 19-02-07
 */
public enum TimestampEnums {

    // a year timestamp
    AYEAR(31536000000L),

    // a month timestamp
    AMONTH(2592000000L),

    // a day timestamp
    ADAY(86400000L),

    // a hour timestamp
    AHOUR(3600000L),

    // a minutes timestamp
    AMIN(60000L),

    // a second timestamp
    ASEC(1000L);

    private Long timestamp;

    public Long getTimestamp() {
        return timestamp;
    }

    TimestampEnums(Long timestamp) {
        this.timestamp = timestamp;
    }

    public static TimestampEnums fromCode(Long timestamp) {
        for (TimestampEnums timestampEnums : values()) {
            if (Objects.equals(timestampEnums.timestamp, timestamp)) {
                return timestampEnums;
            }
        }
        return null;
    }
}
