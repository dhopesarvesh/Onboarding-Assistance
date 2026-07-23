package com.onboardai.backend.util;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Component
public class FileTextExtractor {

    public String extract(MultipartFile file) throws IOException {
        String filename = file.getOriginalFilename();
        if (filename == null) {
            throw new IOException("File has no name");
        }
        String extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();

        return switch (extension) {
            case "pdf" -> extractPdf(file);
            case "docx" -> extractDocx(file);
            case "txt", "md", "json", "js", "jsx", "ts", "tsx", "java",
                 "py", "css", "html", "yml", "yaml", "xml", "csv" -> new String(file.getBytes());
            default -> throw new IOException("Unsupported file type: ." + extension);
        };
    }

    private String extractPdf(MultipartFile file) throws IOException {
        try (InputStream is = file.getInputStream();
             PDDocument document = Loader.loadPDF(is.readAllBytes())) {
            HeadingAwarePdfTextStripper stripper = new HeadingAwarePdfTextStripper();
            stripper.getText(document); // triggers writeString callbacks, populating heading data
            return stripper.extractWithHeadings();
        }
    }

    private String extractDocx(MultipartFile file) throws IOException {
        try (InputStream is = file.getInputStream();
             XWPFDocument document = new XWPFDocument(is);
             XWPFWordExtractor extractor = new XWPFWordExtractor(document)) {
            return extractor.getText();
        }
    }
}