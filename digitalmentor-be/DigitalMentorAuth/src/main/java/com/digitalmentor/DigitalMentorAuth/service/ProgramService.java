package com.digitalmentor.DigitalMentorAuth.service;


import com.digitalmentor.DigitalMentorAuth.entity.Program;
import com.digitalmentor.DigitalMentorAuth.entity.ProgramRequirement;
import com.digitalmentor.DigitalMentorAuth.entity.TestRequirements.Requirement;
import com.digitalmentor.DigitalMentorAuth.entity.TestRequirements.ScoreRange;
import com.digitalmentor.DigitalMentorAuth.repository.ProgramRepository;
import com.digitalmentor.DigitalMentorAuth.repository.RequirementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProgramService {

    @Autowired
    private ProgramRepository programRepository;

    @Autowired
    private RequirementRepository requirementRepository;


    public Program createProgram(Program program) {
        if (program.getProgramRequirements() == null || program.getProgramRequirements().isEmpty()) {
            throw new IllegalArgumentException("Program must have at least one requirement.");
        }

        if (program.getName().length() > 255) {
            program.setName(program.getName().substring(0, 255));  // Truncate name to 255 characters
        }
        if (program.getDescription().length() > 255) {
            program.setDescription(program.getDescription().substring(0, 255));  // Truncate description to 255 characters
        }

        for (ProgramRequirement pr : program.getProgramRequirements()) {

            for (ScoreRange scoreRange : pr.getScoreRanges()) {
                // Check if the scoreRange ID is 0, which indicates it's a new record
                if (scoreRange.getId() == 0) {
                    scoreRange.setId(null); // Set ID to null for new record (auto-generation)
                }
            }

            // Validate the Requirement
            Requirement requirement = requirementRepository.findById(pr.getRequirement().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Requirement not found with ID: " + pr.getRequirement().getId()));

            pr.setRequirement(requirement);
            pr.setProgram(program);

            // Associate each ScoreRange with the ProgramRequirement
            if (pr.getScoreRanges() != null) {
                for (ScoreRange sr : pr.getScoreRanges()) {
                    sr.setProgramRequirement(pr);
                }
            }
        }

        // Save the Program with all nested objects
        return programRepository.save(program);
    }

    public ResponseEntity<Program> programDetails(Long id){
        Optional<Program> program = programRepository.findById(id);

       return program.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    public Map<String, List<Program>> getAllPrograms() {
                    Map<String, List<Program>> resp = new HashMap<>();
                    List<Program> programs = programRepository.findAll();
                    resp.put("programs", programs);
                    return resp;
    }

    public Program updateProgram(Long id, Program programDetails) {
        Program existingProgram = programRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Program not found"));

// Update the program's general information (name, description, etc.)
        existingProgram.setName(programDetails.getName());
        existingProgram.setDescription(programDetails.getDescription());

// Existing requirements from the database
        List<ProgramRequirement> existingRequirements = existingProgram.getProgramRequirements();

// New requirements from the update request
        List<ProgramRequirement> updatedRequirements = programDetails.getProgramRequirements();

// Map existing requirements by their IDs for quick lookup
        Map<Long, ProgramRequirement> existingRequirementsMap = existingRequirements.stream()
                .collect(Collectors.toMap(req -> req.getRequirement().getId(), req -> req));

// Clear the existing program requirements to replace with updated ones
        existingRequirements.clear();

// Process the updated requirements
        for (ProgramRequirement updatedRequirement : updatedRequirements) {
            Requirement requirement = requirementRepository.findById(updatedRequirement.getRequirement().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Requirement not found"));

            // Check if this requirement already exists in the program
            ProgramRequirement existingRequirement = existingRequirementsMap.get(requirement.getId());

            if (existingRequirement != null) {
                // Update the existing requirement's fields
                existingRequirement.setCondition(updatedRequirement.getCondition());

                // Handle score ranges (if provided)
                List<ScoreRange> updatedScoreRanges = updatedRequirement.getScoreRanges();
                List<ScoreRange> existingScoreRanges = existingRequirement.getScoreRanges();

                // Remove orphaned score ranges if they are not referenced anymore
                existingScoreRanges.removeIf(scoreRange -> !updatedScoreRanges.contains(scoreRange));

                // Add new or updated score ranges
                for (ScoreRange updatedScoreRange : updatedScoreRanges) {
                    if (updatedScoreRange.getId() == 0) {
                        // New ScoreRange - set ProgramRequirement
                        updatedScoreRange.setProgramRequirement(existingRequirement);
                        existingScoreRanges.add(updatedScoreRange);
                    } else {
                        // Existing ScoreRange - update its fields if necessary
                        // Ensure the ProgramRequirement is set properly for existing score ranges
                        updatedScoreRange.setProgramRequirement(existingRequirement);
                        existingScoreRanges.add(updatedScoreRange); // This will update the existing score range
                    }
                }

                existingRequirements.add(existingRequirement);
            } else {
                // Add new requirement with its score ranges
                updatedRequirement.setRequirement(requirement);
                updatedRequirement.setProgram(existingProgram);

                // Add new score ranges and ensure their `programRequirement` is set
                for (ScoreRange scoreRange : updatedRequirement.getScoreRanges()) {
                    scoreRange.setProgramRequirement(updatedRequirement);
                }

                existingRequirements.add(updatedRequirement);
            }
        }

// Save the updated program (cascading will handle requirements and score ranges)
        return programRepository.save(existingProgram);
    }


    public void deleteProgram(Long id) {
        // Fetch the program from the database
        Program program = programRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Program not found"));

        // Delete the program (this will also delete related ProgramRequirements because of CascadeType.ALL)
        programRepository.delete(program);
    }

}
