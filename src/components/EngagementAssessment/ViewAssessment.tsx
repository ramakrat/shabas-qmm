import * as React from 'react';
import type { AssessmentQuestion, AssessmentUser, Filter, Question, Rating, User } from '@prisma/client';

import {
    Card, Grid, Typography, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';

import { api } from "~/utils/api";
import { dateInputFormat } from '~/utils/utils';
import StatusChip, { AssessmentStatus } from '~/components/Table/StatusChip';

interface QuestionType {
    id?: number;
    question: (Question & {
        ratings: (Rating & {
            filter: Filter | null;
        })[];
    });
    filterSelection: number;
}

type AssessmentQuestionReturnType = (
    AssessmentQuestion & {
        question: (Question & {
            ratings: (Rating & {
                filter: Filter | null;
            })[];
        });
        filter: Filter | null
    }
);

type AssessmentUserReturnType = (
    AssessmentUser & {
        user: User;
        id?: number;
    }
)

interface FormValues {
    description: string;
    startDate: string;
    endDate: string;
    siteId: string;
    engagementId: string;
    pocId: string;
    leadAssessorId: string;
    oversightAssessorId: string;
}


interface Props {
    data: any;
}

const ViewAssessment: React.FC<Props> = (props) => {

    const { data } = props;


    // =========== Retrieve Form Context ===========


    const oversightAssessor = data?.assessment_users.find((o: { user: { role: string; }; }) => o.user.role == 'OVERSIGHT_ASSESSOR')
    const leadAssessor = data?.assessment_users.find((o: { user: { role: string; }; }) => o.user.role == 'LEAD_ASSESSOR')
    const assessors = data?.assessment_users.filter((o: { user: { role: string; }; }) => o.user.role == 'ASSESSOR')

    return (
        <div className='assessment'>
            <div className='assessment-content'>
                <Card className='context'>
                    <div className='question-number'>
                        <Typography>View Assessment # : </Typography>
                        <Typography>{data.id}</Typography>
                    </div>
                    <div>
                        <StatusChip status={data.status as AssessmentStatus} />
                    </div>
                </Card>
                <div className='assessment-form'>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Card>
                                <div className='widget-header'>General</div>
                                <div className='widget-body information-list'>
                                    <div>
                                        <Typography>Site</Typography>
                                        <Typography>{data.site_id}</Typography>
                                    </div>
                                    <div>
                                        <Typography>Engagement</Typography>
                                        <Typography>{data.engagement_id}</Typography>
                                    </div>
                                    <div>
                                        <Typography>Client POC</Typography>
                                        <Typography>{data.poc_id}</Typography>
                                    </div>
                                    <div>
                                        <Typography>Start Date</Typography>
                                        <Typography>{dateInputFormat(data.start_date, true, true)}</Typography>
                                    </div>
                                    <div>
                                        <Typography>End Date</Typography>
                                        <Typography>{dateInputFormat(data.end_date, true, true)}</Typography>
                                    </div>
                                    <div>
                                        <Typography>Description</Typography>
                                        <Typography>{data.description}</Typography>
                                    </div>
                                </div>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Card>
                                <div className='widget-header'>Assessment Questions</div>
                                <div className='changelog'>
                                    <div className='widget-table'>
                                        <TableContainer component={Paper} className='browse-table'>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell align="center">Question #</TableCell>
                                                        <TableCell align="center">Filter</TableCell>
                                                        <TableCell align="left">Content</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {data.assessment_questions.map((q: { question: { number: string; question: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined; }; filter: { toString: () => string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined; }; }) => {
                                                        return (
                                                            <TableRow
                                                                key={q.question.number}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <TableCell align="center">
                                                                    {q.question.number}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    {q.filter ? q.filter.toString() : 'Standard'}
                                                                </TableCell>
                                                                <TableCell align="left">{q.question.question}</TableCell>
                                                            </TableRow>
                                                        )
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </div>
                                </div>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Card>
                                <div className='widget-header'>Assessors</div>
                                <div className='widget-body widget-form'>
                                    <Typography>Oversight Assessor</Typography>
                                    <div className='input-row read-only'>
                                        <span className='content'>
                                            {oversightAssessor?.user.first_name + ' ' + oversightAssessor?.user.last_name}
                                        </span>
                                    </div>
                                    <Typography>Lead Assessor</Typography>
                                    <div className='input-row read-only'>
                                        <span className='content'>
                                            {leadAssessor?.user.first_name + ' ' + leadAssessor?.user.last_name}
                                        </span>
                                    </div>
                                    <Typography>Assessors</Typography>
                                    {assessors.map((o: { user: { first_name: string; last_name: string; }; }, i: React.Key | null | undefined) => {
                                        return (
                                            <div key={i} className='input-row read-only'>
                                                <span className='content'>
                                                    {o.user.first_name + ' ' + o.user.last_name}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </Card>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>
    )
};

export default ViewAssessment;