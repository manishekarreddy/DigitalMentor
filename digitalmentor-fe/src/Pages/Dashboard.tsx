import React from 'react';
import { Box, Typography } from '@mui/material';
import HeaderPanel from './HeaderPanel'; // Adjust the import path as needed
import ProgramsList from '../Components/ProgramsList';


const Dashboard: React.FC = () => {
    return (
        <Box>
            {/* Include the Header Panel */}
            <HeaderPanel />

            {/* Main content of the dashboard */}
            <Box sx={{ p: 4 }}>
                <ProgramsList />
            </Box>
        </Box>
    );
};

export default Dashboard;
