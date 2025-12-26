/**
 * Address Entity - Embeddable shipping address.
 * 
 * Stores address details (line1, city, postcode, country).
 * Embedded within Order entity for shipping information.
 */
package com.bookstore.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Address {
    private String line1;
    private String line2;
    private String city;
    private String postcode;
    private String country;
}
