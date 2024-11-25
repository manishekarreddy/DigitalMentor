import React from 'react';
import { Box } from '@mui/material'; // Adjust the import path as needed
import ProgramsList from '../Components/ProgramsList';


const Dashboard: React.FC = () => {
    return (
        <Box>

            {/* Main content of the dashboard */}
            <Box sx={{ p: 4 }}>
                <ProgramsList />
            </Box>
        </Box>
    );
};

export default Dashboard;
