import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Button,
    Box,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LSS from '../Services/LSS';
import AuthService from '../Components/Authentication/AuthService';

const HeaderPanel = () => {

    const authService = new AuthService();
    const navigate = useNavigate();

    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [userName, setUserName] = useState("Guest");

    useEffect(() => {
        const user = LSS.getItem("user");
        if (user) {
            setUserName(user.username);
        }
    }, []);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    const handleSignOut = () => {
        handleMenuClose();
        authService.logout();
    };

    const handleProfileSettings = () => {
        handleMenuClose();
        navigate("/editProfile")
        // authService.logout();
    };

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setDrawerOpen(open);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={toggleDrawer(true)}
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>

                <Drawer
                    anchor="left"
                    open={drawerOpen}
                    onClose={toggleDrawer(false)}
                >
                    <Box
                        sx={{ width: 250 }}
                        role="presentation"
                        onClick={toggleDrawer(false)}
                        onKeyDown={toggleDrawer(false)}
                    >
                        <List>
                            <ListItemButton component={Link} to="/dashboard">
                                <ListItemText primary="Home" />
                            </ListItemButton>

                            <ListItemButton component={Link} to="/requirements">
                                <ListItemText primary="Requirements" />
                            </ListItemButton>

                            <ListItemButton component={Link} to="/stats">
                                <ListItemText primary="Stats" />
                            </ListItemButton>
                        </List>
                    </Box>
                </Drawer>

                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, cursor: "pointer" }}
                    onClick={() => navigate("/dashboard")} // Navigate to the dashboard
                >
                    Program Fit
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ mr: 2 }}>
                        {userName}
                    </Typography>
                    <Avatar alt={userName} src="/broken-image.jpg" sx={{ mr: 2 }} />
                    <Button
                        color="inherit"
                        onClick={handleMenuOpen}
                    >
                        ▼
                    </Button>
                    <Menu
                        anchorEl={menuAnchor}
                        open={Boolean(menuAnchor)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                        <MenuItem onClick={handleProfileSettings}>Profile Se</MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default HeaderPanel;
