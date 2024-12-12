package com.digitalmentor.DigitalMentorAuth.service;

import com.digitalmentor.DigitalMentorAuth.dto.TechnicalDetailsDTO;
import com.digitalmentor.DigitalMentorAuth.dto.TemporaryTechnicalDetails;
import com.digitalmentor.DigitalMentorAuth.entity.TechnicalRequirements.SaveTechnicalDetailsDTO;
import com.digitalmentor.DigitalMentorAuth.entity.TechnicalRequirements.TechnicalDetails;
import com.digitalmentor.DigitalMentorAuth.entity.User;
import com.digitalmentor.DigitalMentorAuth.repository.TechnicalDetailsRepository;
import com.digitalmentor.DigitalMentorAuth.repository.TemporaryTechnicalDetailsRepository;
import com.digitalmentor.DigitalMentorAuth.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TechnicalDetailsService {

    @Autowired
    private TechnicalDetailsRepository technicalDetailsRepository;

    @Autowired
    TemporaryTechnicalDetailsRepository temporaryTechnicalDetailsRepository;

    @Autowired
    private UserRepository userRepository;  // Assuming you have a user repository

    public void saveTechnicalDetails(SaveTechnicalDetailsDTO details, Long userId, String guestId) {
        // Find the user by ID
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // If a guest ID is provided, fetch details from the temporary table
        if (guestId != null && !guestId.isEmpty()) {
            List<TemporaryTechnicalDetails> guestDetails = temporaryTechnicalDetailsRepository.findByGuestId(guestId);

            // Transfer guest details to user's technical details
            for (TemporaryTechnicalDetails guestDetail : guestDetails) {
                TechnicalDetails technicalDetails = new TechnicalDetails();
                technicalDetails.setUser(user);
                technicalDetails.setRequirementId(guestDetail.getRequirementId());
                technicalDetails.setScore(guestDetail.getScore());

                technicalDetailsRepository.save(technicalDetails);
            }

            // Optionally delete the guest data after transferring
            temporaryTechnicalDetailsRepository.deleteAll(guestDetails);
        }

        // Save new scores provided directly in the request body
        for (Map.Entry<Integer, Integer> entry : details.getScores().entrySet()) {
            TechnicalDetails technicalDetails = new TechnicalDetails();
            technicalDetails.setUser(user);
            technicalDetails.setRequirementId(entry.getKey());
            technicalDetails.setScore(entry.getValue());

            technicalDetailsRepository.save(technicalDetails);
        }
    }


    @Transactional
    public void updateTechnicalDetails(SaveTechnicalDetailsDTO details, Long userId) {
        // Retrieve the logged-in user (or pass userId explicitly as a parameter if needed)
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Fetch all existing technical details for the user
        List<TechnicalDetails> existingDetails = technicalDetailsRepository.findByUserId(userId);

        // Create a map for fast lookup of existing details by requirementId
        Map<Integer, TechnicalDetails> existingDetailsMap = existingDetails.stream()
                .collect(Collectors.toMap(TechnicalDetails::getRequirementId, detail -> detail));

        // Loop through the incoming scores
        List<TechnicalDetails> updatedDetails = new ArrayList<>();
        for (Map.Entry<Integer, Integer> entry : details.getScores().entrySet()) {
            Integer requirementId = entry.getKey();
            Integer newScore = entry.getValue();

            // Check if the detail exists
            TechnicalDetails technicalDetail = existingDetailsMap.get(requirementId);
            if (technicalDetail != null) {
                // Update the existing detail
                technicalDetail.setScore(newScore);
                updatedDetails.add(technicalDetail);
            } else {
                throw new RuntimeException("Technical detail not found for requirement ID: " + requirementId);
            }
        }

        // Perform a bulk save
        technicalDetailsRepository.saveAll(updatedDetails);
    }

    public List<TechnicalDetailsDTO> getTechnicalDetails(Long id) {
        // Fetch the user
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Fetch technical details
        List<TechnicalDetails> technicalDetails = technicalDetailsRepository.findByUser(user);

        // Map entities to DTOs
        return technicalDetails.stream()
                .map(detail -> new TechnicalDetailsDTO(detail.getRequirementId(), detail.getScore()))
                .collect(Collectors.toList());
    }

    public void saveTemporaryTechnicalDetails(SaveTechnicalDetailsDTO details, String guestId) {
        // Iterate through the provided scores
        List<TemporaryTechnicalDetails> tempDetailsList = details.getScores().entrySet().stream()
                .map(entry -> new TemporaryTechnicalDetails(guestId, entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());

        // Save all temporary details in bulk
        temporaryTechnicalDetailsRepository.saveAll(tempDetailsList);
    }
}
