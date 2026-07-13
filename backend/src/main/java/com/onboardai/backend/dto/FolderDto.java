package com.onboardai.backend.dto;

import java.util.List;

public record FolderDto(Long id, String name, List<DocumentDto> documents) {
}