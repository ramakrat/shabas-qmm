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
}

const QuestionsSidebar: React.FC<Props> = (props) => {

    const { questions, question, setQuestion, addOption } = props;

    const [questionModal, setQuestionModal] = React.useState<boolean>(false);

    return (
        <>
            <Card className='questions-sidebar'>
                {questions.find(o => o.id == question) &&
                    <div className='question-steppers'>
                        <Button
                            variant='contained'
                            disabled={questions[0] ? (question == questions[0].id) : false}
                            onClick={() => setQuestion(question - 1)}
                        >
                            Previous
                        </Button>
                        <Button
                            variant='contained'
                            disabled={questions[questions.length] ? (question == (questions[questions.length] as Question).id) : false}
                            onClick={() => setQuestion(question + 1)}
                        >
                            Next
                        </Button>
                    </div>
                }
                {questions.map(o => {
                    return (
                        <Typography
                            key={o.id}
                            className={o.id == question ? 'active' : ''}
                            onClick={() => setQuestion(o.id)}
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
            </Card>
            <QuestionModal open={questionModal} setOpen={setQuestionModal} />
        </>
    )
}

export default QuestionsSidebar;