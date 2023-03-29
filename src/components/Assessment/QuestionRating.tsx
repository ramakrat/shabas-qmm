import { Info } from "@mui/icons-material";
import { Card, TextField, Typography } from "@mui/material";
import React from "react";

interface Props {
    question?: number;
    review?: boolean;
}

const QuestionRating: React.FC<Props> = (props) => {
    const { question, review } = props;
    const [showRating, setShowRating] = React.useState<boolean>(false);

    return (
        <Card className='pre-questions'>
            <div>
                {review &&
                    <>
                        <Typography>Hint: XYZ</Typography>
                        <Typography>Start Time: XYZ</Typography>
                    </>
                }

                <div className='rating'>
                    <div className='rating-input'>
                        <Typography>{review ? 'Consensus Rating' : 'Rating'}</Typography>
                        <Info fontSize='small' onClick={() => setShowRating(!showRating)} />
                        <TextField size='small' />
                    </div>
                    {showRating &&
                        <div>
                            Level 1:<br />
                            Progression Statement:<br />
                            Level 2:<br />
                            Progression Statement:<br />
                            Level 3:<br />
                            Progression Statement:<br />
                            Level 4:<br />
                            Progression Statement:<br />
                            Level 5:<br />
                            Progression Statement:
                        </div>
                    }
                </div>
            </div>
        </Card>
    )
}

export default QuestionRating;