package com.onboardai.backend.dto;

import java.util.List;

public record FolderDto(Long id, String name, String slug, List<DocumentDto> documents) {
}