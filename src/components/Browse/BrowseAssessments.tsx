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

const BrowseAssessments: React.FC<Props> = (props) => {

    // const { engagementModal, setEngagementModal, assessmentModal, setAssessmentModal } = props;

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

    type SecondaryFilters = 'ongoing' | 'assessor-review' | 'oversight' | 'client-review' | 'completed';
    const [secondaryFilter, setSecondaryFilter] = React.useState<SecondaryFilters>('ongoing');

    // TODO: Don't run query unless modal closed
    const { data } = api.engagement.getAllInclude.useQuery([engagementModal, assessmentModal]);

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
            <div className='filters'>
                <div className='filter' onClick={() => setSecondaryFilter('ongoing')}>
                    <span className={secondaryFilter == 'ongoing' ? 'label active' : 'label'}>Ongoing</span>
                    <span className='count'>4</span>
                </div>
                <div className='filter' onClick={() => setSecondaryFilter('assessor-review')}>
                    <span className={secondaryFilter == 'assessor-review' ? 'label active' : 'label'}>Assessor Review</span>
                    <span className='count'>1</span>
                </div>
                <div className='filter' onClick={() => setSecondaryFilter('oversight')}>
                    <span className={secondaryFilter == 'oversight' ? 'label active' : 'label'}>Oversight</span>
                    <span className='count'>15</span>
                </div>
                <div className='filter' onClick={() => setSecondaryFilter('client-review')}>
                    <span className={secondaryFilter == 'client-review' ? 'label active' : 'label'}>Client Review</span>
                    <span className='count'>4</span>
                </div>
                <div className='filter' onClick={() => setSecondaryFilter('completed')}>
                    <span className={secondaryFilter == 'completed' ? 'label active' : 'label'}>Completed</span>
                    <span className='count'>15</span>
                </div>
            </div>
            {data && data.map((e, i) => {
                const existingClientPoc = e.EngagementPOC.find(o => o.poc.client_id);
                const existingShabasPoc = e.EngagementPOC.find(o => !o.poc.client_id);
                return (
                    <Accordion key={i}>
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