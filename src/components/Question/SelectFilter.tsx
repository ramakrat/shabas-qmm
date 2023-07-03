import * as React from 'react';
import { Filter } from "@prisma/client";
import { Typography, MenuItem, Button, Select, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Add } from "@mui/icons-material";
import { api } from "~/utils/api";
import BusinessTypeModal from '../Modal/QuestionFilters/BusinessTypeModal';
import ManufacturingTypeModal from '../Modal/QuestionFilters/ManufacturingTypeModal';
import SiteSpecificModal from '../Modal/QuestionFilters/SiteSpecificModal';

interface Props {
    filterSelection: any;
    setFilterSelection: any;
    filterType: string;
    setFilterType: any;
    readOnly?: boolean;
}

export const SelectFilter: React.FC<Props> = (props) => {
    const {
        filterSelection,
        setFilterSelection,
        filterType,
        setFilterType,
        readOnly,
    } = props;


    const [addBusinessType, setAddBusinessType] = React.useState<boolean>(false);
    const [addManufacturingType, setAddManufacturingType] = React.useState<boolean>(false);
    const [addSiteSpecific, setAddSiteSpecific] = React.useState<boolean>(false);


    const businessTypes = api.filter.getAllBusinessTypes.useQuery(addBusinessType).data;
    const manufacturingTypes = api.filter.getAllManufacturingTypes.useQuery(addManufacturingType).data;
    const siteSpecifics = api.filter.getAllSiteSpecific.useQuery(addSiteSpecific).data;

    const [filterOptions, setFilterOptions] = React.useState<Filter[] | undefined>(undefined);

    React.useEffect(() => {
        if (filterType == 'default') setFilterOptions(undefined);
        if (filterType == 'business-type') setFilterOptions(businessTypes);
        if (filterType == 'manufacturing-type') setFilterOptions(manufacturingTypes);
        if (filterType == 'site-specific') setFilterOptions(siteSpecifics);
    }, [filterType, businessTypes, manufacturingTypes, siteSpecifics])


    return (<>
        <ToggleButtonGroup
            exclusive
            size='small'
            value={filterType}
            onChange={(_event, value: string) => { if (value) { setFilterType(value); setFilterSelection(null); } }}
        >
            <ToggleButton value='default'>Default</ToggleButton>
            <ToggleButton value='business-type'>Business Type</ToggleButton>
            <ToggleButton value='manufacturing-type'>Manufacturing Type</ToggleButton>
            <ToggleButton value='site-specific'>Site Specific</ToggleButton>
        </ToggleButtonGroup>
        {filterType != 'default' && <>
            <Typography style={{ padding: '0px 10px 0px 5px' }}>:</Typography>
            <Select
                size='small' displayEmpty
                value={filterSelection ? filterSelection.id : ''}
                onChange={(event) => {
                    if (filterOptions) {
                        const selected = filterOptions.find(o => o.id == event.target.value);
                        if (selected) setFilterSelection(selected);
                    }
                }}
            >
                <MenuItem value=''><em>Select a filter...</em></MenuItem>
                {filterOptions?.map((o, i) => {
                    return <MenuItem key={i} value={o.id}>{o.name}</MenuItem>;
                })}
                {!readOnly &&
                    <MenuItem>
                        <Button
                            variant='contained'
                            onClick={() => {
                                if (filterType == 'business-type') setAddBusinessType(true)
                                if (filterType == 'manufacturing-type') setAddManufacturingType(true)
                                if (filterType == 'site-specific') setAddSiteSpecific(true)
                            }}
                        >
                            <Add />
                            {filterType == 'business-type' && 'Add Business Type'}
                            {filterType == 'manufacturing-type' && 'Add Manufacturing Type'}
                            {filterType == 'site-specific' && 'Add Site Specific'}
                        </Button>
                    </MenuItem>
                }
            </Select>
        </>}
        <BusinessTypeModal open={addBusinessType} setOpen={setAddBusinessType} />
        <ManufacturingTypeModal open={addManufacturingType} setOpen={setAddManufacturingType} />
        <SiteSpecificModal open={addSiteSpecific} setOpen={setAddSiteSpecific} />
    </>)
}

export default SelectFilter;