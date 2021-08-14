package com.github.iofu728.blog.collector.consts;

/**
 * ErrorCodeConsts class
 *
 * @author gunjianpan
 * @date 19-02-02
 */
public class ErrorCodeConst {
    /** success. */
    public static final int STATUS_SUCCESS = 10200;
    /** error. */
    public static final int STATUS_ERROR = 10400;
    /** unauthorized. */
    public static final int STATUS_UNAUTHORIZED = 10401;
    /** no access. */
    public static final int STATUS_FORBIDDEN = 10403;
    /** system error. */
    public static final int STATUS_SERVERERROR = 10500;
    /** system custom error. */
    public static final int STATUS_SYSTEM = 10100;

    public static final int BUSINESS_SYSTEM = 11200;
}
