package com.lashsystem.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "salon_settings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SalonSettings {

    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "whatsapp")
    private String whatsapp;
}