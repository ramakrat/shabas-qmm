import * as React from 'react';
import { type NextPage } from "next";
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import type {
    Answer, Assessment, AssessmentQuestion, Engagement, Filter,
    InterviewGuide, Question, Rating, Reference
} from '@prisma/client';

import * as XLSX from 'xlsx';
import { Card, Grid, Typography } from '@mui/material';

import { api } from "~/utils/api";
import Layout from "~/components/Layout/Layout";
import ChangelogTable from '~/components/Table/ChangelogTable';
import QuestionsSidebar from '~/components/Assessment/QuestionsSidebar';
import PriorityIndicator from "~/components/Question/PriorityIndicator";
import { convertAnswersTableData, leadAnswersColumns, oversightAnswersColumns, answersColumns } from '~/components/Assessment/AssessmentForm';
import BrowseTable from '~/components/Table/BrowseTable';

const CompletedAssessment: NextPage = () => {

    const { data: session } = useSession();

    const { assessment } = useRouter().query;

    // =========== Retrieve Form Context ===========

    const data = api.assessment.getByIdIncludeAssessor.useQuery({ id: Number(assessment) }).data as (
        Assessment & {
            engagement: Engagement;
            assessment_questions: (AssessmentQuestion & {
                question: Question & {
                    ratings: Rating[];
                    references: Reference[];
                    interview_guides: InterviewGuide[];
                };
                filter: Filter | null;
                answers: Answer[];
            })[];
        }
    );

    const convertToQuestion = (object: (Question & {
        Rating?: Rating[];
        Reference?: Reference[];
        InterviewGuide?: InterviewGuide[];
    })) => {
        const q = object;
        delete q.Rating;
        delete q.InterviewGuide;
        delete q.Reference;
        return q as Question;
    }


    const questions = data?.assessment_questions;

    const [question, setQuestion] = React.useState<number>(questions && questions[0] ? questions[0].question.id : -1);

    React.useEffect(() => {
        setQuestion(questions && questions[0] ? questions[0].question.id : -2)
    }, [questions])

    const selectedAssessmentQuestion = data?.assessment_questions.find(o => o.question.id == question);
    const questionRef = selectedAssessmentQuestion?.question;
    const ratings = api.rating.getByQuestionFilter.useQuery({ questionId: questionRef?.id, filterId: selectedAssessmentQuestion?.filter_id ?? undefined }).data;
    const guide = api.interviewGuide.getByQuestionId.useQuery({ id: questionRef?.id }).data;
    const references = api.reference.getByQuestionId.useQuery({ id: questionRef?.id }).data
    const fullChangelog = api.changelog.getAllByAssessment.useQuery(data?.id).data;



    // =========== Export Management ===========

    const exportData = api.assessment.getByIdExport.useQuery(data?.id).data;

    const exportCompleted = () => {
        if (exportData) {

            const masterObjects: any[] = [];
            const dashboardObjects: { topic: string, rating?: string | null }[] = [];
            const dashboardAveraged: any[] = [];

            exportData.forEach(o => {
                o.assessment_questions.forEach(q => {
                    q.answers.forEach(a => {
                        masterObjects.push({
                            'Firm': o.site.name,
                            'Assessor': a.user?.first_name + ' ' + a.user?.last_name,
                            'Question Number': q.question.number,
                            'Pillar': q.question.pillar,
                            'Practice Area': q.question.practice_area,
                            'Topic': q.question.topic_area,
                            'Question': q.question.question,
                            'Rating': a.rating,
                            'Rationale': a.rationale,
                            'Notes': a.notes,
                        })
                        dashboardObjects.push({
                            topic: q.question.topic_area,
                            rating: a.rating,
                        })
                    })
                })
            })

            let averageSum = 0;
            const topics = [...new Set(dashboardObjects.map(o => o.topic))];
            topics.forEach(t => {
                let ratingSum = 0;
                let ratingCount = 0;
                dashboardObjects.forEach(o => {
                    if (o.topic == t) {
                        ratingSum = ratingSum + Number(o.rating);
                        ratingCount++;
                    }
                });
                const ratingAverage = ratingSum / ratingCount;
                dashboardAveraged.push({
                    'Topic': t,
                    'Rating (Average)': ratingAverage,
                })
                averageSum = averageSum + ratingAverage;
            })

            dashboardAveraged.push({
                'Topic': 'Grand Total',
                'Rating (Average)': averageSum / topics.length,
            })


            const filename = 'Shabas Completed Assessments ' + new Date().toLocaleDateString('fr-CA') + '.xlsx';

            const sheet1 = XLSX.utils.aoa_to_sheet([['Confidentiality Notice: The information contained in this document may be legally privileged and confidential. This document may contain company confidential and/or sensitive data pertaining to the FDA QMM Pilot initiative and is for discussion purposes only.  If you are not an intended recipient, you are hereby notified that any dissemination, distribution or copying of this report in whole or in part is strictly prohibited. You should not retain, copy, or use this document for any purpose, nor disclose all or any part of the contents to any other person. Thank you. ']]);
            const sheet2 = XLSX.utils.json_to_sheet(masterObjects);
            const sheet3 = XLSX.utils.json_to_sheet(dashboardAveraged);

            const book = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(book, sheet1, "Confidentiality Notice");
            XLSX.utils.book_append_sheet(book, sheet2, 'Master');
            XLSX.utils.book_append_sheet(book, sheet3, 'Dashboard');

            XLSX.writeFile(book, filename, { bookType: 'xlsx' });
        }
    }

    if (data && data.status != 'completed') {
        return (
            <Layout active='completed-assessments' session={session} requiredRoles={['ADMIN']}>
                <div className='not-found'>
                    <span>404</span>
                    <span>Page Not Found</span>
                </div>
            </Layout>
        )
    }
    return (
        <Layout active='completed-assessments' session={session} requiredRoles={['ADMIN']}>
            <div className='assessment'>
                {questions &&
                    <QuestionsSidebar
                        assessmentId={assessment?.toString() ?? ''}
                        questions={questions.map(o => convertToQuestion(o.question))}
                        question={question}
                        setQuestion={setQuestion}
                        exportAssessment={exportCompleted}
                        assessmentChangelogs={() => { setQuestion(-1) }}
                    />
                }
                <div className='assessment-content'>
                    <Card className='context'>
                        <div className='question-number'>
                            <Typography>Question # :</Typography>
                            <Typography>{questionRef ? convertToQuestion(questionRef).number : undefined}</Typography>
                        </div>
                    </Card>
                    <div className='assessment-form'>
                        <Grid container spacing={2}>
                            {selectedAssessmentQuestion &&
                                <>
                                    <Grid item xs={6}>
                                        <Card className='question-content'>
                                            <div className='widget-header'>General</div>
                                            <div className='widget-body information-list'>
                                                <div>
                                                    <Typography>Question Content:</Typography>
                                                    <Typography>{selectedAssessmentQuestion.question.question}</Typography>
                                                </div>
                                                <div>
                                                    <Typography>Hint:</Typography>
                                                    <Typography>{questionRef?.hint}</Typography>
                                                </div>
                                            </div>
                                            <div className='widget-sub-header'>
                                                <div className='rating-input'>
                                                    <Typography>Rating:</Typography>
                                                </div>
                                            </div>
                                            {ratings &&
                                                <div className='widget-body information-list'>
                                                    <div>
                                                        <Typography>Level 1:</Typography>
                                                        <Typography>{ratings.criteria_1}</Typography>
                                                    </div>
                                                    <div>
                                                        <Typography>Progression Statement:</Typography>
                                                        <Typography>{ratings.progression_statement_1}</Typography>
                                                    </div>
                                                    <div>
                                                        <Typography>Level 2:</Typography>
                                                        <Typography>{ratings.criteria_2}</Typography>
                                                    </div>
                                                    <div>
                                                        <Typography>Progression Statement:</Typography>
                                                        <Typography>{ratings.progression_statement_2}</Typography>
                                                    </div>
                                                    <div>
                                                        <Typography>Level 3:</Typography>
                                                        <Typography>{ratings.criteria_3}</Typography>
                                                    </div>
                                                    <div>
                                                        <Typography>Progression Statement:</Typography>
                                                        <Typography>{ratings.progression_statement_3}</Typography>
                                                    </div>
                                                    <div>
                                                        <Typography>Level 4:</Typography>
                                                        <Typography>{ratings.criteria_4}</Typography>
                                                    </div>
                                                    <div>
                                                        <Typography>Progression Statement:</Typography>
                                                        <Typography>{ratings.progression_statement_4}</Typography>
                                                    </div>
                                                    <div>
                                                        <Typography>Level 5:</Typography>
                                                        <Typography>{ratings.criteria_5}</Typography>
                                                    </div>
                                                </div>
                                            }
                                        </Card>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card className='reference'>
                                            <div className='widget-header'>Question Information</div>
                                            <div className='widget-body information-list'>
                                                <div>
                                                    <Typography>Pillar:</Typography>
                                                    <Typography>{questionRef ? convertToQuestion(questionRef).pillar : undefined}</Typography>
                                                </div>
                                                <div>
                                                    <Typography>Practice Area:</Typography>
                                                    <Typography>{questionRef ? convertToQuestion(questionRef).practice_area : undefined}</Typography>
                                                </div>
                                                <div>
                                                    <Typography>Topic Area:</Typography>
                                                    <Typography>{questionRef ? convertToQuestion(questionRef).topic_area : undefined}</Typography>
                                                </div>
                                                <div>
                                                    <Typography>Priority:</Typography>
                                                    <Typography>{questionRef ? <PriorityIndicator priority={convertToQuestion(questionRef).priority} /> : undefined}</Typography>
                                                </div>
                                            </div>
                                            <div className='widget-header'>Interview Guide</div>
                                            <div className='widget-body information-list'>
                                                {guide?.map((r, i) => {
                                                    return (
                                                        <div key={i}>
                                                            <Typography>{i + 1}.</Typography>
                                                            <Typography>{r.interview_question}</Typography>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            <div className='widget-header'>References</div>
                                            <div className='widget-body information-list'>
                                                {references?.map((r, i) => {
                                                    return (
                                                        <div key={i}>
                                                            <Typography>{i + 1}.</Typography>
                                                            <Typography>{r.citation}</Typography>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Card className='reference'>
                                            <div className='widget-header'>Assessor Answers (Ongoing)</div>
                                            <div className='widget-table'>
                                                <BrowseTable
                                                    dataList={convertAnswersTableData(selectedAssessmentQuestion.answers.filter(a => a.status == 'ongoing')) ?? []}
                                                    tableInfoColumns={answersColumns}
                                                />
                                            </div>
                                            <div className='widget-header'>Lead Assessor Answers (Ongoing Review)</div>
                                            <div className='widget-table'>
                                                <BrowseTable
                                                    dataList={convertAnswersTableData(selectedAssessmentQuestion.answers.filter(a => a.status == 'ongoing-review')) ?? []}
                                                    tableInfoColumns={leadAnswersColumns}
                                                />
                                            </div>
                                            <div className='widget-header'>Oversight Assessor Answers (Oversight)</div>
                                            <div className='widget-table'>
                                                <BrowseTable
                                                    dataList={convertAnswersTableData(selectedAssessmentQuestion.answers.filter(a => a.status == 'oversight')) ?? []}
                                                    tableInfoColumns={oversightAnswersColumns}
                                                />
                                            </div>
                                            <div className='widget-header'>Oversight Assessor Answers (Oversight Review)</div>
                                            <div className='widget-table'>
                                                <BrowseTable
                                                    dataList={convertAnswersTableData(selectedAssessmentQuestion.answers.filter(a => a.status == 'oversight')) ?? []}
                                                    tableInfoColumns={oversightAnswersColumns}
                                                />
                                            </div>
                                        </Card>
                                    </Grid>
                                </>
                            }
                            {question == -1 &&
                                <Grid item xs={12}>
                                    <Card>
                                        <div className='widget-header'>Changelog</div>
                                        {fullChangelog && fullChangelog.length > 0 ?
                                            <ChangelogTable changelogs={fullChangelog} fileName={`Assessment${data?.id}`} /> :
                                            <div className='widget-body'>No Changes</div>
                                        }
                                    </Card>
                                </Grid>
                            }
                        </Grid>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CompletedAssessment;