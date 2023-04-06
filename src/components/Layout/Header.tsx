import * as React from 'react';
import Link from 'next/link';
import { IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { Settings } from '@mui/icons-material';
import type { Tabs } from './Layout';

interface Props {
    active: Tabs;
}

export const Header: React.FC<Props> = (props) => {
    const { active } = props;

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
                <Link href={'/'} className={active == 'dashboard' ? 'active' : ''}>
                    <Typography>
                        Dashboard
                    </Typography>
                </Link>
                <Link href={'/admin-questions'} className={active == 'assessments' ? 'active' : ''}>
                    <Typography>
                        Assessments
                    </Typography>
                </Link>
                <Link href={'/questions/1'} className={active == 'questions' ? 'active' : ''}>
                    <Typography>
                        Questions
                    </Typography>
                </Link>
                <Link href={'/ongoing-assessments'} className={active == 'ongoing-assessments' ? 'active' : ''}>
                    <Typography>
                        Ongoing Assessments
                    </Typography>
                </Link>
                <Link href={'/review-assessments'} className={active == 'review-assessments' ? 'active' : ''}>
                    <Typography>
                        Review Assessments
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