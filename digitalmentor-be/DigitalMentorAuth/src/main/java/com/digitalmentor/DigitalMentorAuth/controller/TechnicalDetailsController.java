package com.digitalmentor.DigitalMentorAuth.controller;

import com.digitalmentor.DigitalMentorAuth.dto.TechnicalDetailsDTO;
import com.digitalmentor.DigitalMentorAuth.entity.TechnicalRequirements.SaveTechnicalDetailsDTO;
import com.digitalmentor.DigitalMentorAuth.entity.User;
import com.digitalmentor.DigitalMentorAuth.security.MyUserDetails;
import com.digitalmentor.DigitalMentorAuth.service.TechnicalDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TechnicalDetailsController {

    @Autowired
    private TechnicalDetailsService technicalDetailsService;  // Service layer to handle logic

    @PostMapping("/saveTechnicalDetails")
    public ResponseEntity<?> saveTechnicalDetails(@RequestBody SaveTechnicalDetailsDTO details,
                                                  @AuthenticationPrincipal MyUserDetails user,
                                                  @RequestParam(required = false) String guestId) {
        try {
            technicalDetailsService.saveTechnicalDetails(details, user.getId(), guestId);
            return ResponseEntity.status(HttpStatus.CREATED).body("Technical details saved successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving technical details: " + e.getMessage());
        }
    }

    @PutMapping("/updateTechnicalSkills")
    public ResponseEntity<?> updateTechnicalDetails(@RequestBody SaveTechnicalDetailsDTO details, @AuthenticationPrincipal MyUserDetails user) {
        try {
            technicalDetailsService.updateTechnicalDetails(details, user.getId());
            return ResponseEntity.ok("Technical details updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating technical details: " + e.getMessage());
        }
    }

    @GetMapping("/mySkills")
    public ResponseEntity<?> getTechnicalDetails(@AuthenticationPrincipal MyUserDetails user) {
        try {
            List<TechnicalDetailsDTO> technicalDetails = technicalDetailsService.getTechnicalDetails(user.getId());
            return ResponseEntity.ok(technicalDetails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching technical details: " + e.getMessage());
        }
    }

    @PostMapping("/saveTemp")
    public ResponseEntity<?> saveTemporaryTechnicalDetails(@RequestBody SaveTechnicalDetailsDTO details,
                                                           @RequestParam String guestId) {
        try {
            technicalDetailsService.saveTemporaryTechnicalDetails(details, guestId);
            return ResponseEntity.status(HttpStatus.CREATED).body("Temporary technical details saved successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving temporary technical details: " + e.getMessage());
        }
    }


}

