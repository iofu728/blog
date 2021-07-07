package com.github.iofu728.blog.repository.util;

public class NumericRelated {

    public static boolean isNumeric(String s) {
        for (int i = 0; i < s.length(); i++) {
            if (!Character.isDigit(s.charAt(i))) {
                return false;
            }
        }

        return true;
    }
}
