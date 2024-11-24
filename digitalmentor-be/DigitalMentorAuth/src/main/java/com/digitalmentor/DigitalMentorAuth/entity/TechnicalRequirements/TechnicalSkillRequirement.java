package com.digitalmentor.DigitalMentorAuth.entity.TechnicalRequirements;

import com.digitalmentor.DigitalMentorAuth.entity.TestRequirements.Requirement;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TechnicalSkillRequirement extends Requirement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String language;  // e.g., Java, Python
    private String proficiencyLevel;  // e.g., "Intermediate", "Advanced"
    private double score;  // Score threshold or certification level

}

