// ProgramsList.tsx
import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ProgramCard from "./ProgramCard";
import httpService from "../Services/HttpService";
import { Program, ProgramsResponse } from "../Interface/Interfaces";
import LSS from "../Services/LSS";

const ProgramsList: React.FC = () => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [showCreateProgram, setShowCreateProgram] = useState<boolean>(false);
    const [showCreateProfile, setShowCreateProfile] = useState<boolean>(false); // Fixed state name
    const navigate = useNavigate();

    // Use effect to set the button visibility based on the mode in localStorage
    useEffect(() => {
        const mode = LSS.getItem("mode"); // Getting the mode from localStorage

        if (mode && mode.toLowerCase() === "admin") {
            setShowCreateProgram(true); // Hide the create button for guests
        } else {
            setShowCreateProfile(true)
        }
    }, []); // Empty dependency array to run only once on mount

    // Fetch the programs when the component mounts
    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const response = await httpService.get<ProgramsResponse>("/api/programs");
                setPrograms(response.data.programs); // Set the fetched programs
            } catch (error) {
                console.error("Error fetching programs:", error);
            }
        };

        fetchPrograms();
    }, []); // Empty dependency array to run only once on mount

    // Handler to navigate to the 'create program' page
    const handleCreateProgramClick = () => {
        navigate("/create-program");
    };

    const handleCreateProfile = () => {
        navigate("/profileform");
    };

    return (
        <Box sx={{ p: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
            <Typography variant="h4" gutterBottom>
                Available Programs
            </Typography>

            {/* Conditionally render the 'Create New Program' button */}
            {showCreateProgram && (
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mb: 3 }}
                    onClick={handleCreateProgramClick}
                >
                    Create New Program
                </Button>
            )}

            {showCreateProfile && (
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mb: 3 }}
                    onClick={handleCreateProfile}
                >
                    My Profile
                </Button>
            )}

            <Grid container spacing={3}>
                {programs.map((program) => (
                    <Grid item xs={12} sm={6} md={4} key={program.id}>
                        <ProgramCard program={program} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ProgramsList;
