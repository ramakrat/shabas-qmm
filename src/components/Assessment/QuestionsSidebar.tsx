import React from "react";
import { Add } from "@mui/icons-material";
import { Button, Card, Typography } from "@mui/material";
import { Question } from "@prisma/client";
import { api } from "~/utils/api";
import QuestionModal from "../Modals/QuestionModal";

interface Props {
    questions: Question[];
    question: number;
    setQuestion: any;
    addOption: boolean;
}

const QuestionsSidebar: React.FC<Props> = (props) => {

    const { questions, question, setQuestion, addOption } = props;

    const [questionModal, setQuestionModal] = React.useState<boolean>(false);

    return (
        <>
            <Card className='questions-sidebar'>
                <div className='question-steppers'>
                    <Button
                        variant='contained'
                        disabled={question == 1}
                        onClick={() => setQuestion(question - 1)}
                    >
                        Previous
                    </Button>
                    <Button
                        variant='contained'
                        disabled={question == 7}
                        onClick={() => setQuestion(question + 1)}
                    >
                        Next
                    </Button>
                </div>
                {questions.map(o => {
                    return (
                        <Typography
                            key={o.id}
                            className={question == 1 ? 'active' : ''}
                            onClick={() => setQuestion(o.id)}
                        >
                            {o.id}
                        </Typography>
                    )
                })}
                <Typography className={question == 2 ? 'active' : ''} onClick={() => setQuestion(2)}>S2</Typography>
                <Typography className={question == 3 ? 'active' : ''} onClick={() => setQuestion(3)}>S3</Typography>
                <Typography className={question == 4 ? 'active' : ''} onClick={() => setQuestion(4)}>S4</Typography>
                <Typography className={question == 5 ? 'active' : ''} onClick={() => setQuestion(5)}>S5</Typography>
                <Typography className={question == 6 ? 'active' : ''} onClick={() => setQuestion(6)}>S6</Typography>
                <Typography className={question == 7 ? 'active' : ''} onClick={() => setQuestion(7)}>S7</Typography>
                <Button
                    variant='outlined'
                    disabled={question == 7}
                    onClick={() => setQuestionModal(true)}
                    startIcon={<Add />}
                >
                    Add Question
                </Button>
            </Card>
            <QuestionModal open={questionModal} setOpen={setQuestionModal} />
        </>
    )
}

export default QuestionsSidebar;