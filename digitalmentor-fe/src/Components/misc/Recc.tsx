import React from 'react';
import {
    Box,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Grid,
    LinearProgress,
} from '@mui/material';

// Mock data for courses
const courseData = [
    {
        id: 1,
        name: 'Software Engineering',
        description: 'Learn the principles of software development and design.',
        matchingPercent: 85,
    },
    {
        id: 2,
        name: 'Data Science',
        description: 'Explore data analysis, machine learning, and data visualization.',
        matchingPercent: 90,
    },
    {
        id: 3,
        name: 'Information Systems',
        description: 'Study the design and management of information systems.',
        matchingPercent: 75,
    },
    {
        id: 4,
        name: 'Cybersecurity',
        description: 'Understand how to protect systems and networks from cyber threats.',
        matchingPercent: 80,
    },
    {
        id: 5,
        name: 'Cloud Computing',
        description: 'Discover cloud architecture and services for modern applications.',
        matchingPercent: 95,
    },
];

// Mock data for skills
const skillsData = [
    {
        skill: 'Java',
        percentage: 90,
    },
    {
        skill: 'Python',
        percentage: 85,
    },
    {
        skill: 'Machine Learning',
        percentage: 80,
    },
    {
        skill: 'Cybersecurity',
        percentage: 75,
    },
    {
        skill: 'Cloud Computing',
        percentage: 95,
    },
];

const CourseRecommendations: React.FC = () => {
    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Program Recommendations
            </Typography>

            <Grid container spacing={4}>
                {/* Left Section - Course Recommendations (60%) */}
                <Grid item xs={12} md={7}>
                    {courseData.map(course => (
                        <Card variant="outlined" sx={{ marginBottom: 2 }} key={course.id}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {course.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {course.description}
                                </Typography>
                                <Typography variant="body1" sx={{ marginTop: 2 }}>
                                    Matching Percentage: <strong>{course.matchingPercent}%</strong>
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" variant="contained" color="primary">
                                    Save
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </Grid>

                {/* Right Section - Skills (40%) */}
                <Grid item xs={12} md={5}>
                    <Box sx={{ padding: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            My Skills
                        </Typography>
                        {skillsData.map(skill => (
                            <Box key={skill.skill} sx={{ marginBottom: 2 }}>
                                <Typography variant="body1">{skill.skill}</Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={skill.percentage}
                                    sx={{ height: 10, borderRadius: 5, marginTop: 1 }}
                                />
                                <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                                    {skill.percentage}%
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CourseRecommendations;
