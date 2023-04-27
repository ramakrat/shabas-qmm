import { useRouter } from "next/router";
import type { Engagement, POC, Assessment, Client } from "@prisma/client";
import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionSummary, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, AccordionDetails } from "@mui/material";
import { api } from "~/utils/api";
import { titleCase } from "~/utils/utils";

interface Props {
    status: 'ongoing' | 'assessor-review' | 'oversight' | 'client-review' | 'completed';
}

const BrowseAssessmentForms: React.FC<Props> = (props) => {
    const { status } = props;
    const { push } = useRouter();

    // TODO: Don't run query unless modal closed
    let data: (Engagement & {
        client: Client;
        POC: POC[];
        Assessment: Assessment[];
    })[] | undefined = undefined;
    if (status == 'ongoing')
        data = api.engagement.getAllOngoingInclude.useQuery([true, true]).data;
    if (status == 'assessor-review')
        data = api.engagement.getAllReviewInclude.useQuery([true, true]).data;
    if (status == 'oversight')
        data = api.engagement.getAllOversightInclude.useQuery([true, true]).data;
    if (status == 'completed')
        data = api.engagement.getAllCompletedInclude.useQuery([true, true]).data;


    const handleOnClick = async (id: number) => {
        if (status == 'ongoing')
            await push(`/ongoing-assessments/${id}`);
        if (status == 'assessor-review')
            await push(`/review-assessments/${id}`);
        if (status == 'oversight')
            await push(`/oversight-assessments/${id}`);
        if (status == 'completed')
            await push(`/completed-assessments/${id}`);
    }

    return (
        <div className='dashboard'>
            {data && data.map((e: Engagement & { POC: POC[]; Assessment: Assessment[]; client: Client }, i) => {
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
                                            <TableCell align="left"></TableCell>
                                            <TableCell align="left"></TableCell>
                                            <TableCell align="left">{titleCase(e.status)}</TableCell>
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
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {e.Assessment.map((a: Assessment, i) => {
                                            return (
                                                <TableRow
                                                    key={i}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                                                    onClick={() => handleOnClick(a.id)}
                                                    className='clickable-table-row'
                                                >
                                                    <TableCell align="center">{a.id}</TableCell>
                                                    <TableCell align="left">{a.site_id}</TableCell>
                                                    <TableCell align="left">{a.start_date.toDateString()}</TableCell>
                                                    <TableCell align="left">{a.end_date.toDateString()}</TableCell>
                                                    <TableCell align="left"></TableCell>
                                                    <TableCell align="left"></TableCell>
                                                    <TableCell align="left">{titleCase(a.status)}</TableCell>
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
        </div>
    )
};

export default BrowseAssessmentForms;