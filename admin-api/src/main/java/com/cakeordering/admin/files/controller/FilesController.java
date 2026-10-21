package com.cakeordering.admin.files.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/files")
public class FilesController {

    @PostMapping
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        // Stub implementation - in production would upload to Supabase Storage
        String fileUrl = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000";
        return ResponseEntity.ok(Map.of("url", fileUrl));
    }
}
