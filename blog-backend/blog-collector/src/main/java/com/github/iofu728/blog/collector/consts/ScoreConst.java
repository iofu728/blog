package com.github.iofu728.blog.collector.consts;

/**
 * ScoreConsts class
 *
 * @author gunjianpan
 * @date 21-07-07
 */
public class ScoreConst {
    /** success score. */
    public static final int NORMAL_SCORE = 0;
    /** renew boundary score. */
    public static final int RENEW_BOUNDARY_SCORE = 25;
    /** waited check score. */
    public static final int WAITED_CHECK_SCORE = 26;
    /** cookie timestamp expired score. */
    public static final int TIMESTAMP_EXPIRED_SCORE = 27;
    /** header change score. */
    public static final int HEADER_CHANGE_SCORE = 28;
    /** update boundary score. */
    public static final int UPDATE_BOUNDARY_SCORE = 50;
    /** OPTIONS or others no update score. */
    public static final int NO_UPDATE_SCORE = 51;
    /** score boundary. */
    public static final int BOUNDARY_SCORE = 100;
    /** header error score. */
    public static final int HEADER_ERROR_SCORE = 101;
    /** post etc. method score. */
    public static final int METHOD_ERROR_SCORE = 102;
    /** decryption error score. */
    public static final int DECRYPTION_ERROR_SCORE = 103;
}
