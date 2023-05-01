import * as React from 'react';
import { type NextPage } from "next";
import { useRouter } from 'next/router';
import { Question } from '@prisma/client';

import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';

import { api } from "~/utils/api";
import Layout from "~/components/Layout/Layout";
import QuestionModal from '~/components/Administrator/Question/QuestionModal';
import BrowseTable, { TableColumn } from '~/components/Common/BrowseTable';

interface TableData {
    number: string;
    question: string;
    pillar: React.ReactNode;
    practiceArea: string;
    topicArea: string;
    active: string;
    onClick: any;
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
                newData.push({
                    number: obj.number,
                    question: obj.question,
                    pillar: obj.pillar,
                    practiceArea: obj.practice_area,
                    topicArea: obj.topic_area,
                    active: obj.active ? 'True' : 'False',
                    onClick: () => { void push(`/questions/${obj.id}`) },
                })
            })
            return newData;
        }
    }

    return (
        <>
            <Layout active='questions' admin>
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