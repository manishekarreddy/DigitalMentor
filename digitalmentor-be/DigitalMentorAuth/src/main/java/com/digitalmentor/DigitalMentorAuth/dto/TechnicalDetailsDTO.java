package com.digitalmentor.DigitalMentorAuth.dto;

public class TechnicalDetailsDTO {
    private Integer requirementId;
    private Integer score;

    public TechnicalDetailsDTO(Integer requirementId, Integer score) {
        this.requirementId = requirementId;
        this.score = score;
    }

    // Getters and Setters
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

