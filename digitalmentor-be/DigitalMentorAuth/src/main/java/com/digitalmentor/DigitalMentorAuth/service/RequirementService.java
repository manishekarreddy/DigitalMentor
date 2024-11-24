package com.digitalmentor.DigitalMentorAuth.service;

import com.digitalmentor.DigitalMentorAuth.entity.TestRequirements.Requirement;
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

}
