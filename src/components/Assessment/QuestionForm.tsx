import { Button, Card, TextField, Typography } from "@mui/material";

interface Props {
    question?: number;
}

const QuestionForm: React.FC<Props> = (props) => {
    const { question } = props;

    return (
        <Card className='question-content'>
            <Typography>Rationale</Typography>
            <TextField />
            <Typography>Notes</Typography>
            <TextField multiline />
        </Card>
    )
}

export default QuestionForm;