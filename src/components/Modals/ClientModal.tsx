import { Button, Card, CardActions, CardContent, CardHeader, FormControl, IconButton, InputLabel, MenuItem, Modal, Select, TextField } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Countries } from "~/utils/utils";

interface Props {
    open: boolean;
    setOpen: any;
    data?: any;
}

const ClientModal: React.FC<Props> = (props) => {
    const { open, setOpen, data } = props;

    return (
        <Modal open={open} onClose={() => setOpen(false)} className='create-modal'>
            <Card>
                <CardHeader
                    title={data ? 'Edit Client' : 'Create New Client'}
                    action={
                        <IconButton onClick={() => setOpen(false)}>
                            <Close />
                        </IconButton>
                    }
                />
                <CardContent>
                    <TextField name='firstName' label='First Name' size='small' />
                    <TextField name='lastName' label='Last Name' size='small' />
                    <TextField name='streetAddress' label='Street Address' size='small' />
                    <TextField name='city' label='City' size='small' />
                    <TextField name='state' label='State' size='small' />
                    <TextField name='zipCode' label='Zip Code' size='small' />
                    <FormControl>
                        <InputLabel size="small">Country</InputLabel>
                        <Select name='country' size='small'>
                            {Countries.map((country) => {
                                return (
                                    <MenuItem value={country.code}>
                                        {country.name}
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                    <TextField name='description' label='Description' size='small' multiline minRows={3} />
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

export default ClientModal;