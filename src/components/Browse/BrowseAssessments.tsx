import React from "react";
import type { Assessment, Client, Engagement, EngagementPOC, POC } from "@prisma/client";
import {
    Button, IconButton, Accordion, AccordionDetails, AccordionSummary,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import { Add, Edit, ExpandMore } from "@mui/icons-material";
import { api } from "~/utils/api";
import AssessmentModal from "../Modals/AssessmentModal";
import EngagementModal from "../Modals/EngagementModal";
import { titleCase } from "~/utils/utils";

interface Props {
    engagementModal: boolean;
    setEngagementModal: (open: boolean) => void;
    assessmentModal: boolean;
    setAssessmentModal: (open: boolean) => void;
}

const BrowseAssessments: React.FC<Props> = () => {

    // const { engagementModal, setEngagementModal, assessmentModal, setAssessmentModal } = props;


    // ================== Create Management ==================

    const [engagementModal, setEngagementModal] = React.useState<boolean>(false);
    const [assessmentModal, setAssessmentModal] = React.useState<boolean>(false);

    const [engagementData, setEngagementData] = React.useState<Engagement & {
        client: Client;
        POC: POC[];
        EngagementPOC: (EngagementPOC & {
            poc: POC;
        })[];
        Assessment: (Assessment & {
            poc: POC | null;
        })[];
    } | undefined>(undefined);
    const [assessmentData, setAssessmentData] = React.useState<Assessment | undefined>(undefined);


    // ================== Filter Management ==================

    const [createdFilter, setCreatedFilter] = React.useState<boolean>(true);
    const [ongoingFilter, setOngoingFilter] = React.useState<boolean>(true);
    const [assessorReviewFilter, setAssessorReviewFilter] = React.useState<boolean>(true);
    const [oversightFilter, setOversightFilter] = React.useState<boolean>(true);
    const [clientReviewFilter, setClientReviewFilter] = React.useState<boolean>(true);
    const [completedFilter, setCompletedFilter] = React.useState<boolean>(true);

    const filterObject = () => {
        const filters = [];
        if (createdFilter) filters.push({ status: 'created' })
        if (ongoingFilter) filters.push({ status: 'ongoing' })
        if (assessorReviewFilter) filters.push({ status: 'assessor-review' })
        if (oversightFilter) filters.push({ status: 'oversight' })
        if (clientReviewFilter) filters.push({ status: 'client-review' })
        if (completedFilter) filters.push({ status: 'completed' })
        return filters;
    }



    // TODO: Don't run query unless modal closed
    const { data } = api.engagement.getAllInclude.useQuery({
        filters: filterObject(),
        states: [engagementModal, engagementModal]
    });
    const assessmentStatusCounts = api.assessment.getStatusCounts.useQuery(engagementModal).data;


    return (
        <>
            <div className='browse-add'>
                <Button variant='contained' endIcon={<Add />} onClick={() => { setEngagementData(undefined); setEngagementModal(true) }}>
                    New Engagement
                </Button>
                <Button variant='contained' endIcon={<Add />} onClick={() => { setAssessmentData(undefined); setAssessmentModal(true) }}>
                    New Assessment
                </Button>
            </div>
            {assessmentStatusCounts && <div className='filters'>
                <div className='filter' onClick={() => setCreatedFilter(!createdFilter)}>
                    <span className={createdFilter ? 'label active' : 'label'}>Created</span>
                    <span className='count'>{assessmentStatusCounts.created}</span>
                </div>
                <div className='filter' onClick={() => setOngoingFilter(!ongoingFilter)}>
                    <span className={ongoingFilter ? 'label active' : 'label'}>Ongoing</span>
                    <span className='count'>{assessmentStatusCounts.ongoing}</span>
                </div>
                <div className='filter' onClick={() => setAssessorReviewFilter(!assessorReviewFilter)}>
                    <span className={assessorReviewFilter ? 'label active' : 'label'}>Assessor Review</span>
                    <span className='count'>{assessmentStatusCounts.assessorReview}</span>
                </div>
                <div className='filter' onClick={() => setOversightFilter(!oversightFilter)}>
                    <span className={oversightFilter ? 'label active' : 'label'}>Oversight</span>
                    <span className='count'>{assessmentStatusCounts.oversight}</span>
                </div>
                <div className='filter' onClick={() => setClientReviewFilter(!clientReviewFilter)}>
                    <span className={clientReviewFilter ? 'label active' : 'label'}>Client Review</span>
                    <span className='count'>{assessmentStatusCounts.clientReview}</span>
                </div>
                <div className='filter' onClick={() => setCompletedFilter(!completedFilter)}>
                    <span className={completedFilter ? 'label active' : 'label'}>Completed</span>
                    <span className='count'>{assessmentStatusCounts.completed}</span>
                </div>
            </div>}
            {data && data.map((e, i) => {
                const existingClientPoc = e.EngagementPOC.find(o => o.poc.client_id);
                const existingShabasPoc = e.EngagementPOC.find(o => !o.poc.client_id);
                return (
                    <Accordion key={i} defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }} size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Engagement ID</TableCell>
                                            <TableCell align="left">Client</TableCell>
                                            <TableCell align="left">Start Date</TableCell>
                                            <TableCell align="left">End Date</TableCell>
                                            <TableCell align="left">Client POC</TableCell>
                                            <TableCell align="left">Shabas POC</TableCell>
                                            <TableCell align="left">Status</TableCell>
                                            <TableCell align="center">Edit</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow
                                            key={i}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="center">{e.id}</TableCell>
                                            <TableCell align="left">{e.client_id} - {e.client.name}</TableCell>
                                            <TableCell align="left">{e.start_date.toDateString()}</TableCell>
                                            <TableCell align="left">{e.end_date.toDateString()}</TableCell>
                                            <TableCell align="left">{existingClientPoc?.poc.first_name} {existingClientPoc?.poc.last_name}</TableCell>
                                            <TableCell align="left">{existingShabasPoc?.poc.first_name} {existingShabasPoc?.poc.last_name}</TableCell>
                                            <TableCell align="left">{titleCase(e.status)}</TableCell>
                                            <TableCell align="center">
                                                {(e.start_date > new Date() && e.status == 'created') &&
                                                    <IconButton onClick={() => { setEngagementData(e); setEngagementModal(true) }}>
                                                        <Edit fontSize='small' />
                                                    </IconButton>
                                                }
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }} size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Assessment ID</TableCell>
                                            <TableCell align="left">Site</TableCell>
                                            <TableCell align="left">Start Date</TableCell>
                                            <TableCell align="left">End Date</TableCell>
                                            <TableCell align="left">Client POC</TableCell>
                                            <TableCell align="left">Assessors</TableCell>
                                            <TableCell align="left">Status</TableCell>
                                            <TableCell align="center">Edit</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {e.Assessment.map((a, i) => {
                                            return (
                                                <TableRow
                                                    key={i}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="center">{a.id}</TableCell>
                                                    <TableCell align="left">{a.site_id}</TableCell>
                                                    <TableCell align="left">{a.start_date.toDateString()}</TableCell>
                                                    <TableCell align="left">{a.end_date.toDateString()}</TableCell>
                                                    <TableCell align="left">{a.poc && a.poc.first_name + ' ' + a.poc.last_name}</TableCell>
                                                    <TableCell align="left"></TableCell>
                                                    <TableCell align="left">{titleCase(a.status)}</TableCell>
                                                    <TableCell align="center">
                                                        {(a.start_date > new Date() && a.status == 'created') &&
                                                            <IconButton onClick={() => { setAssessmentData(a); setAssessmentModal(true) }}>
                                                                <Edit fontSize='small' />
                                                            </IconButton>
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </AccordionDetails>
                    </Accordion>
                )
            })}
            <EngagementModal open={engagementModal} setOpen={setEngagementModal} data={engagementData} />
            <AssessmentModal open={assessmentModal} setOpen={setAssessmentModal} data={assessmentData} />
        </>
    );
};

export default BrowseAssessments;