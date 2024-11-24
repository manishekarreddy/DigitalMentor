// src/Components/ProgramCard.tsx
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { Program } from "../Interface/Interfaces";

interface ProgramCardProps {
    program: Program;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
    return (
        <Card
            sx={{
                borderRadius: 2,
                boxShadow: 3,
                transition: "transform 0.3s ease-in-out",
                "&:hover": { transform: "scale(1.03)" },
            }}
        >
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    {program.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    {program.description}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, fontWeight: "bold" }}>
                    Requirements:
                </Typography>
                {program.programRequirements.map((req) => (
                    <Box key={req.id} sx={{ ml: 2, mt: 1 }}>
                        <Typography variant="body2" color="primary">
                            {req.requirement.name} (Score: {req.score})
                        </Typography>
                    </Box>
                ))}
            </CardContent>
        </Card>
    );
};

export default ProgramCard;
