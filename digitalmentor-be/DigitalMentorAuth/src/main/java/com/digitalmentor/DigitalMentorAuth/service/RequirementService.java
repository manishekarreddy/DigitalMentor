package com.digitalmentor.DigitalMentorAuth.service;

import com.digitalmentor.DigitalMentorAuth.entity.ProgramRequirement;
import com.digitalmentor.DigitalMentorAuth.entity.TestRequirements.Requirement;
import com.digitalmentor.DigitalMentorAuth.repository.ProgramRequirementRepository;
import com.digitalmentor.DigitalMentorAuth.repository.RequirementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RequirementService {

    @Autowired private
    RequirementRepository requirementRepository;

    @Autowired private ProgramRequirementRepository programRequirementRepository;

    public Requirement createOrFetchRequirement(Requirement requirement) {
        // Check if a similar requirement exists in the database
        List<Requirement> existingRequirements = requirementRepository.findByName(requirement.getName());

        if (!existingRequirements.isEmpty()) {
            // Return the first matching requirement (you can improve this logic)
            return existingRequirements.get(0);
        } else {
            // Save and return the new requirement
            return requirementRepository.save(requirement);
        }
    }

    public Map<String, List<Requirement>> getAllRequirements() {
        Map<String, List<Requirement>> map = new HashMap<>();
        map.put("requirements", requirementRepository.findAll());
        return map;
    }

    public void deleteRequirement(Long requirementId) {
        // Find the requirement by ID
        Requirement requirement = requirementRepository.findById(requirementId)
                .orElseThrow(() -> new IllegalArgumentException("Requirement not found"));

        // Remove the requirement from all associated ProgramRequirements
        List<ProgramRequirement> programRequirements = programRequirementRepository.findByRequirementId(requirementId);
        for (ProgramRequirement programRequirement : programRequirements) {
            // Remove the requirement from the program
            programRequirement.setRequirement(null);
            programRequirementRepository.delete(programRequirement);
        }

        // Finally, delete the requirement from the database
        requirementRepository.delete(requirement);
    }

}
