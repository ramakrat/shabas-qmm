import { Button, Card, Typography } from "@mui/material";

interface Props {
    question: number;
    setQuestion: any;
}

const QuestionsSidebar: React.FC<Props> = (props) => {
    const { question, setQuestion } = props;

    return (
        <Card className='questions-sidebar'>
            <div className='question-steppers'>
                <Button variant='contained' disabled={question == 1} onClick={() => setQuestion(question - 1)}>Previous</Button>
                <Button variant='contained' disabled={question == 7} onClick={() => setQuestion(question + 1)}>Next</Button>
            </div>
            <Typography className={question == 1 ? 'active' : ''} onClick={() => setQuestion(1)}>S1</Typography>
            <Typography className={question == 2 ? 'active' : ''} onClick={() => setQuestion(2)}>S2</Typography>
            <Typography className={question == 3 ? 'active' : ''} onClick={() => setQuestion(3)}>S3</Typography>
            <Typography className={question == 4 ? 'active' : ''} onClick={() => setQuestion(4)}>S4</Typography>
            <Typography className={question == 5 ? 'active' : ''} onClick={() => setQuestion(5)}>S5</Typography>
            <Typography className={question == 6 ? 'active' : ''} onClick={() => setQuestion(6)}>S6</Typography>
            <Typography className={question == 7 ? 'active' : ''} onClick={() => setQuestion(7)}>S7</Typography>
        </Card>
    )
}

export default QuestionsSidebar;