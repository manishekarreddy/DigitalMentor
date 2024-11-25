import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Typography,
    Button,
    TextField,
    CircularProgress,
    Chip,
} from "@mui/material";
import httpService from "../Services/HttpService";
import { Requirement, Program as InitialProgram } from "../Interface/Interfaces"; // Previous Program Interface for initial load

interface ProgramEvaluation {
    programId: number;
    programName: string;
    totalWeightage: number;
    percentageScore: number;
}

const GuestExamForm: React.FC = () => {
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [scores, setScores] = useState<{ [key: number]: number }>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [programs, setPrograms] = useState<InitialProgram[]>([]);
    const [evaluationResults, setEvaluationResults] = useState<ProgramEvaluation[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const requirementsResponse = await httpService.get<{ requirements: Requirement[] }>("/api/requirements/list");
                setRequirements(requirementsResponse.data.requirements);

                const programsResponse = await httpService.get<{ programs: InitialProgram[] }>("/api/programs");
                setPrograms(programsResponse.data.programs);

                const initialScores = requirementsResponse.data.requirements.reduce((acc, req) => {
                    acc[req.id] = 0;
                    return acc;
                }, {} as { [key: number]: number });

                setScores(initialScores);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleScoreChange = (requirementId: number, score: number) => {
        setScores((prevScores) => ({
            ...prevScores,
            [requirementId]: score,
        }));
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            const examData = requirements.map((req) => ({
                requirementId: req.id,
                score: scores[req.id] || 0,
            }));

            const response = await httpService.post("/api/evaluate", examData);
            const updatedEvaluationResults: ProgramEvaluation[] = response.data as ProgramEvaluation[];
            setEvaluationResults(updatedEvaluationResults);
        } catch (error) {
            console.error("Error submitting exam data:", error);
            alert("There was an error submitting the exam details.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
            <Typography variant="h4" gutterBottom>
                Guest Exam Details
            </Typography>
            <Typography variant="body1" gutterBottom>
                Please fill in the required details for each exam requirement.
            </Typography>

            <Grid container spacing={4}>
                {/* Left Column: Requirements */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" gutterBottom>
                        Exam Requirements
                    </Typography>
                    <Grid container spacing={2}>
                        {requirements.map((requirement) => (
                            <Grid item xs={6} key={requirement.id}>
                                <Box
                                    sx={{
                                        p: 1,
                                        border: "1px solid #ddd",
                                        borderRadius: 1,
                                        backgroundColor: "#fff",
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: "14px",
                                        }}
                                    >
                                        {requirement.name}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="textSecondary"
                                        sx={{
                                            fontSize: "12px",
                                        }}
                                    >
                                        {requirement.type}
                                    </Typography>
                                    <TextField
                                        label="Score"
                                        type="number"
                                        fullWidth
                                        size="small"
                                        value={scores[requirement.id] || ""}
                                        onChange={(e) =>
                                            handleScoreChange(requirement.id, parseFloat(e.target.value))
                                        }
                                        variant="outlined"
                                        sx={{ mt: 1 }}
                                    />
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                {/* Right Column: Program Recommendations */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" gutterBottom>
                        Program Recommendations
                    </Typography>
                    <Box>
                        {programs.length > 0 ? (
                            programs.map((program) => (
                                <Box
                                    key={program.id}
                                    sx={{
                                        mb: 2,
                                        p: 2,
                                        border: "1px solid #ddd",
                                        borderRadius: 1,
                                        backgroundColor: "#fff",
                                    }}
                                >
                                    <Typography variant="h6">{program.name}</Typography>
                                    {evaluationResults
                                        .filter((result) => result.programId === program.id)
                                        .map((result) => (
                                            <Box key={result.programId} sx={{ mt: 1 }}>
                                                <Chip
                                                    label={`Weightage: ${result.totalWeightage}`}
                                                    sx={{ marginRight: 1 }}
                                                />
                                                <Chip
                                                    label={`Percentage: ${result.percentageScore.toFixed(2)}%`}
                                                />
                                            </Box>
                                        ))}
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body2" color="textSecondary">
                                No recommendations available.
                            </Typography>
                        )}
                    </Box>
                </Grid>
            </Grid>

            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 4 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
            >
                {isSubmitting ? "Submitting..." : "Submit Exam Details"}
            </Button>
        </Box>
    );
};

export default GuestExamForm;
