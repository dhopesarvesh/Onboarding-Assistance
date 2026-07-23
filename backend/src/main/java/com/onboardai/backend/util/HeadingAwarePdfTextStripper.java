package com.onboardai.backend.util;

import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.pdfbox.text.TextPosition;

import java.io.IOException;
import java.util.*;

public class HeadingAwarePdfTextStripper extends PDFTextStripper {

    private final List<LineInfo> lines = new ArrayList<>();

    public HeadingAwarePdfTextStripper() throws IOException {
        super();
    }

    private static class LineInfo {
        String text;
        float avgFontSize;
        boolean bold;
    }

    @Override
    protected void writeString(String text, List<TextPosition> textPositions) throws IOException {
        if (text != null && !text.trim().isEmpty()) {
            float totalSize = 0;
            int count = 0;
            boolean bold = false;

            for (TextPosition tp : textPositions) {
                totalSize += tp.getFontSizeInPt();
                count++;
                String fontName = tp.getFont() != null && tp.getFont().getName() != null
                        ? tp.getFont().getName().toLowerCase()
                        : "";
                if (fontName.contains("bold")) {
                    bold = true;
                }
            }

            LineInfo info = new LineInfo();
            info.text = text.trim();
            info.avgFontSize = count > 0 ? totalSize / count : 0;
            info.bold = bold;
            lines.add(info);
        }
        super.writeString(text, textPositions);
    }

    public String extractWithHeadings() {
        if (lines.isEmpty()) return "";

        // Body text size = the most common font size across the whole document
        Map<Integer, Integer> freq = new HashMap<>();
        for (LineInfo l : lines) {
            freq.merge(Math.round(l.avgFontSize), 1, Integer::sum);
        }
        int bodySize = freq.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(12);

        StringBuilder sb = new StringBuilder();
        boolean prevWasHeading = true; // avoids a leading space on the very first line

        for (LineInfo l : lines) {
            int size = Math.round(l.avgFontSize);
            String prefix = null;

            if (size >= bodySize + 6) {
                prefix = "# ";
            } else if (size >= bodySize + 3) {
                prefix = "## ";
            } else if (size >= bodySize + 1 && l.bold) {
                prefix = "### ";
            }

            if (prefix != null) {
                sb.append("\n\n").append(prefix).append(l.text).append("\n\n");
                prevWasHeading = true;
            } else {
                sb.append(prevWasHeading ? "" : " ").append(l.text);
                prevWasHeading = false;
            }
        }

        return sb.toString().replaceAll("\n{3,}", "\n\n").trim();
    }
}