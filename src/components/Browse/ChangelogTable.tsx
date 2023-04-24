import * as React from 'react';
import type { Changelog } from '@prisma/client';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { dateInputFormat } from '~/utils/utils';

interface Props {
    changelogs?: Changelog[];
}

const ChangelogTable: React.FC<Props> = (props) => {
    const { changelogs } = props;

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Field</TableCell>
                        <TableCell align="left">Former Value</TableCell>
                        <TableCell align="left">New Value</TableCell>
                        <TableCell align="left">Updated At</TableCell>
                        <TableCell align="left">Updated By</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {changelogs && changelogs.map((data, i) => {
                        return (
                            <TableRow
                                key={i}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="left">
                                    {data.field}
                                </TableCell>
                                <TableCell align="left">
                                    {data.former_value}
                                </TableCell>
                                <TableCell align="left">
                                    {data.new_value}
                                </TableCell>
                                <TableCell align="left">
                                    {dateInputFormat(data.updated_at)}
                                </TableCell>
                                <TableCell align="left">
                                    {data.updated_by}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default ChangelogTable;