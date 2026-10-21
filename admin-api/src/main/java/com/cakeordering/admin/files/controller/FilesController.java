package com.cakeordering.admin.files.controller;

import com.cakeordering.admin.files.dto.UploadResult;
import com.cakeordering.admin.files.service.SupabaseStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
public class FilesController {

    private final SupabaseStorageService storageService;

    /**
     * Uploads an image to Supabase Storage and returns its public URL, which the caller
     * stores on the entity (for cakes: {@code image_url}).
     */
    @PostMapping
    public ResponseEntity<UploadResult> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", required = false, defaultValue = "cakes") String folder) {
        return ResponseEntity.ok(storageService.upload(file, folder));
    }
}
