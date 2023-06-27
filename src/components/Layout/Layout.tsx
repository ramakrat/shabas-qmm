import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import { KeyboardArrowDown, Settings } from '@mui/icons-material';
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

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = async () => {
        signOut();
        await router.push(`/api/auth/signin`);
    }

    const permitted = session?.user.role && requiredRoles?.includes(session.user.role) && !accessDenied;

    // TODO: Make dynamic
    const totalClient = api.client.getTotalCount.useQuery().data;
    const totalSite = api.site.getTotalCount.useQuery(true).data;
    const totalEngagement = api.engagement.getTotalCount.useQuery(true).data;
    const totalAssessment = api.assessment.getTotalCount.useQuery(true).data;
    const totalPOC = api.poc.getTotalCount.useQuery(true).data;
    const totalQuestion = api.question.getTotalCount.useQuery(true).data;


    const getRoleNavItems = (role: string) => {
        if (role == 'ADMIN') {
            return (
                <>
                    <Link href={'/clients'} className={'nav-item ' + (active == 'clients' ? 'active' : '')}>
                        <span className='label'>Clients</span>
                        <span className='count'>{totalClient ?? 0}</span>
                        <span className='label child-label'>/ Sites</span>
                        <span className='count'>{totalSite ?? 0}</span>
                    </Link>
                    <Link href={'/pocs'} className={'nav-item ' + (active == 'pocs' ? 'active' : '')}>
                        <span className='label'>POC</span>
                        <span className='count'>{totalPOC ?? 0}</span>
                    </Link>
                    <Link href={'/engagements'} className={'nav-item ' + (active == 'assessments' ? 'active' : '')}>
                        <span className='label'>Engagements</span>
                        <span className='count'>{totalEngagement ?? 0}</span>
                        <span className='label child-label'>/ Assessments</span>
                        <span className='count'>{totalAssessment ?? 0}</span>
                    </Link>
                    <Link href={'/questions'} className={'nav-item ' + (active == 'questions' ? 'active' : '')}>
                        <span className='label'>Question</span>
                        <span className='count'>{totalQuestion ?? 0}</span>
                    </Link>
                    <Link href={'/assessments/completed'} className={'nav-item ' + (active == 'completed-assessments' ? 'active' : '')}>
                        <span className='label'>
                            Completed Assessments
                        </span>
                    </Link>
                </>
            )
        }
        if (role == 'ASSESSOR') {
            return (
                <Link href={'/assessments/ongoing'} className={'nav-item ' + (active == 'ongoing-assessments' ? 'active' : '')}>
                    <span className='label'>
                        Ongoing Assessments
                    </span>
                </Link>
            )
        }
        if (role == 'LEAD_ASSESSOR') {
            return (
                <>
                    <Link href={'/assessments/ongoing'} className={'nav-item ' + (active == 'ongoing-assessments' ? 'active' : '')}>
                        <span className='label'>
                            Ongoing Assessments
                        </span>
                    </Link>
                    <Link href={'/assessments/ongoing-review'} className={'nav-item ' + (active == 'review-assessments' ? 'active' : '')}>
                        <span className='label'>
                            Review Ongoing Assessments
                        </span>
                    </Link>
                    <Link href={'/assessments/oversight-review'} className={'nav-item ' + (active == 'review-assessments' ? 'active' : '')}>
                        <span className='label'>
                            Review Oversight Assessments
                        </span>
                    </Link>
                </>
            )
        }
        if (role == 'OVERSIGHT_ASSESSOR') {
            return (
                <Link href={'/assessments/oversight'} className={'nav-item ' + (active == 'oversight-assessments' ? 'active' : '')}>
                    <span className='label'>
                        Oversight Assessments
                    </span>
                </Link>
            )
        }
        return undefined;
    }

    const userFeatures = (
        <>
            {session?.user.name ?
                <Button onClick={handleClick} className='user-button'>
                    <div className='user-name'>
                        <span>{session.user.name}</span>
                        <span>{underscoreToTitle(session.user.role)}</span>
                    </div>
                    <KeyboardArrowDown />
                </Button> :
                <IconButton onClick={handleClick}>
                    <Settings />
                </IconButton>
            }
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>Reset Password</MenuItem>
                {session?.user.role == 'ADMIN' && <MenuItem onClick={() => { router.push('/management'); handleClose(); }}>User Management</MenuItem>}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </>

    )

    if (!permitted) {
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
                            {session && getRoleNavItems(session.user.role)}
                        </div>
                        {userFeatures}
                    </div>
                    <div className='page-message'>
                        <span className='title'>
                            Access Denied
                        </span>
                        <span className='subheading'>
                            Contact an administrator if this is unexpected.
                        </span>
                    </div>
                </main>
            </div>
        )
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
                        {getRoleNavItems(session.user.role)}
                    </div>
                    {userFeatures}
                </div>
                {children}
            </main>
        </div>
    )
}

export default Layout;