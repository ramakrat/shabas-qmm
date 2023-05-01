import React from "react";
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import StatusChip from "./StatusChip";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

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

const Row = (tableInfoColumns: any[], obj: any, idx: number) => {
    return (
        <TableRow key={'row-' + idx}>
            {tableInfoColumns.map(column => {
                if (column.format === 'date') {
                    return (
                        <TableCell key={column.type + '-' + idx} align={column.align}>
                            {(obj[column.type]).toDateString()}
                        </TableCell>
                    )
                } else if (column.format === 'status') {
                    return (
                        obj[column.type] ?
                            <TableCell key={column.type + '-' + idx} align={column.align}>
                                <StatusChip status={obj[column.type]} />
                            </TableCell> : <TableCell key={column.type + '-' + idx} />
                    )
                } else if (column.format === 'jsx-element') {
                    return (
                        <TableCell key={column.type + '-' + idx} align={column.align}>
                            {obj[column.type]}
                        </TableCell>
                    )
                }
                return (
                    <TableCell key={column.type + '-' + idx} align={column.align} className={obj[column.type] == '' ? 'null' : ''}>
                        {(obj[column.type])}
                    </TableCell>
                )
            })}
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
                            </TableCell>
                        );
                    })}
                    <TableCell key={'expandButton-' + idx} align='center'>
                        {child &&
                            <IconButton onClick={() => setExpanded(!expanded)} color="inherit">
                                {expanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </IconButton>
                        }
                    </TableCell>
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

const ExpandableBrowseTable: React.FC<Props> = (props) => {

    const { dataList, tableInfoColumns } = props;


    return (
        <>
            <TableContainer component={Paper} className='browse-table expandable'>
                <Table size="small">
                    {dataList.map((obj, idx) => {
                        return ExpandableSection(tableInfoColumns, obj, idx, obj.child as React.ReactNode)
                    })}
                </Table>
            </TableContainer>
        </>
    );
};

export default ExpandableBrowseTable;