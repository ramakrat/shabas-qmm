import * as React from 'react';
import { type NextPage } from "next";
import { useRouter } from 'next/router';
import type { Answer, Assessment, AssessmentQuestion, Filter, InterviewGuide, Question, Rating, Reference } from '@prisma/client';

import { Button, Card, Grid, TextField, Typography } from '@mui/material';
import { Info } from '@mui/icons-material';

import { api } from "~/utils/api";
import Layout from "~/components/Layout/Layout";
import QuestionsSidebar from '~/components/Assessment/QuestionsSidebar';
import QuestionContext from '~/components/Assessment/QuestionContext';

const ReviewAssessment: NextPage = () => {

    const { assessment } = useRouter().query;

    // =========== Retrieve Form Context ===========

    const data = api.assessment.getByIdIncludeAssessor.useQuery({ id: Number(assessment) }).data as (
        Assessment & {
            AssessmentQuestion: (AssessmentQuestion & {
                question: Question & {
                    Rating: Rating[];
                    Reference: Reference[];
                    InterviewGuide: InterviewGuide[];
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

    const allQuestions = data?.AssessmentQuestion.slice();

    const questions = allQuestions && allQuestions.map(o => { return convertToQuestion(o.question) });

    const [question, setQuestion] = React.useState<number>(questions && questions[0] ? questions[0].id : -1);

    const selectedAssessmentQuestion = allQuestions && allQuestions.find(o => o.id == question);
    const questionRef = allQuestions && selectedAssessmentQuestion?.question;
    const ratings = api.rating.getByQuestionFilter.useQuery({ questionId: questionRef?.id, filterId: selectedAssessmentQuestion?.filter_id ?? undefined }).data;
    const guide = api.interviewGuide.getByQuestionId.useQuery({ id: questionRef?.id }).data;
    const references = api.reference.getByQuestionId.useQuery({ id: questionRef?.id }).data

    // =========== Input Field States ===========

    const [showRating, setShowRating] = React.useState<boolean>(false);

    const [rating, setRating] = React.useState<string>('');
    const [rationale, setRationale] = React.useState<string>('');
    const [notes, setNotes] = React.useState<string>('');

    React.useEffect(() => {
        if (selectedAssessmentQuestion) {
            setRating(selectedAssessmentQuestion.answer?.consensus_rating ?? '');
            setRationale(selectedAssessmentQuestion.answer?.consensus_explanation ?? '');
            setNotes(selectedAssessmentQuestion.answer?.consensus_evidence ?? '');
        } else {
            setRating('');
            setRationale('');
            setNotes('');
        }
    }, [selectedAssessmentQuestion])


    // =========== Submission Management ===========

    const create = api.answer.create.useMutation();
    const update = api.answer.update.useMutation();

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (selectedAssessmentQuestion && selectedAssessmentQuestion.answer) {
            update.mutate({
                id: selectedAssessmentQuestion.answer.id,
                assessment_question_id: data.id,
                consensus_rating: rating,
                consensus_explanation: rationale,
                consensus_evidence: notes,
            })
        } else {
            create.mutate({
                assessment_question_id: data.id,
                consensus_rating: rating,
                consensus_explanation: rationale,
                consensus_evidence: notes,
            })
        }
    }

    return (
        <Layout active='review-assessments'>
            <div className='assessment'>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        {questions && <QuestionsSidebar questions={questions} question={question} setQuestion={setQuestion} />}
                    </Grid>
                    <Grid item xs={10} container spacing={2}>
                        <Grid item xs={12}>
                            <QuestionContext question={questionRef && convertToQuestion(questionRef)} />
                        </Grid>
                        <Grid item xs={8}>
                            <form onSubmit={handleSubmit}>
                                <Card className='pre-questions'>
                                    <div>
                                        <Typography>Hint: {questionRef?.hint}</Typography>
                                        <Typography>Start Time: XYZ</Typography>
                                        <div className='rating'>
                                            <div className='rating-input'>
                                                <Typography>Rating</Typography>
                                                <Info fontSize='small' onClick={() => setShowRating(!showRating)} />
                                                <TextField
                                                    name='rating' label='' size='small'
                                                    value={rating}
                                                    onChange={e => setRating(e.target.value)}
                                                />
                                            </div>
                                            {(showRating && ratings) &&
                                                ratings.map((r, i) => {
                                                    return (
                                                        <div key={i}>
                                                            <div>Level {r.level_number}: {r.criteria}</div>
                                                            {i !== ratings.length - 1 &&
                                                                <div>Progression Statement: {r.progression_statement}</div>
                                                            }
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </Card>
                                <Card className='question-content'>
                                    <Typography>Rationale</Typography>
                                    <TextField
                                        name='rationale' label='' size='small' multiline
                                        value={rationale}
                                        onChange={e => setRationale(e.target.value)}
                                    />
                                    <Typography>Notes</Typography>
                                    <TextField
                                        name='notes' label='' size='small' multiline
                                        value={notes}
                                        onChange={e => setNotes(e.target.value)}
                                    />
                                </Card>
                                <Card className='actions simple'>
                                    <Button variant='contained' type='submit'>Save</Button>
                                </Card>
                            </form>
                        </Grid>
                        <Grid item xs={4}>
                            <Card className='reference'>
                                <div>
                                    <Typography>Reference Questions</Typography>
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
                    </Grid>
                </Grid>
            </div>
        </Layout>
    );
};

export default ReviewAssessment;