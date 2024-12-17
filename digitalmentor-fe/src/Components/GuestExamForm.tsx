import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Typography,
    Button,
    TextField,
    CircularProgress,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@mui/material";
// import { useNavigate } from "react-router-dom";
import httpService from "../Services/HttpService";
import { Requirement, Program as InitialProgram } from "../Interface/Interfaces";
import LSS from "../Services/LSS";
// import { randomUUID } from "crypto";

interface ProgramEvaluation {
    programId: number;
    programName: string;
    totalWeightage: number;
    percentageScore: number;
}

const GuestExamForm: React.FC = () => {
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [scores, setScores] = useState<{ [key: number]: number }>({});
    const [selectedRequirements, setSelectedRequirements] = useState<{
        id: number;
        name: string;
        score: number;
    }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [programs, setPrograms] = useState<InitialProgram[]>([]);
    const [evaluationResults, setEvaluationResults] = useState<ProgramEvaluation[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [recommendations, setRecommendations] = useState<any[]>([]);

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

                const mySkillsResponse = await httpService.get("/api/mySkills");
                if (mySkillsResponse.data && Array.isArray(mySkillsResponse.data)) {
                    const mySkills = mySkillsResponse.data;

                    const updatedSelectedRequirements: { id: number; name: string; score: number }[] = [];
                    const updatedScores = { ...initialScores };

                    mySkills.forEach((skill) => {
                        updatedScores[skill.requirementId] = skill.score;

                        const selectedRequirement = requirements.find((req) => req.id === skill.requirementId);
                        if (selectedRequirement) {
                            updatedSelectedRequirements.push({
                                id: selectedRequirement.id,
                                name: selectedRequirement.name,
                                score: skill.score,
                            });

                            // Trigger handleScoreChange for each requirement
                            handleScoreChange(selectedRequirement.id, skill.score);
                        }
                    });

                    setScores(updatedScores);
                    setSelectedRequirements(updatedSelectedRequirements);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        const isRedirectFromGuest = LSS.getItem("guestId");

        if (isRedirectFromGuest) {
            // Avoid unnecessary guest saving on initial load
            handleSaveAsGuest();
        }

        fetchData();
    }, []);  // Adding empty dependency array ensures it runs once on mount


    const handleScoreChange = (requirementId: number, score: number) => {
        // Update scores state
        setScores((prevScores) => ({
            ...prevScores,
            [requirementId]: score,  // Update score for the specific requirementId
        }));

        // Update selectedRequirements state
        setSelectedRequirements((prevSelectedRequirements) => {
            const existingIndex = prevSelectedRequirements.findIndex((req) => req.id === requirementId);
            if (existingIndex !== -1) {
                // Update score for the existing requirement
                const updatedSelected = [...prevSelectedRequirements];
                updatedSelected[existingIndex].score = score;
                return updatedSelected;
            } else {
                // Add the new requirement if it doesn't exist in selectedRequirements
                const selected = requirements.find((req) => req.id === requirementId);
                if (selected) {
                    return [
                        ...prevSelectedRequirements,
                        { id: selected.id, name: selected.name, score },  // Add new requirement
                    ];
                }
                return prevSelectedRequirements;  // Return previous state if no match is found
            }
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
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
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveAsGuest = async () => {
        const formData = {
            requirements: selectedRequirements.filter((req) => req.score !== 0),  // Filter out requirements with score 0
            scores: Object.fromEntries(Object.entries(scores).filter(([key, value]) => value !== 0)), // Only keep non-zero scores
        };

        // Generate guestId if not already present
        let guestId = LSS.getItem("guestId");
        if (!guestId) {
            guestId = generateGuestId(); // Generate a new guestId if not available
            LSS.setItem("guestId", guestId);
        }

        // Check if the user is in guest mode
        const mode = LSS.getItem("mode");
        if (mode && mode.toLowerCase() === "guest") {
            // Save data locally for guest users
            LSS.setItem("guestFormData", JSON.stringify(formData));

            try {
                // Make an API call to save data as a guest
                await httpService.post(`/api/saveTemp?guestId=${guestId}`, formData);

                // Optionally, redirect to login page with the redirection target
                window.location.href = "/login?redirect=profileform";
            } catch (error) {
                console.error("Error saving data as guest:", error);
            }
        } else {
            try {
                // Save technical details with userId and guestId
                const technicalDetails = {
                    requirements: selectedRequirements
                        .filter(req => req.score !== 0)  // Only include non-zero scores
                        .map(req => ({
                            id: req.id,
                            score: req.score,
                        })),
                    scores: Object.fromEntries(Object.entries(scores).filter(([key, value]) => value !== 0)), // Only keep non-zero scores
                };

                if (guestId) {
                    await httpService.post(`/api/saveTechnicalDetails?guestId=${guestId}`, technicalDetails);
                    LSS.removeItem("guestId");
                } else {
                    await httpService.post(`/api/saveTechnicalDetails`, technicalDetails);
                    LSS.removeItem("guestId");
                }

            } catch (error) {
                console.error("Error saving details for logged-in user:", error);
            }
        }
    };


    const handleClickReocmmendations = async (programId: number) => {
        const userObj = LSS.getItem("user");
        if (programId) {

            try {
                const response: any = await httpService.get(`/api/users/recommendations/${programId}`);
                setRecommendations(response.data.recommendations);
                setOpenDialog(true);  // Open the dialog after data is fetched
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            }
        }
    }

    const closePopup = () => {
        setOpenDialog(false);
    };



    const generateGuestId = () => {
        const timestamp = Date.now(); // Current timestamp in milliseconds
        const randomSuffix = Math.floor(Math.random() * 1000); // Add a random number for uniqueness
        return `${timestamp}-${randomSuffix}`;
    };

    const filteredRequirements = requirements.filter((req) =>
        req.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                My Skills Details
            </Typography>
            <Typography variant="body1" gutterBottom>
                Please fill in the required details for each exam requirement.
            </Typography>

            <Grid container spacing={4}>
                {/* Left Column: Requirements */}
                <Grid item xs={12} md={4}>
                    <Typography variant="h5" gutterBottom>
                        Exam Requirements
                    </Typography>
                    <TextField
                        label="Search Requirements"
                        fullWidth
                        value={searchQuery}
                        onChange={handleSearchChange}
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />
                    <Box
                        sx={{
                            maxHeight: 400,
                            overflowY: "auto",
                            p: 2,
                            border: "1px solid #ddd",
                            borderRadius: 2,
                            backgroundColor: "#fff",
                        }}
                    >
                        <Grid container spacing={2}>
                            {filteredRequirements.slice(0, 8).map((requirement) => (
                                <Grid item xs={6} key={requirement.id}>
                                    <Box
                                        sx={{
                                            p: 1,
                                            border: "1px solid",
                                            borderColor: selectedRequirements.some((req) => req.id === requirement.id)
                                                ? "primary.main"
                                                : "#ddd",
                                            borderRadius: 1,
                                            backgroundColor: "#f5f5f5",
                                            transition: "0.3s",
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
                    </Box>
                </Grid>

                {/* Middle Column: Selected Requirements */}
                <Grid item xs={6} md={4}>
                    <Typography variant="h5" gutterBottom textAlign="center">
                        Selected Requirements
                    </Typography>
                    <Box
                        sx={{
                            p: 2,
                            border: "1px solid #ddd",
                            borderRadius: 2,
                            backgroundColor: "#fff",
                            maxHeight: 400,
                            overflowY: "auto",
                        }}
                    >
                        {selectedRequirements.map((req) => (
                            <Paper
                                key={req.id}
                                sx={{
                                    p: 2,
                                    mb: 1,
                                    backgroundColor: "#e3f2fd",
                                    border: "1px solid #64b5f6",
                                    borderRadius: 1,
                                }}
                            >
                                <Typography variant="body2" fontWeight="bold">
                                    {req.name}
                                </Typography>
                                <Typography variant="caption" color="textSecondary" fontWeight="bold">
                                    Score: {req.score}
                                </Typography>
                            </Paper>
                        ))}
                    </Box>
                </Grid>

                {/* Right Column: Program Recommendations */}
                <Grid item xs={8} md={4}>
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
                                                <Typography variant="body2">
                                                    Weightage: {result.totalWeightage}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Percentage: {result.percentageScore.toFixed(2)}%
                                                </Typography>
                                            </Box>
                                        ))}
                                    {/* Add the "What to Improve" button */}
                                    <p>Login to Check how you can Improve</p>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        sx={{ mt: 2 }}
                                        onClick={() => handleClickReocmmendations(program.id)}
                                    >
                                        How to Improve ?
                                    </Button>
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

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Improvement Recommendations</DialogTitle>
                <DialogContent>
                    {recommendations.length > 0 ? (
                        <div>
                            {recommendations.map((recommendation, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Typography variant="body1" fontWeight="bold">
                                        {recommendation.requirementName}
                                    </Typography>
                                    <Typography variant="body2">
                                        Improvement Needed: {recommendation.improvementNeeded}
                                    </Typography>
                                    <Typography variant="body2">
                                        Max Possible Score: {recommendation.maxPossibleScore}
                                    </Typography>
                                </Box>
                            ))}
                        </div>
                    ) : (
                        <Typography>No recommendations available.</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Grid>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 4 }}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Submitting..." : "Submit Exam Details"}
                </Button>

                {/* Save Button */}
                <Button
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 4 }}
                    onClick={handleSaveAsGuest}
                >
                    Save
                </Button>
            </Grid>
        </Box>
    );
};

export default GuestExamForm;
