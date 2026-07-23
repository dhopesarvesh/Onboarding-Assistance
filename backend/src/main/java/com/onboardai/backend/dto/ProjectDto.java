package com.onboardai.backend.dto;

import java.util.List;

public record ProjectDto(Long id, String name, String slug, List<FolderDto> folders) {
}