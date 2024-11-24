// src/Components/ProgramsList.tsx
import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import ProgramCard from "./ProgramCard";
import httpService from "../Services/HttpService";
import { Program, ProgramsResponse } from "../Interface/Interfaces";

const ProgramsList: React.FC = () => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const navigate = useNavigate(); // Initialize the navigate function

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const response = await httpService.get<ProgramsResponse>("/api/programs");
                setPrograms(response.data.programs);
            } catch (error) {
                console.error("Error fetching programs:", error);
            }
        };

        fetchPrograms();
    }, []);

    const handleCreateProgramClick = () => {
        navigate("/create-program"); // Navigate to the Create Program page
    };

    return (
        <Box sx={{ p: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
            <Typography variant="h4" gutterBottom>
                Available Programs
            </Typography>
            <Button
                variant="contained"
                color="primary"
                sx={{ mb: 3 }}
                onClick={handleCreateProgramClick} // Handle button click
            >
                Create New Program
            </Button>
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
