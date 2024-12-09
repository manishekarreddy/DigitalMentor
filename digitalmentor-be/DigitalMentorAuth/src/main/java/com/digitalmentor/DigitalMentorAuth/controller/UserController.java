package com.digitalmentor.DigitalMentorAuth.controller;

package com.digitalmentor.backend.controller;

import com.digitalmentor.DigitalMentorAuth.entity.User;
import com.digitalmentor.DigitalMentorAuth.repository.UserRepository;
import com.digitalmentor.backend.model.User;
import com.digitalmentor.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Edit User API (Update password and optional field)
    @PutMapping("/edit/{userId}")
    public ResponseEntity<User> updateUser(
            @PathVariable String userId,
            @RequestBody User updatedUser) {
        Optional<User> existingUserOptional = userRepository.find(userId);

        if (existingUserOptional.isEmpty()) {
            return ResponseEntity.status(404).body(null);  // User not found
        }

        User existingUser = existingUserOptional.get();

        // Update password (ensure it's updated if the user provides a new password)
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            existingUser.setPassword(updatedUser.getPassword());
        }

        // Update the 'isInternationalStudent' field if provided
        if (updatedUser.getIsInternationalStudent() != null) {
            existingUser.setIsInternationalStudent(updatedUser.getIsInternationalStudent());
        }

        // Save the updated user
        userRepository.save(existingUser);
        return ResponseEntity.ok(existingUser);
    }
}

