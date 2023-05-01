import React from "react";
import type { Question } from "@prisma/client";
import { Button, Card, IconButton, Typography } from "@mui/material";
import { Add, East, FileDownload, West } from "@mui/icons-material";
import QuestionModal from "../Administrator/Question/QuestionModal";

interface Props {
    assessmentId: string,
    questions: Question[];
    question: number;
    setQuestion: (question: number) => void;
    addOption?: boolean;
    submitAssessment?: () => void;
    resetForm?: () => void;
    assessmentChangelogs?: () => void;
    exportAssessment?: () => void;
}

const QuestionsSidebar: React.FC<Props> = (props) => {

    const {
        assessmentId,
        questions,
        question,
        setQuestion,
        addOption,
        submitAssessment,
        resetForm,
        assessmentChangelogs,
        exportAssessment,
    } = props;

    const [questionModal, setQuestionModal] = React.useState<boolean>(false);

    return (
        <>
            <Card className='questions-sidebar'>
                {questions.find((o: Question) => o.id == question) &&
                    <div className='question-steppers'>
                        <div className='stepper'>
                            <IconButton
                                disabled={questions[0] ? (question == questions[0].id) : false}
                                onClick={() => {
                                    if (resetForm) resetForm();
                                    setQuestion(question - 1);
                                }}
                            >
                                <West />
                            </IconButton>
                        </div>
                        <div className='stepper'>
                            <IconButton
                                disabled={questions[questions.length - 1] ? (question == (questions[questions.length - 1] as Question).id) : false}
                                onClick={() => {
                                    if (resetForm) resetForm();
                                    setQuestion(question + 1);
                                }}
                            >
                                <East />
                            </IconButton>
                        </div>
                    </div>
                }
                <div className='assessment-id'>
                    Assessment {assessmentId}
                </div>
                <div className='sidebar-body'>
                    <div>
                        {questions.map((o: Question) => {
                            const selected = o.id == question ? 'selected ' : '';
                            const active = o.active ? 'active ' : '';
                            return (
                                <div key={o.id} className={'question-option ' + selected}>
                                    <div className={'active-signature ' + active} />
                                    <Typography
                                        onClick={() => {
                                            if (resetForm) resetForm();
                                            setQuestion(o.id)
                                        }}
                                    >
                                        {o.number}
                                    </Typography>
                                </div>
                            )
                        })}
                    </div>
                    <div>
                        {assessmentChangelogs != undefined &&
                            <div className={question == -1 ? 'question-option selected' : 'question-option'}>
                                <Typography onClick={assessmentChangelogs}>
                                    Changelog
                                </Typography>
                            </div>
                        }
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
                        {submitAssessment != undefined &&
                            <Button
                                variant='contained'
                                onClick={() => submitAssessment()}
                                disabled={questions.length < 1}
                            >
                                Submit Assessment
                            </Button>
                        }
                        {exportAssessment != undefined &&
                            <Button
                                variant='contained'
                                startIcon={<FileDownload />}
                                onClick={() => exportAssessment()}
                            >
                                Export Assessment
                            </Button>
                        }
                    </div>
                </div>
            </Card>
            <QuestionModal open={questionModal} setOpen={setQuestionModal} />
        </>
    )
}

export default QuestionsSidebar;