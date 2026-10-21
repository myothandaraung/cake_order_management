package com.cakeordering.admin.customers.dto;

import com.cakeordering.admin.customers.model.Favorite;

public record FavoriteDto(
    String id,
    String userId,
    String cakeId
) {
    public static FavoriteDto from(Favorite favorite) {
        return new FavoriteDto(favorite.getId() != null ? favorite.getId().toString() : null, favorite.getUserId(), favorite.getCakeId());
    }
}
