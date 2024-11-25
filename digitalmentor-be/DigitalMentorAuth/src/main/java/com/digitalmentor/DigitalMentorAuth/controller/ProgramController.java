package com.digitalmentor.DigitalMentorAuth.controller;


import com.digitalmentor.DigitalMentorAuth.dto.ProgramDetailsDTO;
import com.digitalmentor.DigitalMentorAuth.entity.Program;
import com.digitalmentor.DigitalMentorAuth.service.ProgramService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/programs")
public class ProgramController {

    @Autowired private ProgramService programService;


    @PostMapping("/create")
    public Program createProgram(@RequestBody Program program){
        return programService.createProgram(program);
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<Program> getProgramDetails(@PathVariable Long id) {
        return programService.programDetails(id);
    }

    @GetMapping("")
    public ResponseEntity<Map<String, List<Program>>> getAllPrograms() {
        return new ResponseEntity<>( programService.getAllPrograms(), HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Program> updateProgram(@PathVariable Long id, @RequestBody Program programDetails) {
        try {
            Program updatedProgram = programService.updateProgram(id, programDetails);
            return ResponseEntity.ok(updatedProgram);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteProgram(@PathVariable Long id) {
        try {
            programService.deleteProgram(id);
            return ResponseEntity.ok("Program deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Program not found");
        }
    }


}
