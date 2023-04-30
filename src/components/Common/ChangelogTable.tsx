import * as React from 'react';
import type { Changelog } from '@prisma/client';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Typography } from '@mui/material';
import * as XLSX from 'xlsx';
import { FileDownload } from '@mui/icons-material';
import BrowseTable, { type TableColumn } from './BrowseTable';

interface Props {
    changelogs?: Changelog[];
    fileName?: string;
}

interface TableData {
    field: string;
    formerValue: string;
    newValue: string;
    updatedAt: Date;
    updatedBy: string;
}

const columns: TableColumn[] = [{
    type: 'field',
    displayValue: 'Field',
    align: 'center',
}, {
    type: 'formerValue',
    displayValue: 'Former Value',
    align: 'center',
}, {
    type: 'newValue',
    displayValue: 'New Value',
    align: 'center',
}, {
    type: 'updatedAt',
    displayValue: 'Updated At',
    align: 'center',
    format: 'date',
}, {
    type: 'updatedBy',
    displayValue: 'Updated By',
    align: 'center',
}];

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

    const convertTableData = (data?: Changelog[]) => {
        if (data) {
            const newData: TableData[] = [];
            data.forEach(obj => {
                newData.push({
                    field: obj.field,
                    formerValue: obj.former_value ?? '',
                    newValue: obj.new_value ?? '',
                    updatedAt: obj.updated_at,
                    updatedBy: obj.updated_by ?? '',
                })
            })
            return newData;
        }
    }

    return (
        <div className='changelog'>
            <BrowseTable
                dataList={convertTableData(changelogs) ?? []}
                tableInfoColumns={columns}
            />
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