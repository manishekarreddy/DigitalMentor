package com.digitalmentor.DigitalMentorAuth.entity;

import com.digitalmentor.DigitalMentorAuth.entity.TestRequirements.Requirement;
import com.digitalmentor.DigitalMentorAuth.enums.Condition;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
public class ProgramRequirement {

    private @Id
    @GeneratedValue Long id;

    @ManyToOne
    private Requirement requirement; // Reference to global requirement

    private double score; // Program-specific score for this requirement

    @ManyToOne
    @JsonIgnore // Prevent recursion during serialization
    private Program program; // Link back to the program

    @Enumerated(EnumType.STRING) // Store the condition as a string (OR/AND)
    private Condition condition; // Condition for this specific requirement (AND/OR)

    public ProgramRequirement() {}

    public ProgramRequirement(Long id, Program program, Requirement requirement, double score, Condition condition) {
        this.id = id;
        this.program = program;
        this.requirement = requirement;
        this.score = score;
        this.condition = condition;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Program getProgram() {
        return program;
    }

    public void setProgram(Program program) {
        this.program = program;
    }

    public Requirement getRequirement() {
        return requirement;
    }

    public void setRequirement(Requirement requirement) {
        this.requirement = requirement;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public Condition getCondition() {
        return condition;
    }

    public void setCondition(Condition condition) {
        this.condition = condition;
    }

}

