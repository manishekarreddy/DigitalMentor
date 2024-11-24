package com.digitalmentor.DigitalMentorAuth.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "programs") // Explicitly naming the table
public class Program {


    @Id
    @GeneratedValue()
    private Long id;

    private String name;
    private String description;

    @OneToMany(mappedBy = "program", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProgramRequirement> program_requirement = new ArrayList<>();

    public Program() {
    }

    public Program(Long id, List<ProgramRequirement> program_requirement, String description, String name) {
        this.id = id;
        this.program_requirement = program_requirement;
        this.description = description;
        this.name = name;
    }

    public Program(String name, String description, List<ProgramRequirement> program_requirement) {
        this.name = name;
        this.description = description;
        this.program_requirement = program_requirement;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<ProgramRequirement > getProgramRequirements() {
        return program_requirement;
    }

    public void setProgram_requirement(List<ProgramRequirement> program_requirement) {
        this.program_requirement = program_requirement;
    }
}

