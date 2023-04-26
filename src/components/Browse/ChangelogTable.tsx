import * as React from 'react';
import type { Changelog } from '@prisma/client';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Typography } from '@mui/material';
import * as XLSX from 'xlsx';
import { FileDownload } from '@mui/icons-material';

interface Props {
    changelogs?: Changelog[];
    fileName?: string;
}

const ChangelogTable: React.FC<Props> = (props) => {
    const { changelogs, fileName } = props;

    const exportCompleted = () => {
        if (changelogs) {
            const sheet = XLSX.utils.json_to_sheet(changelogs);
            const book = XLSX.utils.book_new();
            const fileDate = new Date().toLocaleDateString('fr-CA');
            const fullFileName = fileName ? `${fileName} Changelog ${fileDate}.xlsx` : `Changelog ${fileDate}.xlsx`
            XLSX.utils.book_append_sheet(book, sheet, 'Sheet1');
            XLSX.writeFile(book, fullFileName, { bookType: 'xlsx' });
        }
    }

    return (
        <div className='changelog'>
            <TableContainer component={Paper}>
                <Table size="small" stickyHeader>
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
                                        {data.new_value ??
                                            <Typography style={{ fontStyle: 'italic' }}>Deleted</Typography>
                                        }
                                    </TableCell>
                                    <TableCell align="left">
                                        {data.updated_at.toDateString()}
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
            <Button
                variant='contained'
                startIcon={<FileDownload />}
                onClick={exportCompleted}
            >
                Export Changelog
            </Button>
        </div>
    )
}

export default ChangelogTable;