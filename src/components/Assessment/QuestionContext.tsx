import type { Question } from "@prisma/client";
import { Card, Typography } from "@mui/material";

interface Props {
    question?: Question;
}

const QuestionContext: React.FC<Props> = (props) => {
    const { question } = props;

    return (
        <Card className='context'>
            <div>
                <Typography>Question #</Typography>
                <Typography>{question ? question.number : undefined}</Typography>
            </div>
            <div>
                <Typography>Pillar (Not Needed)</Typography>
                <Typography>{question ? question.pillar : undefined}</Typography>
            </div>
            <div>
                <Typography>Practice Area</Typography>
                <Typography>{question ? question.practice_area : undefined}</Typography>
            </div>
            <div>
                <Typography>Topic Area</Typography>
                <Typography>{question ? question.topic_area : undefined}</Typography>
            </div>
            <div>
                <Typography>Priority</Typography>
                <Typography>{question ? question.priority : undefined}</Typography>
            </div>
        </Card>
    )
}

export default QuestionContext;