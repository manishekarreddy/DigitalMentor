package com.digitalmentor.DigitalMentorAuth.controller;

import com.digitalmentor.DigitalMentorAuth.service.ProgramService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/evaluate")
public class EvaluationController {

    @Autowired
    private ProgramService programService;

    @PostMapping("")
    public ResponseEntity<List<EvaluationResult>> evaluateStudent(@RequestBody List<StudentScore> studentScores) {
        List<EvaluationResult> results = programService.evaluateStudent(studentScores);
        return ResponseEntity.ok(results);
    }
}
