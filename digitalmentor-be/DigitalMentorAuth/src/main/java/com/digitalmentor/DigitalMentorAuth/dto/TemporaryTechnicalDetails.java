package com.digitalmentor.DigitalMentorAuth.dto;

import jakarta.persistence.*;

@Entity
@Table(name = "temporary_technical_details")
public class TemporaryTechnicalDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "guest_id", nullable = false)
    private String guestId;

    @Column(name = "requirement_id", nullable = false)
    private Integer requirementId;

    @Column(name = "score", nullable = false)
    private Integer score;

    public TemporaryTechnicalDetails() {
    }

    public TemporaryTechnicalDetails(String guestId, Integer requirementId, Integer score) {
        this.guestId = guestId;
        this.requirementId = requirementId;
        this.score = score;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGuestId() {
        return guestId;
    }

    public void setGuestId(String guestId) {
        this.guestId = guestId;
    }

    public Integer getRequirementId() {
        return requirementId;
    }

    public void setRequirementId(Integer requirementId) {
        this.requirementId = requirementId;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }
}

