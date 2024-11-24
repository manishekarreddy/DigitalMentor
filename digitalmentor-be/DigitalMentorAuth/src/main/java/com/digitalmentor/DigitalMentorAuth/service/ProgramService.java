package com.digitalmentor.DigitalMentorAuth.service;


import com.digitalmentor.DigitalMentorAuth.entity.Program;
import com.digitalmentor.DigitalMentorAuth.entity.ProgramRequirement;
import com.digitalmentor.DigitalMentorAuth.entity.TestRequirements.Requirement;
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


    public Program saveProgram(Program program) {
        if (program.getProgramRequirements() == null || program.getProgramRequirements().isEmpty()) {
            throw new IllegalArgumentException("Program must have at least one requirement.");
        }

        // Create a temporary list to hold the updated ProgramRequirement objects
        List<ProgramRequirement> updatedProgramRequirements = new ArrayList<>();

        // Process each program-specific requirement
        for (ProgramRequirement programRequirement : program.getProgramRequirements()) {
            // Fetch the global requirement by its ID
            Requirement requirement = requirementRepository.findById(programRequirement.getRequirement().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Requirement not found with ID: "
                            + programRequirement.getRequirement().getId()));

            if (programRequirement.getCondition() == null) {
                throw new IllegalArgumentException("Condition (AND/OR) must be specified for each ProgramRequirement.");
            }

            // Associate the requirement and the program
            programRequirement.setRequirement(requirement);
            programRequirement.setProgram(program);

            // Add to the temporary list
            updatedProgramRequirements.add(programRequirement);
        }

        // Set the updated list of ProgramRequirements to the program
        program.setProgram_requirement(updatedProgramRequirements);

        // Save the program along with its requirements
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
        // Fetch the existing program
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

        // Clear the existing program requirements
        existingRequirements.clear();

        // Process the updated requirements
        for (ProgramRequirement updatedRequirement : updatedRequirements) {
            Requirement requirement = requirementRepository.findById(updatedRequirement.getRequirement().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Requirement not found"));

            // Check if this requirement already exists in the program
            ProgramRequirement existingRequirement = existingRequirementsMap.get(requirement.getId());

            if (existingRequirement != null) {
                // Update the existing requirement's fields
                existingRequirement.setScore(updatedRequirement.getScore());
                existingRequirement.setCondition(updatedRequirement.getCondition());
                existingRequirements.add(existingRequirement);
            } else {
                // Add new requirement
                updatedRequirement.setRequirement(requirement);
                updatedRequirement.setProgram(existingProgram);
                existingRequirements.add(updatedRequirement);
            }
        }

        // Save the updated program (cascading will handle requirements)
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
