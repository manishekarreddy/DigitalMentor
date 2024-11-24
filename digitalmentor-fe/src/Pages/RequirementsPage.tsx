import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, IconButton, Grid } from '@mui/material';
import { useSnackbar } from "../Services/SnackbarContext";
import httpService from "../Services/HttpService";

// Define the Requirement type
interface Requirement {
    id: number;
    name: string;
    type: string;
}

const RequirementsPage: React.FC = () => {
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [newRequirementName, setNewRequirementName] = useState('');
    const [newRequirementType, setNewRequirementType] = useState('');
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchRequirements = async () => {
            try {
                const response = await httpService.get<{ requirements: Requirement[] }>("/api/requirements/list");
                setRequirements(response.data.requirements); // Typing response correctly
            } catch (error) {
                console.error("Error fetching requirements:", error);
            }
        };

        fetchRequirements();
    }, []);

    const handleCreateRequirement = async () => {
        if (!newRequirementName || !newRequirementType) {
            showSnackbar("Please provide both name and type", "warning");
            return;
        }

        try {
            // Post the new requirement
            const response = await httpService.post<Requirement>("/api/requirements/create", {
                name: newRequirementName,
                type: newRequirementType,
            });

            // Update the requirements state with the new requirement
            setRequirements((prevRequirements) => [...prevRequirements, response.data]);

            showSnackbar("Requirement created successfully", "success");
            setNewRequirementName(""); // Clear input after creating
            setNewRequirementType(""); // Clear input after creating
        } catch (error) {
            console.error("Error creating requirement:", error);
            showSnackbar("Error creating requirement", "error");
        }
    };

    const handleDeleteRequirement = async (id: number) => {
        try {
            await httpService.delete(`/api/requirements/delete/${id}`);
            setRequirements((prevRequirements) =>
                prevRequirements.filter((req) => req.id !== id)
            );
            showSnackbar("Requirement deleted successfully", "success");
        } catch (error) {
            console.error("Error deleting requirement:", error);
            showSnackbar("Error deleting requirement", "error");
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Requirements Management
            </Typography>

            <Grid container spacing={3}>
                {/* Left Section: Requirement Creation */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <TextField
                                label="Requirement Name"
                                variant="outlined"
                                fullWidth
                                value={newRequirementName}
                                onChange={(e) => setNewRequirementName(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Requirement Type"
                                variant="outlined"
                                fullWidth
                                value={newRequirementType}
                                onChange={(e) => setNewRequirementType(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCreateRequirement}
                                sx={{ mt: 2 }}
                            >
                                Create Requirement
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right Section: Existing Requirements List */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                        Existing Requirements
                    </Typography>
                    {requirements.map((requirement) => (
                        <Card key={requirement.id} sx={{ mb: 2, maxWidth: 180, minWidth: 150 }}>
                            <CardContent
                                sx={{
                                    borderRadius: 2,
                                    boxShadow: 3,
                                    transition: "transform 0.3s ease-in-out",
                                    padding: "8px", // Reduced padding for a more compact card
                                    backgroundColor: "transparent", // Make background transparent
                                    cursor: "pointer",
                                    "&:hover": { transform: "scale(1.03)" },
                                    textAlign: "center", // Center the text inside the card
                                }}
                            >
                                <Typography variant="body2" sx={{ fontWeight: 600, marginBottom: "4px", fontSize: "14px" }}>
                                    {requirement.name}
                                </Typography>
                                <Typography variant="caption" color="textSecondary" sx={{ fontSize: "12px", marginBottom: "8px" }}>
                                    {requirement.type}
                                </Typography>
                                <IconButton
                                    color="secondary"
                                    onClick={() => handleDeleteRequirement(requirement.id)}
                                    sx={{ mt: 1 }}
                                >
                                    Delete
                                </IconButton>
                            </CardContent>
                        </Card>
                    ))}
                </Grid>
            </Grid>
        </Box>
    );
};

export default RequirementsPage;
