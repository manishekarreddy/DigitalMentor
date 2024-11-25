// ProgramCard.tsx
import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Chip,
    Box,
    Tooltip,
} from "@mui/material";
import { Program } from "../Interface/Interfaces";

import { useNavigate } from 'react-router-dom';
import LSS from "../Services/LSS";

interface ProgramCardProps {
    program: Program;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {

    const [editProgram, setEditProgram] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        const mode = LSS.getItem("mode"); // Getting the mode from localStorage
        if (mode && mode.toLowerCase() === "admin") {
            setEditProgram(true)
        }
    }, []);


    const handleCardClick = () => {
        // Navigate to '/create-program/:id' where :id is the program's ID
        if (editProgram) {
            navigate(`/create-program/${program.id}`);
        }
    };


    return (
        <Card
            sx={{
                borderRadius: 2,
                boxShadow: 3,
                transition: "transform 0.3s ease-in-out",
                "&:hover": { transform: "scale(1.03)" },
            }}

            onClick={handleCardClick}
        >
            <CardContent>
                <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", textDecoration: "underline" }}
                    gutterBottom
                >
                    {program.name}
                </Typography>
                <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                    sx={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 3,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {program.description}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, fontWeight: "bold" }}>
                    Requirements:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {program.programRequirements.map((req) => (
                        <Tooltip
                            title={req.scoreRanges
                                .map(
                                    (range) =>
                                        `(${range.minScore}-${range.maxScore}, Weight: ${range.weight})`
                                )
                                .join(", ")}
                            key={req.id}
                        >
                            <Chip
                                label={`${req.requirement.name} (${req.condition})`}
                                sx={{
                                    backgroundColor:
                                        req.condition === "AND" ? "lightgreen" : "lightblue",
                                    color: "black",
                                    fontWeight: "bold",
                                }}
                            />
                        </Tooltip>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProgramCard;
