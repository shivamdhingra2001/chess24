import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Typography } from '@mui/material';
import TournamentIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TimerIcon from '@mui/icons-material/Timer';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import InfoIcon from '@mui/icons-material/Info';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ProfileMenu from './ProfileMenu';
import MessagesMenu from './MessagesMenu';
import FriendsDialog from './FriendsDialogBox';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 250;

// Mixins for permanent drawer transitions
const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

// Styled DrawerHeader
const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

// Styled AppBar
const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: 'rgb(21 30 27 / var(--tw-bg-opacity, 1))',
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

// Styled Permanent Drawer
const PermanentDrawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': {
            ...openedMixin(theme),
            background: '#202d29',
            color: '#e3e8ee', // subtle off-white for text
        },
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': {
            ...closedMixin(theme),
            background: '#202d29',
            color: '#e3e8ee',
        },
    }),
}));

const items1 = [
    { text: 'Home', icon: <HomeIcon sx={{ color: '#e3e8ee' }} />, link: '/home' },
    { text: 'Play', icon: <TimerIcon sx={{ color: '#e3e8ee' }} />, link: '/play' },
    { text: 'Tournaments', icon: <TournamentIcon sx={{ color: '#f5c361' }} />, link: '/tournaments' },
    { text: 'Learn from the Masters', icon: <SchoolIcon sx={{ color: '#61a0f5' }} />, link: '/learn' },
    { text: 'Your Courses', icon: <VisibilityIcon sx={{ color: '#b761f5' }} />, link: '/watch' },
];

const items2 = [
    { text: 'Contact Us', icon: <ContactMailIcon sx={{ color: '#e3e8ee' }} />, link: '/contact' },
    { text: 'About Us', icon: <InfoIcon sx={{ color: '#61a0f5' }} />, link: '/about' },
    { text: 'Privacy Policy', icon: <PrivacyTipIcon sx={{ color: '#f5c361' }} />, link: '/privacy' },
    { text: 'Feedback', icon: <FeedbackIcon sx={{ color: '#f56161' }} />, link: '/feedback' },
];

export default function MiniDrawer() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);

    // Toggle drawer open/close
    const toggleDrawer = () => {
        setOpen((prev) => !prev);
    };

    // Drawer header as a functional component to ensure re-rendering
    const DrawerHeaderComponent = () => (
        <DrawerHeader>
            <IconButton onClick={toggleDrawer}>
                {open ? <ChevronLeftIcon sx={{ color: 'white' }} /> : <ChevronRightIcon sx={{ color: 'white' }} />}
            </IconButton>
        </DrawerHeader>
    );

    // List rendering helper
    const renderList = (items, closeOnClick = false, isPermanent = false) => (
        items.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                    onClick={() => {
                        navigate(item.link);
                        if (closeOnClick) setOpen(false);
                    }}
                    sx={{
                        minHeight: 48,
                        justifyContent: isPermanent && !open ? 'center' : 'initial',
                        px: 2.5,
                        borderRadius: 2,
                        transition: 'background 0.2s',
                        '&:hover': {
                            backgroundColor: '#232e2b',
                        },
                    }}
                >
                    <ListItemIcon
                        sx={{
                            minWidth: 0,
                            mr: isPermanent && !open ? 'auto' : 3,
                            justifyContent: 'center',
                            color: 'inherit',
                        }}
                    >
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#e3e8ee', letterSpacing: 1 }}>
                                {item.text}
                            </Typography>
                        }
                        sx={{ opacity: isPermanent && !open ? 0 : 1 }}
                    />
                </ListItemButton>
            </ListItem>
        ))
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            {/* AppBar with adjusted z-index and width */}
            <AppBar position="fixed" elevation={2} open={open}>
                <Toolbar>
                    <IconButton
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            display: { xs: open ? 'none' : 'inline-flex', md: open ? 'none' : 'inline-flex' },
                            color: '#e3e8ee',
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box className="flex w-full h-full justify-between items-center">
                        <div className="text-2xl font-bold" style={{ color: '#e3e8ee', letterSpacing: 2 }}>CHESS24</div>
                        <Box className="flex flex-row">
                            <FriendsDialog />
                            <MessagesMenu />
                            <ProfileMenu />
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Permanent drawer for md+ screens */}
            <PermanentDrawer
                variant="permanent"
                open={open}
                sx={{
                    display: { xs: 'none', md: 'block' },
                }}
            >
                <DrawerHeaderComponent />
                <Divider />
                <List>{renderList(items1, false, true)}</List>
                <Divider />
                <List>{renderList(items2, false, true)}</List>
            </PermanentDrawer>

            {/* Temporary drawer for sm and below */}
            <MuiDrawer
                variant="temporary"
                open={open}
                onClose={() => setOpen(false)}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    zIndex: 1500,
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        background: '#202d29',
                        color: 'white',
                        position: 'fixed',
                        zIndex: 1500,
                    },
                }}
            >
                <DrawerHeaderComponent />
                <Divider />
                <List>{renderList(items1, true)}</List>
                <Divider />
                <List>{renderList(items2, true)}</List>
            </MuiDrawer>
        </Box>
    );
}