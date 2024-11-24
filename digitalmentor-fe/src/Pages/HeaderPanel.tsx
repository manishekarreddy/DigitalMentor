import React, { useEffect, useState } from 'react';
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

    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [userName, setUserName] = useState("Guest");

    useEffect(() => {
        const user = LSS.getItem("user");
        if (user) {
            setUserName(user.username); // Set userName only when the user is available
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
                            <ListItemButton>
                                <ListItemText primary="Home" />
                            </ListItemButton>

                            <ListItemButton>
                                <ListItemText primary="Requirements" />
                            </ListItemButton>
                        </List>
                    </Box>
                </Drawer>

                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Digital Mentor
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
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default HeaderPanel;
