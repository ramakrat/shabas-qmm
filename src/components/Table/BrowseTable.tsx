import React from "react";
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import { dateInputFormat, truncate } from "~/utils/utils";
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
    expandable?: boolean;
}

const cell = (obj: any, column: any, idx: number) => {
    if (column.type == 'onClick') return;
    let cellData = obj[column.type];
    if (column.format === 'date') {
        cellData = dateInputFormat(obj[column.type], true, true);
    } else if (column.format === 'status' && obj[column.type]) {
        cellData = <StatusChip status={obj[column.type]} />;
    } else if (column.format === 'jsx-element') {
        cellData = obj[column.type];
    } else if (column.format === 'long-desc') {
        cellData = truncate(cellData.toString(), 75);
    }
    return (
        <TableCell key={column.type + '-' + idx} align={column.align} className={obj[column.type] == '' ? 'null' : ''}>
            {cellData}
        </TableCell>
    )
}

const Row = (tableInfoColumns: any[], obj: any, idx: number) => {
    return (
        <TableRow key={'row-' + idx}>
            {tableInfoColumns.map(column => cell(obj, column, idx))}
        </TableRow>
    )
}

const ExpandableSection = (tableInfoColumns: any[], obj: any, idx: number, child?: React.ReactNode) => {
    const [expanded, setExpanded] = React.useState(true);

    return (
        <>
            <TableHead key={'header-' + idx}>
                <TableRow>
                    {tableInfoColumns.map((header, i) => {
                        return (
                            <TableCell
                                key={'header-' + i}
                                className={`primary-cell`}
                                align={header.align}
                            >
                                {header.displayValue}
                                {(i + 1) == tableInfoColumns.length && child &&
                                    <IconButton onClick={() => setExpanded(!expanded)} color="inherit" className='expand-button'>
                                        {expanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                    </IconButton>
                                }
                            </TableCell>
                        );
                    })}
                </TableRow>
            </TableHead>
            <TableBody key={'body-' + idx}>
                {Row(tableInfoColumns, obj, idx)}
                {(expanded && child) &&
                    <TableRow>
                        <TableCell colSpan={tableInfoColumns.length} className='child-table'>
                            {child}
                        </TableCell>
                    </TableRow>
                }
            </TableBody>
        </>
    )
}
const BrowseTable: React.FC<Props> = (props) => {

    const { dataList, tableInfoColumns, expandable } = props;

    if (expandable) {
        return (
            <TableContainer component={Paper} className='browse-table expandable'>
                <Table size="small" stickyHeader>
                    {dataList.map((obj, idx) => {
                        return ExpandableSection(tableInfoColumns, obj, idx, obj.child as React.ReactNode)
                    })}
                    {dataList.length === 0 && <>
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
                            <TableRow>
                                <TableCell colSpan={tableInfoColumns.length + 1} className='empty-table-body'>
                                    No data to display.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </>}
                </Table>
            </TableContainer>
        );
    }
    return (
        <TableContainer component={Paper} className='browse-table'>
            <Table size="small" stickyHeader>
                <TableHead className="table-header">
                    <TableRow>
                        {tableInfoColumns.map((header, i) => {
                            if (header.type == 'onClick') return;
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
                                {tableInfoColumns.map(column => cell(obj, column, idx))}
                            </TableRow>
                        )
                    })}
                    {dataList.length === 0 &&
                        <TableRow>
                            <TableCell colSpan={tableInfoColumns.length + 1} className='empty-table-body'>
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