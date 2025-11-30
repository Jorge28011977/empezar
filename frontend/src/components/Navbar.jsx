import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Build as MachinesIcon,
    People as TechniciansIcon,
    CalendarToday as CalendarIcon,
    Assessment as ReportsIcon,
    Settings as SettingsIcon,
    Engineering as MaintenancesIcon,
    Inventory as SparePartsIcon,
    ConfirmationNumber as TicketsIcon,
    Description as TemplatesIcon,
    TrendingUp as PredictiveIcon,
    Gavel as ComplianceIcon,
    Timeline as SLAIcon,
    AccountBalance as BankingIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Máquinas', icon: <MachinesIcon />, path: '/machines' },
        { text: 'Técnicos', icon: <TechniciansIcon />, path: '/technicians' },
        { text: 'Mantenimientos', icon: <MaintenancesIcon />, path: '/maintenances' },
        { text: 'Repuestos', icon: <SparePartsIcon />, path: '/spare-parts' },
        { text: 'Calendario', icon: <CalendarIcon />, path: '/calendar' },
        { text: 'Tickets', icon: <TicketsIcon />, path: '/tickets' },
        { text: 'Plantillas', icon: <TemplatesIcon />, path: '/templates' },
        { text: 'IA Predictiva', icon: <PredictiveIcon />, path: '/predictive-maintenance' },
        { text: 'Cumplimiento', icon: <ComplianceIcon />, path: '/compliance-dashboard' },
        { text: 'Métricas SLA', icon: <SLAIcon />, path: '/sla-metrics' },
        { text: 'Core Banking', icon: <BankingIcon />, path: '/core-banking' },
        { text: 'Reportes', icon: <ReportsIcon />, path: '/reports' },
    ];

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleMenuClick = (path) => {
        navigate(path);
        if (isMobile) {
            setDrawerOpen(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const drawer = (
        <Box sx={{ width: 250 }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" component="div">
                    SGM Bancario
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {user?.email}
                </Typography>
            </Box>
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.path} disablePadding>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => handleMenuClick(item.path)}
                        >
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Cerrar Sesión" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Sistema de Gestión de Mantenimiento
                    </Typography>
                    {!isMobile && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {menuItems.slice(0, 5).map((item) => (
                                <Button
                                    key={item.path}
                                    color="inherit"
                                    startIcon={item.icon}
                                    onClick={() => handleMenuClick(item.path)}
                                    sx={{
                                        backgroundColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                                    }}
                                >
                                    {item.text}
                                </Button>
                            ))}
                            <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
                                Salir
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            <Drawer
                variant={isMobile ? 'temporary' : 'permanent'}
                open={isMobile ? drawerOpen : true}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    width: isMobile ? 0 : 250,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 250,
                        boxSizing: 'border-box',
                        top: 64, // Height of AppBar
                        height: 'calc(100% - 64px)',
                    },
                }}
            >
                {drawer}
            </Drawer>

            {/* Main content spacer */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    ml: isMobile ? 0 : '250px',
                    mt: '64px', // Height of AppBar
                    transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                {/* Content will be rendered here by React Router */}
            </Box>
        </>
    );
};

export default Navbar;