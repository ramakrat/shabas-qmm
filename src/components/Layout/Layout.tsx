import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { Button, Card, IconButton, Menu, MenuItem, useMediaQuery } from '@mui/material';
import { KeyboardArrowDown, MenuSharp, Settings } from '@mui/icons-material';
import { api } from '~/utils/api';
import { underscoreToTitle } from '~/utils/utils';
import logo from './logo.png';

interface Props {
    session: Session | null;
    requiredRoles?: string[];
    active?: string;
    children?: React.ReactNode;
    accessDenied?: boolean;
}

export const Layout: React.FC<Props> = (props) => {

    const { active, children, session, requiredRoles, accessDenied } = props;

    const router = useRouter();

    const [userAnchorEl, setUserAnchorEl] = React.useState<null | HTMLElement>(null);
    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const userOpen = Boolean(userAnchorEl);
    const menuOpen = Boolean(menuAnchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>, type: string) => {
        if (type == 'user') setUserAnchorEl(event.currentTarget);
        if (type == 'menu') setMenuAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setUserAnchorEl(null);
        setMenuAnchorEl(null);
    };
    const handleLogout = async () => {
        signOut();
        await router.push(`/api/auth/signin`);
    }
    const hidden = useMediaQuery('(min-width: 1300px)');

    const permitted = session?.user.role && requiredRoles?.includes(session.user.role) && !accessDenied;

    // TODO: Make dynamic
    const totals = api.shabas.getAdminDashboardObjectTotals.useQuery(true).data;

    const roleNavItems = {
        ADMIN: [{
            link: '/clients',
            active: active == 'clients',
            label: <>
                <span className='label'>Clients</span>
                <span className='count'>{totals?.clients ?? 0}</span>
                <span className='label child-label'>/ Sites</span>
                <span className='count'>{totals?.sites ?? 0}</span>
            </>,
        }, {
            link: '/pocs',
            active: active == 'pocs',
            label: <>
                <span className='label'>POC</span>
                <span className='count'>{totals?.pocs ?? 0}</span>
            </>,
        }, {
            link: '/engagements',
            active: active == 'assessments',
            label: <>
                <span className='label'>Engagements</span>
                <span className='count'>{totals?.engagements ?? 0}</span>
                <span className='label child-label'>/ Assessments</span>
                <span className='count'>{totals?.assessments ?? 0}</span>
            </>,
        }, {
            link: '/questions',
            active: active == 'questions',
            label: <>
                <span className='label'>Question</span>
                <span className='count'>{totals?.questions ?? 0}</span>
            </>,
        }, {
            link: '/assessments/completed',
            active: active == 'completed-assessments',
            label: <span className='label'>Completed Assessments</span>,
        }],
        ASSESSOR: [{
            link: '/assessments/ongoing',
            active: active == 'ongoing-assessments',
            label: <span className='label'>Ongoing Assessments</span>,
        }],
        LEAD_ASSESSOR: [{
            link: '/assessments/ongoing',
            active: active == 'ongoing-assessments',
            label: <span className='label'>Ongoing Assessments</span>,
        }, {
            link: '/assessments/ongoing-review',
            active: active == 'review-ongoing-assessments',
            label: <span className='label'>Review Ongoing Assessments</span>,
        }, {
            link: '/assessments/oversight-review',
            active: active == 'review-oversight-assessments',
            label: <span className='label'>Review Oversight Assessments</span>,
        }],
        OVERSIGHT_ASSESSOR: [{
            link: '/assessments/oversight',
            active: active == 'oversight-assessments',
            label: <span className='label'>Oversight Assessments</span>,
        }],
    }

    const userFeatures = () => {
        return (<>
            {session?.user.name ?
                <Button onClick={(event) => handleClick(event, 'user')} className='user-button'>
                    <div className='user-name'>
                        <span>{session.user.name}</span>
                        <span>{underscoreToTitle(session.user.role)}</span>
                    </div>
                    <KeyboardArrowDown />
                </Button> :
                <IconButton onClick={(event) => handleClick(event, 'user')}>
                    <Settings />
                </IconButton>
            }
            <Menu
                anchorEl={userAnchorEl}
                open={userOpen}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>Reset Password</MenuItem>
                {session?.user.role == 'ADMIN' && <MenuItem onClick={() => { router.push('/management'); handleClose(); }}>User Management</MenuItem>}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </>)
    }


    return (
        <div>
            <Head>
                <title>Shabas QMM</title>
                <meta name="description" content="Shabas QMM" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className='content-body'>
                <div className='header'>
                    <div className='nav-items'>
                        <Link href='/' className='logo'>
                            <Image src={logo} alt={'Shabas Logo'} height={45} />
                        </Link>
                        {(session && hidden) &&
                            roleNavItems[session.user.role].map((o, i) => {
                                return (
                                    <Link key={i} href={o.link} className={'nav-item ' + (o.active ? 'active' : '')}>
                                        {o.label}
                                    </Link>
                                )
                            })
                        }
                    </div>
                    {session ?
                        <div className='quick-access'>
                            {userFeatures()}
                            {!hidden &&
                                <div>
                                    <IconButton onClick={(event) => handleClick(event, 'menu')}>
                                        <MenuSharp />
                                    </IconButton>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={menuAnchorEl}
                                        open={menuOpen}
                                        onClose={handleClose}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                    >
                                        {roleNavItems[session.user.role].map((o, i) => {
                                            return (
                                                <MenuItem key={i}>
                                                    <Link href={o.link} className={'nav-item ' + (o.active ? 'active' : '')}>
                                                        {o.label}
                                                    </Link>
                                                </MenuItem>
                                            )
                                        })}
                                    </Menu>
                                </div>
                            }
                        </div>
                        :
                        <Button onClick={() => router.push(`/api/auth/signin`)} className='user-button'>
                            Login
                        </Button>
                    }
                </div>
                {!session &&
                    <div className='page-message'>
                        <Card>
                            <span className='title'>
                                Welcome to Shabas QMM
                            </span>
                            <span className='subheading'>
                                Login to get started
                            </span>
                        </Card>
                    </div>
                }
                {!permitted &&
                    <div className='page-message'>
                        <span className='title'>
                            Access Denied
                        </span>
                        <span className='subheading'>
                            Contact an administrator if this is unexpected.
                        </span>
                    </div>
                }
                {(session && permitted) && children}
            </main>
        </div>
    )
}

export default Layout;