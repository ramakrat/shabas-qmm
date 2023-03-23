import { Button, Card, CardActions, CardContent, CardHeader, IconButton, Modal, TextField } from "@mui/material";
import { Close } from "@mui/icons-material";

interface Props {
    open: boolean;
    setOpen: any;
    data?: any;
}

const EngagementModal: React.FC<Props> = (props) => {
    const { open, setOpen, data } = props;

    return (
        <Modal open={open} onClose={() => setOpen(false)} className='create-modal'>
            <Card>
                <CardHeader
                    title={data ? 'Edit Engagement' : 'Create New Engagement'}
                    action={
                        <IconButton onClick={() => setOpen(false)}>
                            <Close />
                        </IconButton>
                    }
                />
                <CardContent>
                    <TextField id='title' name='title' label='title' size='small' />
                    <TextField id='title' name='title' label='title' size='small' />
                </CardContent>
                <CardActions>
                    <Button variant='contained' color='error' onClick={() => setOpen(false)}>Cancel</Button>
                    {data ?
                        <Button variant='contained'>Save</Button> :
                        <Button variant='contained'>Create</Button>
                    }
                </CardActions>
            </Card>
        </Modal>
    )
}

export default EngagementModal;