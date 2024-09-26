import React, { createContext, useContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface SnackbarQueueItem {
    id: number; // Unique ID for each snackbar
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
}

interface SnackbarContextType {
    showSnackbar: (message: string, severity?: 'success' | 'error' | 'info' | 'warning') => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [snackbars, setSnackbars] = useState<SnackbarQueueItem[]>([]);

    const handleClose = (id: number) => {
        setSnackbars((prev) => prev.filter((snackbar) => snackbar.id !== id)); // Remove the snackbar by its ID
    };

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
        const newSnackbar = {
            id: new Date().getTime(), // Use timestamp for unique ID
            message,
            severity,
        };
        setSnackbars((prev) => [...prev, newSnackbar]); // Add the new snackbar to the list
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            {snackbars.map((snackbar) => (
                <Snackbar
                    key={snackbar.id}
                    open={true}
                    autoHideDuration={6000} // Adjust this for how long each snackbar stays open
                    onClose={() => handleClose(snackbar.id)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    style={{ marginBottom: '8px' }} // Space between stacked snackbars
                >
                    <Alert
                        onClose={() => handleClose(snackbar.id)}
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            ))}
        </SnackbarContext.Provider>
    );
};

// Hook for accessing the snackbar context
export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (context === undefined) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};
