import React from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import StatusChip from "./StatusChip";

export interface TableColumn {
    type: string;
    displayValue: string;
    align?: 'left' | 'center' | 'right';
    style?: any;
    placeholder?: string;
    format?: 'integer' | 'currency-US' | 'date' | 'status' | 'button' | 'enum' | 'long-desc' | 'jsx-element' | 'symbol' | 'employees';
    onChange?: any;
}

interface Props {
    dataList: any[];
    tableInfoColumns: TableColumn[];
}

const BrowseTable: React.FC<Props> = (props) => {

    const { dataList, tableInfoColumns } = props;

    return (
        <TableContainer component={Paper} className='browse-table'>
            <Table size="small">
                <TableHead className="table-header">
                    <TableRow>
                        {tableInfoColumns.map((header, i) => {
                            return (
                                <TableCell
                                    key={'header-' + i}
                                    className={`primary-cell`}
                                    align={header.align}
                                >
                                    {header.displayValue}
                                </TableCell>
                            );
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dataList.map((obj: any, idx: number) => {
                        return (
                            <TableRow
                                key={'row-' + idx}
                                className={obj.onClick ? 'clickable-table-row' : ''}
                                onClick={obj.onClick ?? undefined}
                            >
                                {tableInfoColumns.map(column => {
                                    let cellData = obj[column.type];
                                    if (column.format === 'date') {
                                        cellData = (obj[column.type]).toDateString();
                                    } else if (column.format === 'status' && obj[column.type]) {
                                        cellData = <StatusChip status={obj[column.type]} />;
                                    } else if (column.format === 'jsx-element') {
                                        cellData = obj[column.type];
                                    }
                                    return (
                                        <TableCell key={column.type + '-' + idx} align={column.align} className={obj[column.type] == '' ? 'null' : ''}>
                                            {cellData}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        )
                    })}
                    {dataList.length === 0 &&
                        <TableRow>
                            <TableCell colSpan={tableInfoColumns.length + 1} className='body-cell center' style={{ height: 80, fontSize: 16 }}>
                                No data to display.
                            </TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default BrowseTable;