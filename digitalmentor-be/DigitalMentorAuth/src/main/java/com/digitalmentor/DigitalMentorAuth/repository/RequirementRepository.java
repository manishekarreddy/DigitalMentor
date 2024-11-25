package com.digitalmentor.DigitalMentorAuth.repository;


import com.digitalmentor.DigitalMentorAuth.entity.TestRequirements.Requirement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RequirementRepository extends JpaRepository<Requirement, Long> {
    List<Requirement> findByName(String name);
}
