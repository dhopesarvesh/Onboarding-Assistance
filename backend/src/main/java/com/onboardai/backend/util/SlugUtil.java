package com.onboardai.backend.util;

public class SlugUtil {

    public static String toSlug(String input) {
        return input
                .toLowerCase()
                .trim()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");
    }
}