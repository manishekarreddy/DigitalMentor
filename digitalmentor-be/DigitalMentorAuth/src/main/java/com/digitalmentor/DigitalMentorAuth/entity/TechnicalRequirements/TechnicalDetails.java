package com.digitalmentor.DigitalMentorAuth.entity.TechnicalRequirements;

import com.digitalmentor.DigitalMentorAuth.entity.User;
import jakarta.persistence.*;

@Entity
@Table(name = "technical_details")
public class TechnicalDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;  // Assuming you have a User entity

    @Column(name = "requirement_id", nullable = false)
    private Integer requirementId;

    @Column(name = "score", nullable = false)
    private Integer score;

    public TechnicalDetails(Long id, User user, Integer requirementId, Integer score) {
        this.id = id;
        this.user = user;
        this.requirementId = requirementId;
        this.score = score;
    }

    public TechnicalDetails() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Integer getRequirementId() {
        return requirementId;
    }

    public void setRequirementId(Integer requirementId) {
        this.requirementId = requirementId;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }
}

