import * as React from 'react';
import {
    Button, Card, Grid, IconButton, MenuItem,
    TextField as MuiTextField, Typography
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

interface GuideType {
    id?: number;
    num: number;
    interview_question: string;
}

interface ReferenceType {
    id?: number;
    num: number;
    citation: string;
}

interface Props {
    existingObjects: any[];
    setExistingObjects: (value: React.SetStateAction<any[]>) => void;
    newObjects: any[];
    setNewObjects: (value: React.SetStateAction<any[]>) => void;
    deletedObjects: any[];
    setDeletedObjects: (value: React.SetStateAction<any[]>) => void;
    property: string;
}

const InputList: React.FC<Props> = (props) => {
    const {
        existingObjects,
        setExistingObjects,
        newObjects,
        setNewObjects,
        deletedObjects,
        setDeletedObjects,
        property,
    } = props;

    const handleInputChange = (num: number, newVal: string, existing?: boolean) => {
        const ref = existing ? existingObjects : newObjects;
        const newArr = ref.map(o => {
            const newObj = o;
            if (o.num == num) {
                newObj[property] = newVal;
            }
            return newObj;
        });
        if (existing) {
            setExistingObjects(newArr);
        } else {
            setNewObjects(newArr);
        }
    }

    return (<>
        {existingObjects.map((o, i) => {
            return (
                <div key={i} className='input-row'>
                    <Typography style={{ paddingRight: 10 }}>{o.num}.</Typography>
                    <MuiTextField
                        placeholder='Enter text...' size='small'
                        value={o[property]}
                        onChange={(event) => handleInputChange(o.num, event.target.value, true)}
                    />
                    <IconButton
                        color='default'
                        onClick={() => {
                            const newDeleted = deletedObjects;
                            newDeleted.push(o);
                            setDeletedObjects(newDeleted);

                            let count = 0;
                            const newExisting: any[] = []
                            existingObjects.map(x => {
                                if (x.id != o.id) {
                                    count++;
                                    newExisting.push({
                                        ...x,
                                        num: count,
                                    })
                                }
                            });
                            setExistingObjects(newExisting);

                            const newNew: any[] = []
                            newObjects.map(x => {
                                count++;
                                newNew.push({
                                    ...x,
                                    num: count,
                                })
                            });
                            setNewObjects(newNew);
                        }}
                    ><Delete /></IconButton>
                </div>
            )
        })}
        {newObjects.map((o, i) => {
            if (i == newObjects.length - 1)
                return (
                    <div key={i} className='input-row'>
                        <Typography style={{ paddingRight: 10 }}>{o.num}.</Typography>
                        <MuiTextField
                            placeholder='Enter text...' size='small'
                            value={o[property]}
                            onChange={(event) => handleInputChange(o.num, event.target.value)}
                        />
                        <IconButton
                            onClick={() => {
                                const last = newObjects[newObjects.length - 1];
                                if (last) {
                                    const newObj: any = { num: last.num + 1 };
                                    newObj[property] = '';
                                    setNewObjects([...newObjects, newObj]);
                                }
                            }}
                        ><Add /></IconButton>
                    </div>
                )
            return (
                <div key={i} className='input-row'>
                    <Typography style={{ paddingRight: 10 }}>{o.num}.</Typography>
                    <MuiTextField
                        placeholder='Enter text...' size='small'
                        value={o[property]}
                        onChange={(event) => handleInputChange(o.num, event.target.value)}
                    />
                    <IconButton
                        color='default'
                        onClick={() => {
                            if (newObjects[0]) {
                                let newIndex = (newObjects[0]?.num) - 1;
                                const removed: any[] = [];
                                newObjects.forEach(d => {
                                    if (d.num != o.num) {
                                        newIndex++;
                                        removed.push({
                                            ...d,
                                            num: newIndex,
                                        })
                                    }
                                    return;

                                });
                                setNewObjects(removed);
                            }
                        }}
                    ><Delete /></IconButton>
                </div>
            )
        })}
    </>);
};

export default InputList;