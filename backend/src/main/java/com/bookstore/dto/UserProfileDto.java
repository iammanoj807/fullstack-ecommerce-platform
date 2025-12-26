package com.bookstore.dto;

import com.bookstore.entity.Role;
import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class UserProfileDto {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private Set<Role> roles;
}
