import { type NextPage } from "next";
import { useRouter } from "next/router";
import type { Engagement, POC, Assessment, Client } from "@prisma/client";
import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionSummary, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, AccordionDetails } from "@mui/material";
import { api } from "~/utils/api";
import Layout from "~/components/Layout/Layout";
import { titleCase } from "~/utils/utils";

const OversightAssessments: NextPage = () => {

    const { push } = useRouter();

    // TODO: Don't run query unless modal closed
    const { data } = api.engagement.getAllOversightInclude.useQuery([true, true]);

    return (
        <Layout active='oversight-assessments'>
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
                                                        onClick={() => push(`/ongoing-assessments/${a.id}`)}
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
        </Layout>
    )
}

export default OversightAssessments;