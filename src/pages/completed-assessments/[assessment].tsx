import * as React from 'react';
import { type NextPage } from "next";
import { useRouter } from 'next/router';
import type { Answer, Assessment, AssessmentQuestion, Engagement, Filter, InterviewGuide, Question, Rating, Reference } from '@prisma/client';
import * as XLSX from 'xlsx';

import { Card, Grid, Typography } from '@mui/material';

import { api } from "~/utils/api";
import Layout from "~/components/Layout/Layout";
import QuestionsSidebar from '~/components/Question/QuestionsSidebar';
import ChangelogTable from '~/components/Common/ChangelogTable';

const CompletedAssessment: NextPage = () => {

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
                answer: Answer | null;
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
        setQuestion(questions && questions[0] ? questions[0].question.id : -1)
    }, [questions])

    const selectedAssessmentQuestion = data?.assessment_questions.find(o => o.question.id == question);
    const questionRef = selectedAssessmentQuestion?.question;
    const ratings = api.rating.getByQuestionFilter.useQuery({ questionId: questionRef?.id, filterId: selectedAssessmentQuestion?.filter_id ?? undefined }).data;
    const guide = api.interviewGuide.getByQuestionId.useQuery({ id: questionRef?.id }).data;
    const references = api.reference.getByQuestionId.useQuery({ id: questionRef?.id }).data
    const changelog = api.changelog.getAllByAssessmentQuestion.useQuery(selectedAssessmentQuestion?.id).data;
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
                    masterObjects.push({
                        'Firm': o.site.name,
                        'Assessor': '',
                        'Question Number': q.question.number,
                        'Pillar': q.question.pillar,
                        'Practice Area': q.question.practice_area,
                        'Topic': q.question.topic_area,
                        'Question': q.question.question,
                        'Rating': q.answer?.assessor_rating,
                        'Rationale': q.answer?.assessor_explanation,
                        'Improvement Suggestion': q.answer?.assessor_evidence,
                    })
                    dashboardObjects.push({
                        topic: q.question.topic_area,
                        rating: q.answer?.assessor_rating,
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

    return (
        <Layout active='completed-assessments'>
            <div className='assessment'>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        {questions &&
                            <QuestionsSidebar
                                questions={questions.map(o => convertToQuestion(o.question))}
                                question={question}
                                setQuestion={setQuestion}
                                exportAssessment={exportCompleted}
                            />
                        }
                    </Grid>
                    {selectedAssessmentQuestion &&
                        <Grid item xs={10} container spacing={2}>
                            <Grid item xs={12}>
                                <Card className='context'>
                                    <div>
                                        <Typography>Question #</Typography>
                                        <Typography>{questionRef ? convertToQuestion(questionRef).number : undefined}</Typography>
                                    </div>
                                    <div>
                                        <Typography>Pillar</Typography>
                                        <Typography>{questionRef ? convertToQuestion(questionRef).pillar : undefined}</Typography>
                                    </div>
                                    <div>
                                        <Typography>Practice Area</Typography>
                                        <Typography>{questionRef ? convertToQuestion(questionRef).practice_area : undefined}</Typography>
                                    </div>
                                    <div>
                                        <Typography>Topic Area</Typography>
                                        <Typography>{questionRef ? convertToQuestion(questionRef).topic_area : undefined}</Typography>
                                    </div>
                                    <div>
                                        <Typography>Priority</Typography>
                                        <Typography>{questionRef ? convertToQuestion(questionRef).priority : undefined}</Typography>
                                    </div>
                                </Card></Grid>
                            <Grid item xs={6}>
                                <Card className='pre-questions'>
                                    <div>
                                        <Typography>Question Content: {selectedAssessmentQuestion.question.question}</Typography>
                                        <Typography>Hint: {questionRef?.hint}</Typography>
                                        <Typography>Start Time: XYZ</Typography>
                                        <div className='rating'>
                                            {(ratings) &&
                                                <div>
                                                    {ratings.map((r, i) => {
                                                        return (
                                                            <div key={i}>
                                                                <div>Level {r.level_number}: {r.criteria}</div>
                                                                {i !== ratings.length - 1 &&
                                                                    <div>Progression Statement: {r.progression_statement}</div>
                                                                }
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card className='reference'>
                                    <div>
                                        <Typography>Interview Guide</Typography>
                                        {guide?.map((r, i) => {
                                            return (
                                                <div key={i}>
                                                    <span>{i + 1}. {r.interview_question}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div>
                                        <Typography>References</Typography>
                                        {references?.map((r, i) => {
                                            return (
                                                <div key={i}>
                                                    <span>{i + 1}. {r.citation}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                <Card>
                                    <ChangelogTable changelogs={changelog} fileName={`Assessment${data?.id} Question${selectedAssessmentQuestion.id}`} />
                                </Card>
                            </Grid>
                        </Grid>
                    }
                    {question == -1 &&
                        <Grid item xs={10}>
                            <Card>
                                <ChangelogTable changelogs={fullChangelog} fileName={`Assessment${data?.id}`} />
                            </Card>
                        </Grid>
                    }
                </Grid>
            </div>
        </Layout>
    );
};

export default CompletedAssessment;