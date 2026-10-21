package com.cakeordering.admin.files.dto;

/** Public URL of a stored object plus the object key inside the bucket. */
public record UploadResult(String url, String path, String bucket) {}
