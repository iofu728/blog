package com.github.iofu728.blog.collector.bo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.io.Serializable;
import java.sql.Timestamp;

import com.github.iofu728.blog.collector.consts.ErrorCodeConsts;

/**
 * BaseResponse class
 *
 * @author gunjianpan
 * @date 19-02-02
 */
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaseResponse<T> implements Serializable {

    @NonNull
    private  boolean success;

    private T result;

    private String errorMsg;

    private Integer errorCode;

    private Timestamp timestamp = new Timestamp(System.currentTimeMillis());


    private BaseResponse(Builder<T> builder) {
        this.success = builder.success;
        this.errorCode = builder.errorCode;
        this.errorMsg = builder.errorMsg;
        this.result = builder.result;
    }

    /**
     * new Success BaseResponse
     * @return BaseResponse
     */
    public static Builder newSuccResponse() {
        return new Builder().success(true).errorCode(ErrorCodeConsts.STATUS_SUCCESS);
    }

    /**
     * new Error BaseResponse
     * @return BaseResponse
     */
    public static Builder newFailResponse() {
        return new Builder().success(false);
    }

    public boolean isSuccess() {
        return success;
    }

    public Integer getErrorCode() {
        return errorCode;
    }

    public String getErrorMsg() {
        return errorMsg;
    }

    public T getResult() {
        return result;
    }

    public Timestamp getTimeStamp(){
        return timestamp;
    }

    public static final class Builder<T> {

        private boolean success = false;

        private Integer errorCode;

        private String errorMsg;

        private T result;

        private Builder() {
        }

        public BaseResponse build() {
            return new BaseResponse(this);
        }

        public Builder success(boolean success) {
            this.success = success;
            this.errorCode = 100000;
            return this;
        }

        public Builder errorCode(Integer errorCode) {
            this.errorCode = errorCode;
            return this;
        }

        public Builder errorMsg(String errorMsg) {
            this.errorMsg = errorMsg;
            return this;
        }

        public Builder result(T result) {
            this.result = result;
            return this;
        }
    }
}