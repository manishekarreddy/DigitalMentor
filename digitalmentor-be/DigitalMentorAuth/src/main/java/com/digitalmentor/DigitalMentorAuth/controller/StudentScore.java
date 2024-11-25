package com.digitalmentor.DigitalMentorAuth.controller;


public class StudentScore {

    private Long requirementId;
    private double score;

    public StudentScore(Long requirementId, double score) {
        this.requirementId = requirementId;
        this.score = score;
    }

    public Long getRequirementId() {
        return requirementId;
    }

    public void setRequirementId(Long requirementId) {
        this.requirementId = requirementId;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }
}
