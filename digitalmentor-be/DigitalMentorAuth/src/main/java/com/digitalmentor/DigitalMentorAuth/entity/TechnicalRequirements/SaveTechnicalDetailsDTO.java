package com.digitalmentor.DigitalMentorAuth.entity.TechnicalRequirements;

import java.util.Map;

public class SaveTechnicalDetailsDTO {

    private Map<Integer, Integer> scores;

    public SaveTechnicalDetailsDTO() {
    }

    public SaveTechnicalDetailsDTO(Map<Integer, Integer> scores) {
        this.scores = scores;
    }

    public Map<Integer, Integer> getScores() {
        return scores;
    }

    public void setScores(Map<Integer, Integer> scores) {
        this.scores = scores;
    }
}
