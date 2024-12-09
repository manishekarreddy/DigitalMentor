package com.digitalmentor.DigitalMentorAuth.repository;

import com.digitalmentor.DigitalMentorAuth.entity.TechnicalRequirements.TechnicalDetails;
import com.digitalmentor.DigitalMentorAuth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TechnicalDetailsRepository extends JpaRepository<TechnicalDetails, Long> {
    List<TechnicalDetails> findByUserId(Long userId);
    Optional<TechnicalDetails> findByUserAndRequirementId(User user, Integer requirementId);
    List<TechnicalDetails> findByUser(User user);

}

