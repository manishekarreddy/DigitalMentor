package com.digitalmentor.DigitalMentorAuth.repository;

import com.digitalmentor.DigitalMentorAuth.entity.ProgramRequirement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProgramRequirementRepository extends JpaRepository<ProgramRequirement, Long> {
    List<ProgramRequirement> findByRequirementId(Long requirementId);
}
