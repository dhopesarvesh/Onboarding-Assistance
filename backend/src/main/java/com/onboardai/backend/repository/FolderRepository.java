package com.onboardai.backend.repository;

import com.onboardai.backend.model.Folder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FolderRepository extends JpaRepository<Folder, Long> {
}