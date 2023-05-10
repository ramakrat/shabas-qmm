import { Close } from "@mui/icons-material";
import { Button, Card, CardActions, CardContent, CardHeader, IconButton, Modal } from "@mui/material";

interface Props {
    title?: string;
    message?: React.ReactNode;
    handleConfirm: any;
    open: boolean;
    setOpen: any;
}

export const ConfirmModal: React.FC<Props> = (props) => {

    const { title, message, handleConfirm, open, setOpen } = props;

    return (
        <Modal open={open} onClose={() => setOpen(false)} className='create-modal no-form'>
            <div>

                <Card>
                    <CardHeader
                        title={title ?? 'Confirm'}
                        action={
                            <IconButton onClick={() => setOpen(false)}>
                                <Close />
                            </IconButton>
                        }
                    />
                    <CardContent>
                        {message ?? 'Are you sure you want to perform this action?'}
                    </CardContent>
                    <CardActions>
                        <Button variant='contained' color='error' onClick={() => setOpen(false)}>Cancel</Button>
                        <Button variant='contained' onClick={handleConfirm}>
                            Confirm
                        </Button>
                    </CardActions>
                </Card>
            </div>
        </Modal>
    )
}

export default ConfirmModal;