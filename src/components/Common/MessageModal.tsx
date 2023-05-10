import { Close } from "@mui/icons-material";
import { Button, Card, CardActions, CardContent, CardHeader, IconButton, Modal } from "@mui/material";

interface Props {
    title?: string;
    message?: React.ReactNode;
    open: boolean;
    setOpen: any;
}

export const MessageModal: React.FC<Props> = (props) => {

    const { title, message, open, setOpen } = props;

    return (
        <Modal open={open} onClose={() => setOpen(false)} className='create-modal no-form'>
            <div>
                <Card>
                    <CardHeader
                        title={title ?? 'Warning'}
                        action={
                            <IconButton onClick={() => setOpen(false)}>
                                <Close />
                            </IconButton>
                        }
                    />
                    <CardContent>
                        {message}
                    </CardContent>
                    <CardActions>
                        <div />
                        <Button variant='contained' onClick={() => setOpen(false)}>
                            Okay
                        </Button>
                    </CardActions>
                </Card>
            </div>
        </Modal>
    )
}

export default MessageModal;