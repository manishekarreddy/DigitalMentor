package com.digitalmentor.DigitalMentorAuth.entity.TestRequirements;

import com.digitalmentor.DigitalMentorAuth.entity.ProgramRequirement;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@Table(name = "score_range")
public class ScoreRange {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double minScore; // Minimum score for this range
    private double maxScore; // Maximum score for this range
    private double weight;   // Associated weight for this range

    @ManyToOne
    @JoinColumn(name = "program_requirement_id", nullable = false)
    @JsonIgnore
    private ProgramRequirement programRequirement;

    public ScoreRange(double minScore, double maxScore, double weight) {
        this.minScore = minScore;
        this.maxScore = maxScore;
        this.weight = weight;
    }

    public ScoreRange() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getMinScore() {
        return minScore;
    }

    public void setMinScore(double minScore) {
        this.minScore = minScore;
    }

    public double getMaxScore() {
        return maxScore;
    }

    public void setMaxScore(double maxScore) {
        this.maxScore = maxScore;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public ProgramRequirement getProgramRequirement() {
        return programRequirement;
    }

    public void setProgramRequirement(ProgramRequirement programRequirement) {
        this.programRequirement = programRequirement;
    }
}
