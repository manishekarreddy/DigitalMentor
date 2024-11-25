import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Card,
    CardContent,
    IconButton,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@mui/material";

import { Close as CloseIcon } from "@mui/icons-material";
import httpService from "../Services/HttpService";
import { useSnackbar } from "../Services/SnackbarContext";
import { useParams, useNavigate } from "react-router-dom";
import { Program, ProgramRequirement, Requirement } from "../Interface/Interfaces"; // Import interfaces

const CreateProgram: React.FC = () => {
    const [programName, setProgramName] = useState("");
    const [programDescription, setProgramDescription] = useState("");
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [programRequirementsAND, setProgramRequirementsAND] = useState<ProgramRequirement[]>([]);
    const [programRequirementsOR, setProgramRequirementsOR] = useState<ProgramRequirement[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [openDialog, setOpenDialog] = useState(false);

    const { id } = useParams(); // Get the program ID from URL parameters
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const filteredRequirements = requirements.filter((req) =>
        req.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (id) {
            const fetchProgramDetails = async () => {
                try {
                    const response = await httpService.get<Program>(`/api/programs/${id}/details`);
                    const { name, description, programRequirements } = response.data;

                    setProgramName(name);
                    setProgramDescription(description);

                    const transformedRequirements: ProgramRequirement[] = programRequirements.map((req) => ({
                        requirement: req.requirement,
                        condition: req.condition,
                        scoreRanges: req.scoreRanges ?? [],
                    }));

                    setProgramRequirementsAND(transformedRequirements.filter((req) => req.condition === "AND"));
                    setProgramRequirementsOR(transformedRequirements.filter((req) => req.condition === "OR"));
                } catch (error) {
                    console.error("Error fetching program details:", error);
                }
            };

            fetchProgramDetails();
        }

        const fetchRequirements = async () => {
            try {
                const response = await httpService.get<{ requirements: Requirement[] }>("/api/requirements/list");
                setRequirements(response.data.requirements);
            } catch (error) {
                console.error("Error fetching requirements:", error);
            }
        };

        fetchRequirements();
    }, [id]);

    const addRequirementToProgram = (requirement: Requirement, condition: "AND" | "OR") => {
        const isInAND = programRequirementsAND.some((req) => req.requirement.id === requirement.id);
        const isInOR = programRequirementsOR.some((req) => req.requirement.id === requirement.id);

        if (!isInAND && !isInOR) {
            const newProgramRequirement: ProgramRequirement = {
                requirement,
                condition,
                scoreRanges: [{ id: 0, minScore: 0, maxScore: 100, weight: 1 }], // Default score range values
            };

            if (condition === "AND") {
                setProgramRequirementsAND((prev) => [...prev, newProgramRequirement]);
            } else {
                setProgramRequirementsOR((prev) => [...prev, newProgramRequirement]);
            }
        }
    };

    const removeRequirementFromProgram = (requirementId: number, condition: "AND" | "OR") => {
        if (condition === "AND") {
            setProgramRequirementsAND((prev) => prev.filter((req) => req.requirement.id !== requirementId));
        } else {
            setProgramRequirementsOR((prev) => prev.filter((req) => req.requirement.id !== requirementId));
        }
    };

    const addScoreRange = (requirementId: number, condition: "AND" | "OR") => {
        const updatedRequirements = (condition === "AND" ? programRequirementsAND : programRequirementsOR).map((req) => {
            if (req.requirement.id === requirementId) {
                const lastRange = req.scoreRanges[req.scoreRanges.length - 1];
                const newMinScore = lastRange ? lastRange.maxScore + 0.1 : 0; // Ensure the next range starts 0.1 more than the max score
                const newMaxScore = newMinScore + 0.6; // Define the range as 0.6 (e.g., for 7 - 7.6)

                const newScoreRange = {
                    id: 0,
                    minScore: newMinScore,
                    maxScore: newMaxScore,
                    weight: 1,
                };
                req.scoreRanges.push(newScoreRange);
            }
            return req;
        });

        if (condition === "AND") {
            setProgramRequirementsAND(updatedRequirements);
        } else {
            setProgramRequirementsOR(updatedRequirements);
        }
    };

    const removeScoreRange = (requirementId: number, scoreRangeId: number, condition: "AND" | "OR") => {
        const updatedRequirements = (condition === "AND" ? programRequirementsAND : programRequirementsOR).map((req) => {
            if (req.requirement.id === requirementId) {
                req.scoreRanges = req.scoreRanges.filter((range) => range.id !== scoreRangeId);
            }
            return req;
        });

        if (condition === "AND") {
            setProgramRequirementsAND(updatedRequirements);
        } else {
            setProgramRequirementsOR(updatedRequirements);
        }
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                name: programName,
                description: programDescription,
                programRequirements: [...programRequirementsAND, ...programRequirementsOR],
            };

            if (id) {
                await httpService.put(`/api/programs/update/${id}`, payload);
                showSnackbar("Program updated successfully", "success");
            } else {
                await httpService.post("/api/programs/create", payload);
                showSnackbar("Program created successfully", "success");
            }
            navigate("/dashboard");
        } catch (error) {
            console.error("Error creating program:", error);
            showSnackbar("Error creating program", "error");
        }
    };

    const handleDeleteClick = async () => {
        try {
            await httpService.delete(`/api/programs/delete/${id}`);
            showSnackbar("Program deleted successfully", "success");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error deleting program:", error);
        } finally {
            setOpenDialog(false);
        }
    };


    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                {id ? "Edit Program" : "Create New Program"}
            </Typography>

            <Grid container spacing={3} justifyContent="center">
                {/* Left Column: Program Name and Description */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <TextField
                                label="Program Name"
                                variant="outlined"
                                fullWidth
                                value={programName}
                                onChange={(e) => setProgramName(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Program Description"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                value={programDescription}
                                onChange={(e) => setProgramDescription(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Middle Column: Selected Requirements (AND on top, OR below) */}
                <Grid item xs={12} md={4}>
                    <Grid container spacing={2}>
                        {/* AND Requirements */}
                        <Grid item xs={12}>
                            <Card sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="h6">Selected AND Requirements</Typography>
                                    {programRequirementsAND.map((req, index) => (
                                        <Box key={index} sx={{ mb: 2, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                            <Typography variant="body1" sx={{ mb: 1 }}>
                                                {req.requirement.name}
                                                <IconButton
                                                    onClick={() => removeRequirementFromProgram(req.requirement.id, "AND")}
                                                    sx={{ color: "red", ml: 2 }}
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                            </Typography>

                                            {req.scoreRanges.map((range, rangeIndex) => (
                                                <Box key={range.id} sx={{ mb: 1, display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                    <TextField
                                                        type="number"
                                                        label="Min Score"
                                                        variant="outlined"
                                                        value={range.minScore}
                                                        onChange={(e) => {
                                                            const updatedReqs = [...programRequirementsAND];
                                                            updatedReqs[index].scoreRanges[rangeIndex].minScore = Number(e.target.value);
                                                            setProgramRequirementsAND(updatedReqs);
                                                        }}
                                                        sx={{ width: "70px", mr: 1 }} // Further shrink input width
                                                    />
                                                    <TextField
                                                        type="number"
                                                        label="Max Score"
                                                        variant="outlined"
                                                        value={range.maxScore}
                                                        onChange={(e) => {
                                                            const updatedReqs = [...programRequirementsAND];
                                                            updatedReqs[index].scoreRanges[rangeIndex].maxScore = Number(e.target.value);
                                                            setProgramRequirementsAND(updatedReqs);
                                                        }}
                                                        sx={{ width: "70px", mr: 1 }} // Further shrink input width
                                                    />
                                                    <TextField
                                                        type="number"
                                                        label="Weight"
                                                        variant="outlined"
                                                        value={range.weight}
                                                        onChange={(e) => {
                                                            const updatedReqs = [...programRequirementsAND];
                                                            updatedReqs[index].scoreRanges[rangeIndex].weight = Number(e.target.value);
                                                            setProgramRequirementsAND(updatedReqs);
                                                        }}
                                                        sx={{ width: "70px", mr: 1 }} // Further shrink input width
                                                    />
                                                    <IconButton
                                                        onClick={() => removeScoreRange(req.requirement.id, range.id, "AND")}
                                                        sx={{ color: "red" }}
                                                    >
                                                        <CloseIcon />
                                                    </IconButton>
                                                </Box>
                                            ))}

                                            <Button
                                                variant="outlined"
                                                onClick={() => addScoreRange(req.requirement.id, "AND")}
                                                sx={{
                                                    mt: 2,
                                                    width: "fit-content", // Shrink the button
                                                    fontSize: "0.8rem", // Reduce button font size
                                                    padding: "6px 12px", // Reduce padding
                                                }}
                                            >
                                                +
                                            </Button>
                                        </Box>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* OR Requirements */}
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Selected OR Requirements</Typography>
                                    {programRequirementsOR.map((req, index) => (
                                        <Box key={index} sx={{ mb: 2, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                            <Typography variant="body1" sx={{ mb: 1 }}>
                                                {req.requirement.name}
                                                <IconButton
                                                    onClick={() => removeRequirementFromProgram(req.requirement.id, "OR")}
                                                    sx={{ color: "red", ml: 2 }}
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                            </Typography>

                                            {req.scoreRanges.map((range, rangeIndex) => (
                                                <Box key={range.id} sx={{ mb: 1, display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                    <TextField
                                                        type="number"
                                                        label="Min Score"
                                                        variant="outlined"
                                                        value={range.minScore}
                                                        onChange={(e) => {
                                                            const updatedReqs = [...programRequirementsOR];
                                                            updatedReqs[index].scoreRanges[rangeIndex].minScore = Number(e.target.value);
                                                            setProgramRequirementsOR(updatedReqs);
                                                        }}
                                                        sx={{ width: "70px", mr: 1 }} // Shrink input width
                                                    />
                                                    <TextField
                                                        type="number"
                                                        label="Max Score"
                                                        variant="outlined"
                                                        value={range.maxScore}
                                                        onChange={(e) => {
                                                            const updatedReqs = [...programRequirementsOR];
                                                            updatedReqs[index].scoreRanges[rangeIndex].maxScore = Number(e.target.value);
                                                            setProgramRequirementsOR(updatedReqs);
                                                        }}
                                                        sx={{ width: "70px", mr: 1 }} // Shrink input width
                                                    />
                                                    <TextField
                                                        type="number"
                                                        label="Weight"
                                                        variant="outlined"
                                                        value={range.weight}
                                                        onChange={(e) => {
                                                            const updatedReqs = [...programRequirementsOR];
                                                            updatedReqs[index].scoreRanges[rangeIndex].weight = Number(e.target.value);
                                                            setProgramRequirementsOR(updatedReqs);
                                                        }}
                                                        sx={{ width: "70px", mr: 1 }} // Shrink input width
                                                    />
                                                    <IconButton
                                                        onClick={() => removeScoreRange(req.requirement.id, range.id, "OR")}
                                                        sx={{ color: "red" }}
                                                    >
                                                        <CloseIcon />
                                                    </IconButton>
                                                </Box>
                                            ))}

                                            <Button
                                                variant="outlined"
                                                onClick={() => addScoreRange(req.requirement.id, "OR")}
                                                sx={{
                                                    mt: 2,
                                                    width: "fit-content", // Shrink the button
                                                    fontSize: "0.8rem", // Reduce button font size
                                                    padding: "6px 12px", // Reduce padding
                                                }}
                                            >
                                                +
                                            </Button>
                                        </Box>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Right Column: Requirement Search */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <TextField
                                label="Search Requirements"
                                variant="outlined"
                                fullWidth
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Paper sx={{ maxHeight: 400, overflow: "auto" }}>
                                {filteredRequirements.map((requirement) => (
                                    <Box
                                        key={requirement.id}
                                        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}
                                    >
                                        <Typography variant="body1">{requirement.name}</Typography>
                                        <Box>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => addRequirementToProgram(requirement, "AND")}
                                                sx={{ mr: 1 }}
                                            >
                                                Add to AND
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => addRequirementToProgram(requirement, "OR")}
                                            >
                                                Add to OR
                                            </Button>
                                        </Box>
                                    </Box>
                                ))}
                            </Paper>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Dialog for Deleting Program */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this program?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteClick} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Box sx={{ mt: 3 }}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    {id ? "Update Program" : "Create Program"}
                </Button>
                {id && (
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setOpenDialog(true)}
                        sx={{ ml: 2 }}
                    >
                        Delete Program
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default CreateProgram;
