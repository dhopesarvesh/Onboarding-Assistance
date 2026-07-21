package com.onboardai.backend.controller;

import com.onboardai.backend.dto.*;
import com.onboardai.backend.model.Document;
import com.onboardai.backend.model.Folder;
import com.onboardai.backend.model.Project;
import com.onboardai.backend.repository.ProjectRepository;
import com.onboardai.backend.util.SlugUtil;
import org.jspecify.annotations.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectController {

    private final ProjectRepository projectRepository;

    public ProjectController(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @GetMapping
    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll().stream().map(this::toDto).toList();
    }

    @PostMapping
    public ResponseEntity<ProjectDto> createProject(@RequestBody CreateProjectRequest request) {
        Project project = new Project();
        project.setName(request.name());
        project.setSlug(uniqueSlug(SlugUtil.toSlug(request.name())));
        project.setFolders(new ArrayList<>());

        Project saved = projectRepository.save(project);
        return ResponseEntity.ok(toDto(saved));
    }

    private String uniqueSlug(String base) {
        String slug = base;
        int counter = 2;
        while (projectRepository.findBySlug(slug).isPresent()) {
            slug = base + "-" + counter++;
        }
        return slug;
    }

    private ProjectDto toDto(Project project) {
        List<FolderDto> folders = project.getFolders() == null
                ? List.of()
                : project.getFolders().stream().map(this::folderToDto).toList();
        return new ProjectDto(project.getId(), project.getName(), project.getSlug(), folders);
    }

    private FolderDto folderToDto(Folder folder) {
        return getFolderDto(folder);
    }

    @NonNull
    static FolderDto getFolderDto(Folder folder) {
        List<DocumentDto> docs = folder.getDocuments() == null
                ? List.of()
                : folder.getDocuments().stream()
                .map(d -> new DocumentDto(d.getId(), d.getTitle(), d.getSlug(), d.getContent()))
                .toList();
        return new FolderDto(folder.getId(), folder.getName(), folder.getSlug(), docs);
    }
}