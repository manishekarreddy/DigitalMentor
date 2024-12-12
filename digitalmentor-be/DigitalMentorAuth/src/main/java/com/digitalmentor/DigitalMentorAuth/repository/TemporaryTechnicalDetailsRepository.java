package com.digitalmentor.DigitalMentorAuth.repository;

import com.digitalmentor.DigitalMentorAuth.dto.TemporaryTechnicalDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TemporaryTechnicalDetailsRepository extends JpaRepository<TemporaryTechnicalDetails, Long> {
    List<TemporaryTechnicalDetails> findByGuestId(String guestId);
}

