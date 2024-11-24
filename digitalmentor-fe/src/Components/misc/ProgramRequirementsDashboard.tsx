import React, { useState } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    Typography,
    Box,
    Grid,
    TextField,
    Button,
    Divider,
} from '@mui/material';

// Mock data for programs
const mockPrograms = [
    { id: 1, name: 'Software Engineering' },
    { id: 2, name: 'Data Science' },
    { id: 3, name: 'Information Systems' },
];

// Mock data for skills
const mockSkills = [
    { id: 1, name: 'JavaScript', required: 70 },
    { id: 2, name: 'Python', required: 80 },
    { id: 3, name: 'SQL', required: 60 },
];

const ProgramSkillsDashboard: React.FC = () => {
    const [selectedProgram, setSelectedProgram] = useState<number | null>(null);

    // Handle program selection
    const handleProgramClick = (id: number) => {
        setSelectedProgram(id);
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Program Skills Dashboard
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

                {/* Right Section - Skill Editing */}
                <Grid item xs={12} md={8}>
                    {selectedProgram ? (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Edit Skills for {mockPrograms.find((p) => p.id === selectedProgram)?.name}
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            {mockSkills.map((skill) => (
                                <Box key={skill.id} sx={{ mb: 2 }}>
                                    <Typography variant="body1">
                                        {skill.name}
                                    </Typography>
                                    <TextField
                                        label="Required Percentage"
                                        defaultValue={skill.required}
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        sx={{ mt: 1, mb: 1 }}
                                    />
                                </Box>
                            ))}
                            <Button variant="contained" color="primary">
                                Save Changes
                            </Button>
                        </Box>
                    ) : (
                        <Typography variant="body1" color="textSecondary">
                            Select a program to edit its skills.
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProgramSkillsDashboard;
