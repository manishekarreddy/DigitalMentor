import React, { useState } from 'react';
import {
    Box,
    Grid,
    TextField,
    Button,
    Typography,
    LinearProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Card,
    CardContent
} from '@mui/material';

// Mock data for available skills
const availableSkills = ['Java', 'Python', 'Machine Learning', 'Cybersecurity', 'Cloud Computing'];

const MySkills: React.FC = () => {
    // State to manage the list of skills
    const [skills, setSkills] = useState<{ skill: string; percentage: number }[]>([]);
    const [newSkill, setNewSkill] = useState('');
    const [newSkillPercentage, setNewSkillPercentage] = useState<number | ''>('');

    // State for academic scores
    const [academicScores, setAcademicScores] = useState({
        GRE: '',
        TOEFL: ''
    });

    // Function to handle adding a new skill
    const handleAddSkill = () => {
        if (newSkill && newSkillPercentage) {
            setSkills([...skills, { skill: newSkill, percentage: Number(newSkillPercentage) }]);
            setNewSkill('');
            setNewSkillPercentage('');
        }
    };

    // Function to handle academic score updates
    const handleAcademicScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAcademicScores({ ...academicScores, [e.target.name]: e.target.value });
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                My Skills and Academics
            </Typography>

            <Grid container spacing={4}>
                {/* Left Section - Add/Edit Skills (60%) */}
                <Grid item xs={12} md={7}>
                    <Typography variant="h6" gutterBottom>
                        Add or Edit Skills
                    </Typography>
                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                        <InputLabel>Select Skill</InputLabel>
                        <Select
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                        >
                            {availableSkills.map(skill => (
                                <MenuItem key={skill} value={skill}>
                                    {skill}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Skill Proficiency (%)"
                        type="number"
                        value={newSkillPercentage}
                        onChange={(e) => setNewSkillPercentage(Number(e.target.value))}
                        sx={{ marginBottom: 2 }}
                    />

                    <Button variant="contained" color="primary" onClick={handleAddSkill} disabled={!newSkill || !newSkillPercentage}>
                        Add Skill
                    </Button>

                    {/* Academics Section */}
                    <Box sx={{ marginTop: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Academic Scores
                        </Typography>
                        <TextField
                            fullWidth
                            label="GRE Score"
                            name="GRE"
                            value={academicScores.GRE}
                            onChange={handleAcademicScoreChange}
                            sx={{ marginBottom: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="TOEFL Score"
                            name="TOEFL"
                            value={academicScores.TOEFL}
                            onChange={handleAcademicScoreChange}
                            sx={{ marginBottom: 2 }}
                        />
                    </Box>
                </Grid>

                {/* Right Section - Display Skills (40%) */}
                <Grid item xs={12} md={5}>
                    <Box sx={{ padding: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            My Skills
                        </Typography>

                        {skills.length > 0 ? (
                            skills.map((skill, index) => (
                                <Card key={index} variant="outlined" sx={{ marginBottom: 2 }}>
                                    <CardContent>
                                        <Typography variant="body1">{skill.skill}</Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={skill.percentage}
                                            sx={{ height: 10, borderRadius: 5, marginTop: 1 }}
                                        />
                                        <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                                            {skill.percentage}%
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Typography variant="body1" color="text.secondary">
                                No skills added yet.
                            </Typography>
                        )}
                    </Box>

                    {/* Academic Scores Section */}
                    <Box sx={{ marginTop: 4, padding: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            Academic Scores
                        </Typography>
                        <Typography variant="body1">GRE: {academicScores.GRE || 'Not entered'}</Typography>
                        <Typography variant="body1">TOEFL: {academicScores.TOEFL || 'Not entered'}</Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MySkills;
