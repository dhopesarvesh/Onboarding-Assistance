package com.onboardai.backend.controller;

import com.onboardai.backend.dto.*;
import com.onboardai.backend.model.Document;
import com.onboardai.backend.model.Folder;
import com.onboardai.backend.repository.FolderRepository;
import com.onboardai.backend.util.FileTextExtractor;
import com.onboardai.backend.util.SlugUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/folders")
@CrossOrigin(origins = "http://localhost:5173")
public class FolderController {

    private final FolderRepository folderRepository;
    private final FileTextExtractor fileTextExtractor;

    public FolderController(FolderRepository folderRepository, FileTextExtractor fileTextExtractor) {
        this.folderRepository = folderRepository;
        this.fileTextExtractor = fileTextExtractor;
    }

    @GetMapping
    public List<FolderDto> getAllFolders() {
        return folderRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @PostMapping
    public ResponseEntity<FolderDto> createFolder(@RequestBody CreateFolderRequest request) {
        Folder folder = new Folder();
        folder.setName(request.name());
        folder.setSlug(uniqueFolderSlug(SlugUtil.toSlug(request.name())));
        folder.setDocuments(new ArrayList<>());

        Folder saved = folderRepository.save(folder);
        return ResponseEntity.ok(toDto(saved));
    }

    @PostMapping("/{folderId}/documents")
    public ResponseEntity<DocumentDto> createDocument(
            @PathVariable Long folderId,
            @RequestBody CreateDocumentRequest request
    ) {
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found"));

        Document doc = new Document();
        doc.setTitle(request.title());
        doc.setContent(request.content());
        doc.setSlug(uniqueDocSlug(folder, SlugUtil.toSlug(request.title())));
        doc.setFolder(folder);

        folder.getDocuments().add(doc);
        folderRepository.save(folder);

        return ResponseEntity.ok(new DocumentDto(doc.getId(), doc.getTitle(), doc.getSlug(), doc.getContent()));
    }

    private String uniqueFolderSlug(String base) {
        String slug = base;
        int counter = 2;
        String finalSlug = slug;
        while (folderRepository.findAll().stream().anyMatch(f -> f.getSlug().equals(finalSlug))) {
            slug = base + "-" + counter++;
        }
        return slug;
    }

    private String uniqueDocSlug(Folder folder, String base) {
        String slug = base;
        int counter = 2;
        List<Document> existing = folder.getDocuments() == null ? List.of() : folder.getDocuments();
        String finalSlug = slug;
        while (existing.stream().anyMatch(d -> d.getSlug().equals(finalSlug))) {
            slug = base + "-" + counter++;
        }
        return slug;
    }

    private FolderDto toDto(Folder folder) {
        List<DocumentDto> docs = folder.getDocuments() == null
                ? List.of()
                : folder.getDocuments().stream()
                .map(d -> new DocumentDto(d.getId(), d.getTitle(), d.getSlug(), d.getContent()))
                .toList();
        return new FolderDto(folder.getId(), folder.getName(), folder.getSlug(), docs);
    }
    @PostMapping(value = "/{folderId}/documents/upload", consumes = "multipart/form-data")
    public ResponseEntity<DocumentDto> uploadDocument(
            @PathVariable Long folderId,
            @RequestParam("file") MultipartFile file
    ) {
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found"));

        String content;
        try {
            content = fileTextExtractor.extract(file);
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }

        String filename = file.getOriginalFilename();
        String title = filename != null
                ? filename.replaceAll("\\.[^.]+$", "")
                : "Untitled";

        Document doc = new Document();
        doc.setTitle(title);
        doc.setContent(content);
        doc.setSlug(uniqueDocSlug(folder, SlugUtil.toSlug(title)));
        doc.setFolder(folder);

        folder.getDocuments().add(doc);
        folderRepository.save(folder);

        return ResponseEntity.ok(new DocumentDto(doc.getId(), doc.getTitle(), doc.getSlug(), doc.getContent()));
    }
}