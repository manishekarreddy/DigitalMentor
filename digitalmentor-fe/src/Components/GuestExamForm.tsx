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

// Define a local interface for evaluation results
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
    const [programs, setPrograms] = useState<InitialProgram[]>([]); // Initial Programs for UI
    const [evaluationResults, setEvaluationResults] = useState<ProgramEvaluation[]>([]); // Evaluation Results for showing Chips

    // Fetch requirements and program data when the component loads
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch requirements
                const requirementsResponse = await httpService.get<{ requirements: Requirement[] }>("/api/requirements/list");
                setRequirements(requirementsResponse.data.requirements);

                // Fetch initial program data (using previous interfaces)
                const programsResponse = await httpService.get<{ programs: InitialProgram[] }>("/api/programs");
                setPrograms(programsResponse.data.programs);

                // Initialize the scores for each requirement
                const initialScores = requirementsResponse.data.requirements.reduce((acc, req) => {
                    acc[req.id] = 0; // default score to 0
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

    // Handle input change for scores
    const handleScoreChange = (requirementId: number, score: number) => {
        setScores((prevScores) => ({
            ...prevScores,
            [requirementId]: score,
        }));
    };

    // Submit form
    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            // Prepare data to send to the backend
            const examData = requirements.map((req) => ({
                requirementId: req.id,
                score: scores[req.id] || 0,
            }));

            // Send data to the backend
            const response = await httpService.post("/api/evaluate", examData);

            console.log("Submission Response:", response.data);

            // Explicitly cast the response data to the correct type
            const updatedEvaluationResults: ProgramEvaluation[] = response.data as ProgramEvaluation[];

            // Update the evaluation results state with the new data
            setEvaluationResults(updatedEvaluationResults);
        } catch (error) {
            console.error("Error submitting exam data:", error);
            alert("There was an error submitting the exam details.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading indicator while fetching data
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

            {/* Render all requirements */}
            <Grid container spacing={3}>
                {requirements.map((requirement) => (
                    <Grid item xs={12} sm={6} md={4} key={requirement.id}>
                        <Box sx={{ p: 2, border: "1px solid #ddd", borderRadius: 1 }}>
                            <Typography variant="h6">{requirement.name}</Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                {requirement.type} requirement
                            </Typography>
                            <TextField
                                label="Score"
                                type="number"
                                fullWidth
                                value={scores[requirement.id] || ""}
                                onChange={(e) =>
                                    handleScoreChange(requirement.id, parseFloat(e.target.value))
                                }
                                variant="outlined"
                                sx={{ mb: 2 }}
                            />
                        </Box>
                    </Grid>
                ))}
            </Grid>

            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
            >
                {isSubmitting ? "Submitting..." : "Submit Exam Details"}
            </Button>

            {/* Render programs with their weightage and percentage score after submission */}
            {programs.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Available Programs
                    </Typography>
                    <Grid container spacing={3}>
                        {programs.map((program) => (
                            <Grid item xs={12} sm={6} md={4} key={program.id}>
                                <Box sx={{ p: 2, border: "1px solid #ddd", borderRadius: 1 }}>
                                    <Typography variant="h6">{program.name}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Initial Program Data
                                    </Typography>
                                    {/* Render chips below each program */}
                                    {evaluationResults
                                        .filter((result) => result.programId === program.id)
                                        .map((result) => (
                                            <Box key={result.programId} sx={{ mt: 2 }}>
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
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Box>
    );
};

export default GuestExamForm;
