package com.digitalmentor.DigitalMentorAuth.repository;

import com.digitalmentor.DigitalMentorAuth.entity.Program;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProgramRepository extends JpaRepository<Program, Long> {
}