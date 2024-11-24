package com.digitalmentor.DigitalMentorAuth.controller;

import com.digitalmentor.DigitalMentorAuth.entity.TestRequirements.Requirement;
import com.digitalmentor.DigitalMentorAuth.service.RequirementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requirements")
public class RequirementsController {

    @Autowired private RequirementService requirementService;

    @GetMapping("/list")
    public ResponseEntity<Map<String, List<Requirement>>> listRequirements() {
        return new ResponseEntity<>(requirementService.getAllRequirements(), HttpStatus.OK);
    }

    @PostMapping("/create")
    public Requirement createRequirement(@RequestBody Requirement requirement){
        return requirementService.createOrFetchRequirement(requirement);
    }
}
