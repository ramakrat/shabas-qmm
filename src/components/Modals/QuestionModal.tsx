import React from "react";
import { Button, Card, CardActions, CardContent, CardHeader, FormControlLabel, IconButton, Modal, Switch, TextField } from "@mui/material";
import { Close } from "@mui/icons-material";
import { api } from "~/utils/api";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const QuestionModal: React.FC<Props> = (props) => {

    const { open, setOpen } = props;

    // =========== Input Field States ===========

    const [active, setActive] = React.useState<boolean>(true);
    const [number, setNumber] = React.useState<string>('');
    const [question, setQuestion] = React.useState<string>('');
    const [pillar, setPillar] = React.useState<string>('');
    const [practiceArea, setPracticeArea] = React.useState<string>('');
    const [topicArea, setTopicArea] = React.useState<string>('');
    const [hint, setHint] = React.useState<string>('');
    const [priority, setPriority] = React.useState<string>('');


    // =========== Submission Management ===========

    const create = api.question.create.useMutation();

    React.useEffect(() => {
        setActive(true);
        setNumber('');
        setQuestion('');
        setPillar('');
        setPracticeArea('');
        setTopicArea('');
        setHint('');
        setPriority('');
    }, [open])

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        create.mutate({
            active: active,
            number: number,
            question: question,
            pillar: pillar,
            practice_area: practiceArea,
            topic_area: topicArea,
            hint: hint,
            priority: priority,
        }, {
            onSuccess() { setOpen(false) }
        })
    }


    return (
        <Modal open={open} onClose={() => setOpen(false)} className='create-modal'>
            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader
                        title={'Create New Question'}
                        action={
                            <IconButton onClick={() => setOpen(false)}>
                                <Close />
                            </IconButton>
                        }
                    />
                    <CardContent>
                        <TextField
                            name='number' label='Question #' size='small'
                            value={number}
                            onChange={e => setNumber(e.target.value)}
                        />
                        <TextField
                            name='question' label='Question' size='small'
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                        />
                        <TextField
                            name='pillar' label='Pillar' size='small'
                            value={pillar}
                            onChange={e => setPillar(e.target.value)}
                        />
                        <TextField
                            name='practiceArea' label='Practice Area' size='small'
                            value={practiceArea}
                            onChange={e => setPracticeArea(e.target.value)}
                        />
                        <TextField
                            name='topicArea' label='Topic Area' size='small'
                            value={topicArea}
                            onChange={e => setTopicArea(e.target.value)}
                        />
                        <TextField
                            name='hint' label='Hint' size='small'
                            value={hint}
                            onChange={e => setHint(e.target.value)}
                        />
                        <TextField
                            name='priority' label='Priority' size='small'
                            value={priority}
                            onChange={e => setPriority(e.target.value)}
                        />
                        <FormControlLabel
                            label="Active"
                            labelPlacement="top"
                            className="switch"
                            control={
                                <Switch
                                    checked={active}
                                    onChange={(_event, checked) => setActive(checked)}
                                />
                            }
                        />
                    </CardContent>
                    <CardActions>
                        <Button variant='contained' color='error' onClick={() => setOpen(false)}>Cancel</Button>
                        <Button variant='contained' type='submit'>Create</Button>
                    </CardActions>
                </Card>
            </form>
        </Modal>
    )
}

export default QuestionModal;