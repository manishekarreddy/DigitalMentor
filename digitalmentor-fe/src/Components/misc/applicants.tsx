import React, { useState } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    Divider,
    Chip,
} from '@mui/material';

// Mock data for programs
const mockPrograms = [
    { id: 1, name: 'Software Engineering' },
    { id: 2, name: 'Data Science' },
    { id: 3, name: 'Information Systems' },
];

// Type definitions for applications
interface Application {
    id: number;
    name: string;
    status: string;
    skills: Skill[];
    matchingPercent: number; // Add matching percentage
}

// Type definitions for skills
interface Skill {
    name: string;
    level: number; // Skill level (0-100)
}

// Explicit typing for the mockApplications object
const mockApplications: Record<number, Application[]> = {
    1: [
        { id: 1, name: 'Alice Johnson', status: 'Pending', skills: [{ name: 'JavaScript', level: 90 }, { name: 'React', level: 85 }], matchingPercent: 87 },
        { id: 2, name: 'Bob Smith', status: 'Approved', skills: [{ name: 'Python', level: 75 }, { name: 'Data Analysis', level: 80 }], matchingPercent: 78 },
    ],
    2: [
        { id: 3, name: 'Carla Jones', status: 'Rejected', skills: [{ name: 'Machine Learning', level: 70 }, { name: 'Statistics', level: 60 }], matchingPercent: 65 },
        { id: 4, name: 'Daniel White', status: 'Pending', skills: [{ name: 'Data Visualization', level: 80 }, { name: 'R', level: 65 }], matchingPercent: 75 },
    ],
    3: [
        { id: 5, name: 'Ella Davis', status: 'Pending', skills: [{ name: 'Database Management', level: 70 }, { name: 'SQL', level: 85 }], matchingPercent: 78 },
    ],
};

const ProgramApplicationsView: React.FC = () => {
    const [selectedProgram, setSelectedProgram] = useState<number | null>(null);

    // Handle program selection
    const handleProgramClick = (id: number) => {
        setSelectedProgram(id);
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Program Applications Dashboard
            </Typography>

            <Grid container spacing={4}>
                {/* Left Section - Program List */}
                <Grid item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom>
                        Programs
                    </Typography>
                    <List component="nav">
                        {mockPrograms.map((program) => (
                            <ListItem
                                key={program.id}

                                onClick={() => handleProgramClick(program.id)}
                                component="li"
                            >
                                <ListItemText primary={program.name} />
                            </ListItem>
                        ))}
                    </List>
                </Grid>

                {/* Right Section - Application List with Skills */}
                <Grid item xs={12} md={8}>
                    {selectedProgram ? (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Applications for {mockPrograms.find((p) => p.id === selectedProgram)?.name}
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            {mockApplications[selectedProgram]?.length > 0 ? (
                                mockApplications[selectedProgram].map((application) => (
                                    <Card key={application.id} sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Typography variant="h6">
                                                {application.name}
                                            </Typography>
                                            <Chip
                                                label={application.status}
                                                color={
                                                    application.status === 'Approved'
                                                        ? 'success'
                                                        : application.status === 'Rejected'
                                                            ? 'error'
                                                            : 'warning'
                                                }
                                                sx={{ mb: 1 }}
                                            />
                                            <Typography variant="subtitle1" sx={{ mt: 1 }}>
                                                Matching Percentage: {application.matchingPercent}%
                                            </Typography>
                                            <Typography variant="subtitle2" sx={{ mt: 1 }}>
                                                Skills:
                                            </Typography>
                                            {application.skills.map((skill, index) => (
                                                <Chip key={index} label={`${skill.name} (${skill.level}%)`} sx={{ mr: 1, mb: 1 }} />
                                            ))}
                                            <Box sx={{ mt: 2 }}>
                                                <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                                                    Approve
                                                </Button>
                                                <Button variant="outlined" color="secondary">
                                                    Reject
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <Typography variant="body1" color="textSecondary">
                                    No applications for this program.
                                </Typography>
                            )}
                        </Box>
                    ) : (
                        <Typography variant="body1" color="textSecondary">
                            Select a program to view its applications.
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProgramApplicationsView;
