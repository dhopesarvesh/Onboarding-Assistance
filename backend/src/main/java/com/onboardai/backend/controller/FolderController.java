package com.onboardai.backend.controller;

import com.onboardai.backend.dto.DocumentDto;
import com.onboardai.backend.dto.FolderDto;
import com.onboardai.backend.model.Folder;
import com.onboardai.backend.repository.FolderRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/folders")
@CrossOrigin(origins = "http://localhost:5173")
public class FolderController {

    private final FolderRepository folderRepository;

    public FolderController(FolderRepository folderRepository) {
        this.folderRepository = folderRepository;
    }

    @GetMapping
    public List<FolderDto> getAllFolders() {
        return folderRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    private FolderDto toDto(Folder folder) {
        List<DocumentDto> docs = folder.getDocuments() == null
                ? List.of()
                : folder.getDocuments().stream()
                .map(d -> new DocumentDto(d.getId(), d.getTitle(), d.getContent()))
                .toList();
        return new FolderDto(folder.getId(), folder.getName(), docs);
    }
}