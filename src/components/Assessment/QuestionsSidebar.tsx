import React from "react";
import type { Question } from "@prisma/client";
import { Button, Card, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import QuestionModal from "../Modals/QuestionModal";

interface Props {
    questions: Question[];
    question: number;
    setQuestion: (question: number) => void;
    addOption?: boolean;
    submitAssessment?: () => void;
    resetForm?: () => void;
    assessmentChangelogs?: () => void;
}

const QuestionsSidebar: React.FC<Props> = (props) => {

    const {
        questions,
        question,
        setQuestion,
        addOption,
        submitAssessment,
        resetForm,
        assessmentChangelogs
    } = props;

    const [questionModal, setQuestionModal] = React.useState<boolean>(false);

    return (
        <>
            <Card className='questions-sidebar'>
                {questions.find((o: Question) => o.id == question) &&
                    <div className='question-steppers'>
                        <Button
                            variant='contained'
                            disabled={questions[0] ? (question == questions[0].id) : false}
                            onClick={() => {
                                if (resetForm) resetForm();
                                setQuestion(question - 1);
                            }}
                        >
                            Previous
                        </Button>
                        <Button
                            variant='contained'
                            disabled={questions[questions.length - 1] ? (question == (questions[questions.length - 1] as Question).id) : false}
                            onClick={() => {
                                if (resetForm) resetForm();
                                setQuestion(question + 1);
                            }}
                        >
                            Next
                        </Button>
                    </div>
                }
                {questions.map((o: Question) => {
                    return (
                        <Typography
                            key={o.id}
                            className={o.id == question ? 'active' : ''}
                            onClick={() => {
                                if (resetForm) resetForm();
                                setQuestion(o.id)
                            }}
                        >
                            {o.number}
                        </Typography>
                    )
                })}
                {addOption &&
                    <Button
                        variant='outlined'
                        disabled={question == 7}
                        onClick={() => setQuestionModal(true)}
                        startIcon={<Add />}
                    >
                        Add Question
                    </Button>
                }
                {assessmentChangelogs != undefined &&
                    <Typography
                        className={question == -1 ? 'active' : ''}
                        onClick={assessmentChangelogs}
                    >
                        Changelog
                    </Typography>
                }
                {submitAssessment != undefined &&
                    <Button
                        variant='contained'
                        onClick={() => submitAssessment()}
                    >
                        Submit Assessment
                    </Button>
                }
            </Card>
            <QuestionModal open={questionModal} setOpen={setQuestionModal} />
        </>
    )
}

export default QuestionsSidebar;