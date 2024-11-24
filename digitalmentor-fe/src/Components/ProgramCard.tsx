// src/Components/ProgramCard.tsx
import React, { useState } from "react";
import { Card, CardContent, Typography, Box, Chip, IconButton } from "@mui/material";
import { Program } from "../Interface/Interfaces";
import { useNavigate } from 'react-router-dom';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from "@mui/icons-material"

interface ProgramCardProps {
    program: Program;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
    const navigate = useNavigate();
    const [showFullDescription, setShowFullDescription] = useState(false);

    const handleClick = () => {
        navigate(`/create-program/${program.id}`);
    };

    return (
        <Card
            sx={{
                borderRadius: 2,
                boxShadow: 3,
                transition: "transform 0.3s ease-in-out",
                minWidth: "400px",
                maxWidth: "450px",
                minHeight: "300px",
                maxHeight: "300px",
                margin: "10px",
                cursor: "pointer",
                "&:hover": { transform: "scale(1.03)" },
            }}
            onClick={handleClick}
        >
            <CardContent
                sx={{
                    height: "100%",
                    overflowY: "auto", // Enable scrolling if content overflows
                }}
            >
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                        fontWeight: "bold",
                        transition: "color 0.2s, transform 0.2s",
                        cursor: "pointer", // Add cursor pointer for hover effect
                        "&:hover": {
                            color: "primary.main",
                            transform: "scale(1.05)", // Slightly enlarge text on hover
                        },
                    }}
                >
                    {program.name}
                </Typography>

                {/* Collapsible Description */}
                <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                    sx={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: showFullDescription ? "none" : 4, // Show all lines if expanded
                        overflow: showFullDescription ? "visible" : "hidden", // Hide overflow when collapsed
                        textOverflow: "ellipsis",
                        transition: "color 0.2s",
                        cursor: "pointer", // Add cursor pointer for hover effect
                        "&:hover": {
                            color: "text.primary", // Pop out description color
                        },
                    }}
                >
                    {program.description}
                </Typography>
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent card click from triggering
                        setShowFullDescription((prev) => !prev);
                    }}
                    sx={{ padding: 0 }}
                >
                    {showFullDescription ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
                <Typography
                    variant="body1"
                    sx={{
                        mt: 2,
                        fontWeight: "bold",
                        transition: "transform 0.2s, color 0.2s",
                        cursor: "pointer", // Add cursor pointer for hover effect
                        "&:hover": {
                            color: "secondary.main",
                            transform: "scale(1.03)", // Highlight text on hover
                        },
                    }}
                >
                    Requirements:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {program.programRequirements.map((req) => (
                        <Chip
                            key={req.id}
                            label={`${req.requirement.name} (Score: ${req.score})`}
                            sx={{
                                backgroundColor: req.condition === "AND" ? "lightblue" : "lightgreen",
                                color: "black",
                                fontWeight: "bold",
                            }}
                        />
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProgramCard;
