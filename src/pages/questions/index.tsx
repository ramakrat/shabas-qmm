import * as React from 'react';
import { type NextPage } from "next";
import { useRouter } from 'next/router';
import Link from 'next/link';

import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { api } from "~/utils/api";
import Layout from "~/components/Layout/Layout";
import { Add, Edit } from '@mui/icons-material';
import QuestionModal from '~/components/Question/QuestionModal';

const Question: NextPage = () => {

    const { push } = useRouter();
    const [questionModal, setQuestionModal] = React.useState<boolean>(false);

    // const setQuestionSelection = (question: number) => {
    //     // eslint-disable-next-line @typescript-eslint/no-floating-promises
    //     push(`/questions/${question}`);
    // }

    // =========== Retrieve Form Context ===========

    const questions = api.question.getAll.useQuery(true).data;

    return (
        <>
            <Layout active='questions'>
                <div className='dashboard'>
                    <div className='browse-add'>
                        <Button
                            variant='contained'
                            endIcon={<Add />}
                            onClick={() => { setQuestionModal(true) }}
                        >
                            New Question
                        </Button>
                    </div>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Number</TableCell>
                                    <TableCell align="left">Question</TableCell>
                                    <TableCell align="left">Pillar</TableCell>
                                    <TableCell align="left">Practice Area</TableCell>
                                    <TableCell align="left">Topic Area</TableCell>
                                    <TableCell align="left">Active</TableCell>
                                    <TableCell align="center">Edit</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {questions && questions.map((data, i) => {
                                    return (
                                        <TableRow
                                            key={i}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="center">
                                                {data.number}
                                            </TableCell>
                                            <TableCell align="left">
                                                {data.question}
                                            </TableCell>
                                            <TableCell align="left">
                                                {data.pillar}
                                            </TableCell>
                                            <TableCell align="left">
                                                {data.practice_area}
                                            </TableCell>
                                            <TableCell align="left">
                                                {data.topic_area}
                                            </TableCell>
                                            <TableCell align="left">
                                                {data.active ? 'True' : 'False'}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Link href={`/questions/${data.id}`}>
                                                    <IconButton>
                                                        <Edit fontSize='small' />
                                                    </IconButton>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </Layout>
            <QuestionModal open={questionModal} setOpen={setQuestionModal} />
        </>
    );
};

export default Question;