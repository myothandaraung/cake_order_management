package com.cakeordering.admin.cakes.dto;

import com.cakeordering.admin.cakes.model.Cake;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record CakeDto(
    String id,
    String name,
    String description,
    String imageUrl,
    BigDecimal price,
    Integer rating,
    String categoryId,
    Boolean isPopular,
    Boolean isNewArrival,
    String tags,
    Boolean isArchived,
    LocalDateTime createdAt
) {
    public static CakeDto from(Cake cake) {
        return new CakeDto(
            cake.getId() != null ? cake.getId().toString() : null,
            cake.getName(),
            cake.getDescription(),
            cake.getImageUrl(),
            cake.getPrice(),
            cake.getRating(),
            cake.getCategoryId(),
            cake.getIsPopular(),
            cake.getIsNewArrival(),
            toCsv(cake.getTags()),
            cake.getIsArchived(),
            cake.getCreatedAt()
        );
    }

    public static String toCsv(List<String> tags) {
        return tags == null || tags.isEmpty() ? null : String.join(", ", tags);
    }
}
