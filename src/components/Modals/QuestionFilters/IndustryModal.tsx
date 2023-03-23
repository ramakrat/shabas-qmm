import { Button, Card, CardActions, CardContent, CardHeader, IconButton, Modal, TextField } from "@mui/material";
import { Close } from "@mui/icons-material";

interface Props {
    open: boolean;
    setOpen: any;
}

const IndustryModal: React.FC<Props> = (props) => {
    const { open, setOpen } = props;

    return (
        <Modal open={open} onClose={() => setOpen(false)} className='create-modal'>
            <Card>
                <CardHeader
                    title={'Create New Industry'}
                    action={
                        <IconButton onClick={() => setOpen(false)}>
                            <Close />
                        </IconButton>
                    }
                />
                <CardContent>
                    <TextField id='title' name='title' label='Name' size='small' />
                </CardContent>
                <CardActions>
                    <Button variant='contained' color='error' onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant='contained'>Create</Button>
                </CardActions>
            </Card>
        </Modal>
    )
}

export default IndustryModal;