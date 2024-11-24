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
    Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import httpService from "../Services/HttpService";
import { describe } from "node:test";
import { useSnackbar } from "../Services/SnackbarContext";
import { useParams, useNavigate } from "react-router-dom";
import { Program } from "../Interface/Interfaces";

interface Requirement {
    id: number;
    name: string;
    type: string;
}

interface ProgramRequirement {
    requirement: Requirement;
    score: number;
    condition: "AND" | "OR";
}

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

                    // Set basic program details
                    setProgramName(name);
                    setProgramDescription(description);

                    // Transform `Requirement[]` to `ProgramRequirement[]`
                    const transformedRequirements = programRequirements.map((req) => ({
                        requirement: {
                            id: req.requirement.id,
                            name: req.requirement.name,
                            type: req.requirement.type,
                        },
                        score: req.score,
                        // Cast condition to "AND" | "OR" explicitly
                        condition: req.condition as "AND" | "OR",
                    }));

                    // Split transformed requirements into AND and OR lists
                    const andRequirements = transformedRequirements.filter(req => req.condition === "AND");
                    const orRequirements = transformedRequirements.filter(req => req.condition === "OR");

                    // Set state
                    setProgramRequirementsAND(andRequirements);
                    setProgramRequirementsOR(orRequirements);
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

    // Add requirement to a specific list based on condition (AND/OR), ensuring no duplicates
    const addRequirementToProgram = (requirement: Requirement, condition: "AND" | "OR") => {
        const isInAND = programRequirementsAND.some((req) => req.requirement.id === requirement.id);
        const isInOR = programRequirementsOR.some((req) => req.requirement.id === requirement.id);

        if (!isInAND && !isInOR) {
            const newProgramRequirement = {
                requirement,
                score: 0, // Default score
                condition,
            };
            if (condition === "AND") {
                setProgramRequirementsAND((prev) => [...prev, newProgramRequirement]);
            } else {
                setProgramRequirementsOR((prev) => [...prev, newProgramRequirement]);
            }
        }
    };

    // Remove requirement from program list
    const removeRequirementFromProgram = (requirementId: number, condition: "AND" | "OR") => {
        if (condition === "AND") {
            setProgramRequirementsAND((prev) => prev.filter((req) => req.requirement.id !== requirementId));
        } else {
            setProgramRequirementsOR((prev) => prev.filter((req) => req.requirement.id !== requirementId));
        }
    };

    const handleSubmit = async () => {
        // Handle program creation here (e.g., send data to the API)

        try {
            // Prepare the payload for the API
            const payload = {
                name: programName,
                description: programDescription,
                programRequirements: [...programRequirementsAND, ...programRequirementsOR] // Combining AND and OR lists
            };

            // Make the POST request to create a new program
            if (id) {
                // Update existing program
                await httpService.put(`/api/programs/update/${id}`, payload);
                showSnackbar("Program updated successfully", "success");
            } else {
                // Create new program
                await httpService.post("/api/programs/create", payload);
                showSnackbar("Program created successfully", "success");
            }
            navigate("/dashboard")

        } catch (error) {
            console.error("Error creating program:", error);
            showSnackbar("Error", 'error');
            // Optionally, show an error message to the user
        }

    };

    const handleDeleteClick = async () => {
        try {
            // Make the DELETE request to the API
            const response = await httpService.delete(`/api/programs/delete/${id}`);
            showSnackbar('program deleted successfully', 'success');
            navigate("/dashboard")
        } catch (error) {
            console.error("Error deleting program:", error);
        } finally {
            setOpenDialog(false); // Close the dialog after deletion or error
        }
    }


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
                                        <Box key={index} sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                                            <Typography variant="body1" sx={{ flexGrow: 1 }}>
                                                {req.requirement.name}
                                            </Typography>
                                            <TextField
                                                type="number"
                                                label="Score"
                                                variant="outlined"
                                                value={req.score}
                                                onChange={(e) => {
                                                    const updatedReqs = [...programRequirementsAND];
                                                    updatedReqs[index].score = Number(e.target.value);
                                                    setProgramRequirementsAND(updatedReqs);
                                                }}
                                                sx={{ ml: 2, width: "100px" }}
                                            />
                                            <IconButton
                                                sx={{ ml: 2 }}
                                                onClick={() => removeRequirementFromProgram(req.requirement.id, "AND")}
                                            >
                                                <CloseIcon />
                                            </IconButton>
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
                                        <Box key={index} sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                                            <Typography variant="body1" sx={{ flexGrow: 1 }}>
                                                {req.requirement.name}
                                            </Typography>
                                            <TextField
                                                type="number"
                                                label="Score"
                                                variant="outlined"
                                                value={req.score}
                                                onChange={(e) => {
                                                    const updatedReqs = [...programRequirementsOR];
                                                    updatedReqs[index].score = Number(e.target.value);
                                                    setProgramRequirementsOR(updatedReqs);
                                                }}
                                                sx={{ ml: 2, width: "100px" }}
                                            />
                                            <IconButton
                                                sx={{ ml: 2 }}
                                                onClick={() => removeRequirementFromProgram(req.requirement.id, "OR")}
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Right Column: Search Requirements */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6">Search Requirements</Typography>
                            <TextField
                                label="Search"
                                variant="outlined"
                                fullWidth
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Typography variant="h6">Available Requirements</Typography>
                            <Paper sx={{ maxHeight: 300, overflowY: "auto", padding: "8px" }}>
                                {filteredRequirements.map((requirement) => (
                                    <Box
                                        key={requirement.id}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: "8px",
                                            backgroundColor: "#f5f5f5",
                                            border: "1px solid #ddd",
                                            borderRadius: "4px",
                                            padding: "8px",
                                        }}
                                    >
                                        <Typography variant="body1">{requirement.name}</Typography>
                                        <Box>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                sx={{ marginRight: 1 }}
                                                onClick={() => addRequirementToProgram(requirement, "AND")}
                                            >
                                                AND
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => addRequirementToProgram(requirement, "OR")}
                                            >
                                                OR
                                            </Button>
                                        </Box>
                                    </Box>
                                ))}
                            </Paper>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 3 }}>
                Submit Program
            </Button>

            <Button
                variant="contained"
                color="secondary"
                onClick={() => setOpenDialog(true)} // Open the dialog when the button is clicked
                sx={{ mt: 3 }}
            >
                Delete Program
            </Button>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this program? This action cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteClick}
                        color="secondary"
                    >
                        Confirm Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};



export default CreateProgram;
