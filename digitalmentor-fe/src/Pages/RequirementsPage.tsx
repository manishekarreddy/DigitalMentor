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
                        <Card
                            key={requirement.id}
                            sx={{
                                mb: 1, // Reduced margin between cards
                                maxWidth: 140, // Smaller width for compact size
                                minWidth: 100, // Adjust minimum width
                                p: 0.5, // Reduced padding inside the card
                                position: "relative", // For delete button positioning
                                border: "1px solid #ddd", // Optional subtle border for compact appearance
                                boxShadow: 1, // Subtle shadow for better integration
                                borderRadius: 1, // Small radius for a sleeker design
                                textAlign: "center",
                            }}
                        >
                            {/* Delete button positioned in the top-right corner */}
                            <IconButton
                                color="secondary"
                                onClick={() => handleDeleteRequirement(requirement.id)}
                                sx={{
                                    position: "absolute",
                                    top: 2, // Closer to the edge for compactness
                                    right: 2,
                                    padding: "1px", // Smaller padding for compact size
                                    fontSize: "14px", // Smaller size for compact look
                                }}
                            >
                                ×
                            </IconButton>

                            {/* Card content */}
                            <CardContent
                                sx={{
                                    padding: "4px", // Reduced padding for content
                                    textAlign: "center",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: "2px", // Smaller gap between items
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: "11px", // Further reduced font size
                                        overflow: "hidden", // Prevent overflow for long names
                                        whiteSpace: "nowrap",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {requirement.name}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "textSecondary",
                                        fontSize: "9px", // Reduced caption size
                                    }}
                                >
                                    {requirement.type}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Grid>

            </Grid>
        </Box>
    );
};

export default RequirementsPage;
