package com.digitalmentor.DigitalMentorAuth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProgramDetailsDTO {
    private Long programId;
    private String programName;
    private String programDescription;
    private List<RequirementGroupDTO> requirementGroups;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RequirementGroupDTO {
        private Long groupId;
        private String condition; // "AND" or "OR"
        private List<RequirementDTO> requirements;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RequirementDTO {
        private Long requirementId;
        private String name;
        private double score;
        private String type;
    }
}
