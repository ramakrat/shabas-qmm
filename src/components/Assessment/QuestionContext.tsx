import { Card, Typography } from "@mui/material";

interface Props {
    question?: number;
}

const QuestionContext: React.FC<Props> = (props) => {
    const { question } = props;

    return (
        <Card className='context'>
            <div>
                <Typography>Question #</Typography>
                <Typography>Question #</Typography>
            </div>
            <div>
                <Typography>Pillar (Not Needed)</Typography>
                <Typography>Pillar (Not Needed)</Typography>
            </div>
            <div>
                <Typography>Practice Area</Typography>
                <Typography>Practice Area</Typography>
            </div>
            <div>
                <Typography>Topic Area</Typography>
                <Typography>Topic Area</Typography>
            </div>
            <div>
                <Typography>Priority</Typography>
                <Typography>Priority</Typography>
            </div>
        </Card>
    )
}

export default QuestionContext;