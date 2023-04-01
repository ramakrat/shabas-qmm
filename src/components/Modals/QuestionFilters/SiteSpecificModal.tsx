import React from "react";
import { Button, Card, CardActions, CardContent, CardHeader, IconButton, Modal, TextField } from "@mui/material";
import { Close } from "@mui/icons-material";
import { api } from "~/utils/api";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const SiteSpecificModal: React.FC<Props> = (props) => {
    const { open, setOpen } = props;

    // =========== Input Field States ===========

    const [name, setName] = React.useState<string>('');

    // =========== Submission Management ===========

    const create = api.filter.create.useMutation();

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        create.mutate({
            type: 'site-specific',
            name: name,
        }, {
            onSuccess() { setOpen(false) }
        })
    }

    return (
        <Modal open={open} onClose={() => setOpen(false)} className='create-modal'>
            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader
                        title={'Create New Site Specific'}
                        action={
                            <IconButton onClick={() => setOpen(false)}>
                                <Close />
                            </IconButton>
                        }
                    />
                    <CardContent>
                        <TextField
                            id='name' name='name' label='Name' size='small'
                            value={name}
                            onChange={e => setName(e.target.value)}
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

export default SiteSpecificModal;