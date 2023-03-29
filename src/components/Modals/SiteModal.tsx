import { Button, Card, CardActions, CardContent, CardHeader, FormControl, IconButton, InputLabel, Modal, Select, TextField } from "@mui/material";
import { Close } from "@mui/icons-material";

interface Props {
    open: boolean;
    setOpen: any;
    data?: any;
}

const SiteModal: React.FC<Props> = (props) => {
    const { open, setOpen, data } = props;

    return (
        <Modal open={open} onClose={() => setOpen(false)} className='create-modal'>
            <Card>
                <CardHeader
                    title={data ? 'Edit Site' : 'Create New Site'}
                    action={
                        <IconButton onClick={() => setOpen(false)}>
                            <Close />
                        </IconButton>
                    }
                />
                <CardContent>
                    <FormControl>
                        <InputLabel size="small">Client</InputLabel>
                        <Select name='country' size='small'>
                        </Select>
                    </FormControl>
                    <TextField name='name' label='Site Name' size='small' />
                    <TextField name='streetAddress' label='Street Address' size='small' />
                    <TextField name='city' label='City' size='small' />
                    <TextField name='state' label='State' size='small' />
                    <TextField name='zipCode' label='Zip Code' size='small' />
                    <TextField name='description' label='Description' size='small' />
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

export default SiteModal;