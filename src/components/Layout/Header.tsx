import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { Settings } from '@mui/icons-material';
import logo from './logo.png';

interface Props {
    active: string;
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
            <div className='nav-items'>
                <Link href={'/dashboard/clients'} className='logo'>
                    <Image src={logo} alt={'Shabas Logo'} height={50} />
                </Link>
                <Link href={'/dashboard/clients'} className={active == 'dashboard' ? 'active' : ''}>
                    <Typography>
                        Dashboard
                    </Typography>
                </Link>
                <Link href={'/questions'} className={active == 'questions' ? 'active' : ''}>
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
                <Link href={'/oversight-assessments'} className={active == 'oversight-assessments' ? 'active' : ''}>
                    <Typography>
                        Oversight Assessments
                    </Typography>
                </Link>
                <Link href={'/completed-assessments'} className={active == 'completed-assessments' ? 'active' : ''}>
                    <Typography>
                        Completed Assessments
                    </Typography>
                </Link>
            </div>
            <IconButton onClick={handleClick}>
                <Settings />
            </IconButton>
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