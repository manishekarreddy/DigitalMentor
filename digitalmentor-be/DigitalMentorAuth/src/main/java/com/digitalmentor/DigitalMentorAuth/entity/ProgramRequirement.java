package com.digitalmentor.DigitalMentorAuth.entity;

import com.digitalmentor.DigitalMentorAuth.entity.TestRequirements.Requirement;
import com.digitalmentor.DigitalMentorAuth.entity.TestRequirements.ScoreRange;
import com.digitalmentor.DigitalMentorAuth.enums.Condition;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
public class ProgramRequirement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Requirement requirement; // Reference to global requirement

    @Enumerated(EnumType.STRING)
    private Condition condition; // Condition for this specific requirement (AND/OR)

    @ManyToOne
    @JsonIgnore // Prevents infinite recursion when serializing
    private Program program;; // Link back to the program

    @OneToMany(mappedBy = "programRequirement", cascade = CascadeType.PERSIST, orphanRemoval = true)
    private List<ScoreRange> scoreRanges = new ArrayList<>();

    public ProgramRequirement() {}

    public ProgramRequirement(Long id, Program program, Requirement requirement, Condition condition) {
        this.id = id;
        this.program = program;
        this.requirement = requirement;
        this.condition = condition;
    }

    // Getters and setters


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Requirement getRequirement() {
        return requirement;
    }

    public void setRequirement(Requirement requirement) {
        this.requirement = requirement;
    }

    public Condition getCondition() {
        return condition;
    }

    public void setCondition(Condition condition) {
        this.condition = condition;
    }

    public Program getProgram() {
        return program;
    }

    public void setProgram(Program program) {
        this.program = program;
    }

    public List<ScoreRange> getScoreRanges() {
        return scoreRanges;
    }

    public void setScoreRanges(List<ScoreRange> scoreRanges) {
        this.scoreRanges = scoreRanges;
    }
}

