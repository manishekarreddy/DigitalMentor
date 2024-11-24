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
}
