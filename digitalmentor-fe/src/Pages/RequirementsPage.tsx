import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    IconButton,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import { useSnackbar } from "../Services/SnackbarContext";
import httpService from "../Services/HttpService";

// Define the Requirement type
interface Requirement {
    id: number;
    name: string;
    type: string;
}

// Define the available requirement types
const requirementTypes = [
    "Language",
    "Academic",
    "Professional",
    "Technical",
    "Personal",
    "Other",
];

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
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="requirement-type-label">Requirement Type</InputLabel>
                                <Select
                                    labelId="requirement-type-label"
                                    value={newRequirementType}
                                    onChange={(e) => setNewRequirementType(e.target.value)}
                                >
                                    {requirementTypes.map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
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
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", // Up to 3 columns
                            gap: 2, // Spacing between items
                            maxHeight: "400px", // Fixed height for scrollable area
                            overflowY: "auto", // Enable vertical scrolling
                            border: "1px solid #ddd", // Optional border for container
                            borderRadius: 1, // Rounded edges
                            padding: 2, // Inner padding for spacing
                            backgroundColor: "#f9f9f9", // Subtle background color
                        }}
                    >
                        {requirements.map((requirement) => (
                            <Box
                                key={requirement.id}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: 1.5,
                                    backgroundColor: "#ffffff", // Card background
                                    boxShadow: "0px 2px 4px rgba(0,0,0,0.1)", // Subtle shadow
                                    borderRadius: "8px", // Rounded corners
                                    border: "1px solid #e0e0e0", // Border for a clean look
                                }}
                            >
                                {/* Requirement Details */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        flexGrow: 1, // Allow text to take available space
                                        overflow: "hidden", // Prevent overflow of long text
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 600,
                                            overflow: "hidden",
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
                                            fontSize: "12px",
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {requirement.type}
                                    </Typography>
                                </Box>

                                {/* Delete Button */}
                                <IconButton
                                    color="secondary"
                                    onClick={() => handleDeleteRequirement(requirement.id)}
                                    sx={{
                                        marginLeft: 1,
                                        color: "#ff5f5f", // Delete button color
                                        fontSize: "18px", // Slightly larger icon
                                    }}
                                >
                                    ×
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                </Grid>


            </Grid>
        </Box>
    );
};

export default RequirementsPage;
