package com.digitalmentor.DigitalMentorAuth.controller;

public class EvaluationResult {

    private Long programId;
    private String programName;
    private double totalWeightage;  // Total weightage scored
    private double percentageScore;


    public EvaluationResult() {
    }

    public EvaluationResult(Long programId, String programName, double totalWeightage, double percentageScore) {
        this.programId = programId;
        this.programName = programName;
        this.totalWeightage = totalWeightage;
        this.percentageScore = percentageScore;
    }

    public Long getProgramId() {
        return programId;
    }

    public void setProgramId(Long programId) {
        this.programId = programId;
    }

    public String getProgramName() {
        return programName;
    }

    public void setProgramName(String programName) {
        this.programName = programName;
    }

    public double getTotalWeightage() {
        return totalWeightage;
    }

    public void setTotalWeightage(double totalWeightage) {
        this.totalWeightage = totalWeightage;
    }

    public double getPercentageScore() {
        return percentageScore;
    }

    public void setPercentageScore(double percentageScore) {
        this.percentageScore = percentageScore;
    }
}
