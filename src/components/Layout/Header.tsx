import * as React from 'react';
import { AppBar, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { Settings } from '@mui/icons-material';
import Link from 'next/link';

export const Header: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className='header'>
            <div className='logo'>
                Shabas Logo
            </div>
            <div className='nav-items'>
                <Link href={'/admin-dashboard'}>
                    <Typography>
                        Dashboard
                    </Typography>
                </Link>
                <Link href={'/admin-assessment'}>
                    <Typography>
                        Assessments
                    </Typography>
                </Link>
                <Typography>
                    Questions
                </Typography>
                <Link href={'/assessor-assessment'}>
                    <Typography>
                        Temporary
                    </Typography>
                </Link>
                <IconButton onClick={handleClick}>
                    <Settings />
                </IconButton>
            </div>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
        </div>
    )
}

export default Header;