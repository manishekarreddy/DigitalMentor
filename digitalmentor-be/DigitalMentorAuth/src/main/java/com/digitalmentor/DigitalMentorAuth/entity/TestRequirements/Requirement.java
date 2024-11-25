package com.digitalmentor.DigitalMentorAuth.entity.TestRequirements;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "requirements") // Explicitly naming the table
@Getter
@Setter
public class Requirement {

    @Id
    @GeneratedValue()
    private Long id;

    @Column(nullable = false)
    private String name;  // e.g., IELTS, GRE, TOEFL

    @Column(nullable = false)
    private String type; // Type of the assessment (e.g., "language", "standard")

    public Requirement(Long id, String type, String name) {
        this.id = id;
        this.type = type;
        this.name = name;
    }

    public Requirement() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}