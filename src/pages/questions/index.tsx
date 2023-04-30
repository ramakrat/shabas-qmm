import * as React from 'react';
import { type NextPage } from "next";
import Link from 'next/link';

import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { api } from "~/utils/api";
import Layout from "~/components/Layout/Layout";
import { Add, Edit } from '@mui/icons-material';
import QuestionModal from '~/components/Question/QuestionModal';
import BrowseTable from '~/components/Common/BrowseTable';
import type { TableColumn } from '~/components/Common/ExpandableBrowseTable';
import { Question } from '@prisma/client';
import { useRouter } from 'next/router';

interface TableData {
    number: string;
    question: string;
    pillar: React.ReactNode;
    practiceArea: string;
    topicArea: string;
    active: string;
    actions: React.ReactNode;
}

const columns: TableColumn[] = [{
    type: 'number',
    displayValue: 'Number',
    align: 'center',
}, {
    type: 'question',
    displayValue: 'Question',
    align: 'left',
}, {
    type: 'pillar',
    displayValue: 'pillar',
    align: 'left',
}, {
    type: 'practiceArea',
    displayValue: 'Practice Area',
    align: 'left',
}, {
    type: 'topicArea',
    displayValue: 'Topic Area',
    align: 'left',
}, {
    type: 'active',
    displayValue: 'Active',
    align: 'left',
}, {
    type: 'actions',
    displayValue: 'Actions',
    align: 'center',
    format: 'jsx-element',
}];

const Question: NextPage = () => {

    const [questionModal, setQuestionModal] = React.useState<boolean>(false);

    const { push } = useRouter();

    // =========== Retrieve Form Context ===========

    const questions = api.question.getAll.useQuery(true).data;

    const convertTableData = (data?: Question[]) => {
        if (data) {
            const newData: TableData[] = [];
            data.forEach(obj => {
                const actions = (
                    <IconButton onClick={() => { void push(`/questions/${obj.id}`) }}>
                        <Edit fontSize='small' />
                    </IconButton>
                )
                newData.push({
                    number: obj.number,
                    question: obj.question,
                    pillar: obj.pillar,
                    practiceArea: obj.practice_area,
                    topicArea: obj.topic_area,
                    active: obj.active ? 'True' : 'False',
                    actions: actions,
                })
            })
            return newData;
        }
    }

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
                    <BrowseTable
                        dataList={convertTableData(questions) ?? []}
                        tableInfoColumns={columns}
                    />
                </div>
            </Layout>
            <QuestionModal open={questionModal} setOpen={setQuestionModal} />
        </>
    );
};

export default Question;