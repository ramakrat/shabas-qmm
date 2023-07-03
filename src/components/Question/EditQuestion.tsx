import * as React from 'react';
import Router from 'next/router';
import type { Filter } from '@prisma/client';

import * as yup from "yup";
import { Field, Form, Formik } from "formik";
import TextField from '~/components/Form/TextField';
import Select from '~/components/Form/Select';

import {
    Button, Card, Grid, IconButton, MenuItem,
    TextField as MuiTextField, Typography
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

import { api } from "~/utils/api";
import { underscoreToTitle } from '~/utils/utils';
import ChangelogTable from '~/components/Table/ChangelogTable';
import SelectFilter from '~/components/Question/SelectFilter';
import PriorityIndicator from './PriorityIndicator';

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

interface FormValues {
    number: string;
    question: string;
    pillar: string;
    practiceArea: string;
    topicArea: string;
    priority: string;
    hint: string;
    level1?: number;
    criteria1: string;
    progression1: string;
    level2?: number;
    criteria2: string;
    progression2: string;
    level3?: number;
    criteria3: string;
    progression3: string;
    level4?: number;
    criteria4: string;
    progression4: string;
    level5?: number;
    criteria5: string;
    sme?: number;
    smeFirstName: string;
    smeLastName: string;
    smePhone: string;
    smeEmail: string;
}

const validationSchema = yup.object().shape({
    number: yup.string().required("Required"),
    question: yup.string().required("Required"),
    pillar: yup.string().required("Required"),
    practiceArea: yup.string().required("Required"),
    topicArea: yup.string().required("Required"),
    priority: yup.string().required("Required"),
    hint: yup.string().required("Required"),
    criteria1: yup.string().required("Required"),
    progression1: yup.string().required("Required"),
    criteria2: yup.string().required("Required"),
    progression2: yup.string().required("Required"),
    criteria3: yup.string().required("Required"),
    progression3: yup.string().required("Required"),
    criteria4: yup.string().required("Required"),
    progression4: yup.string().required("Required"),
    criteria5: yup.string().required("Required"),
    smeFirstName: yup.string().required("Required"),
    smeLastName: yup.string().required("Required"),
    smePhone: yup.string().required("Required"),
    smeEmail: yup.string().required("Required"),
});

interface Props {
    data: any;
}

const EditQuestion: React.FC<Props> = (props) => {
    const { data } = props;

    // =========== Form Context ===========

    const [filterType, setFilterType] = React.useState<string>('default');
    const [filterSelection, setFilterSelection] = React.useState<Filter | null>(null);

    const ratingData = api.rating.getByQuestionFilter.useQuery({
        questionId: data.id,
        filterId: (filterType != 'default' && filterSelection) ? filterSelection.id : undefined,
    }).data;

    interface AllValues {
        question: any;
        guides: any[];
        references: any[];
        ratings: any[];
        sme: any;
    }

    const initialValues = (): AllValues => {
        return {
            question: data,
            guides: data?.interview_guides,
            references: data?.references,
            ratings: ratingData,
            sme: data?.smes[0],
        } as AllValues;
    }

    // =========== Input Field States ===========

    const [questionData, setQuestionData] = React.useState<FormValues>({
        number: '',
        question: '',
        pillar: '',
        practiceArea: '',
        topicArea: '',
        priority: '',
        hint: '',
        criteria1: '',
        progression1: '',
        criteria2: '',
        progression2: '',
        criteria3: '',
        progression3: '',
        criteria4: '',
        progression4: '',
        criteria5: '',
        smeFirstName: '',
        smeLastName: '',
        smePhone: '',
        smeEmail: '',
    });

    const [existingGuide, setExistingGuide] = React.useState<GuideType[]>([]);
    const [newGuide, setNewGuide] = React.useState<GuideType[]>([{ num: 1, interview_question: '' }]);
    const [deletedGuides, setDeletedGuides] = React.useState<GuideType[]>([]);

    const [existingReferences, setExistingReferences] = React.useState<ReferenceType[]>([]);
    const [newReferences, setNewReferences] = React.useState<ReferenceType[]>([{ num: 1, citation: '' }]);
    const [deletedReferences, setDeletedReferences] = React.useState<ReferenceType[]>([]);

    const handleGuideChange = (num: number, newVal: string, existing?: boolean) => {
        const ref = existing ? existingGuide : newGuide;
        const newArr = ref.map(o => {
            if (o.num == num) {
                return {
                    ...o,
                    interview_question: newVal,
                }
            }
            return o;
        });
        if (existing) {
            setExistingGuide(newArr);
        } else {
            setNewGuide(newArr);
        }
    }

    const handleReferenceChange = (num: number, newVal: string, existing?: boolean) => {
        const ref = existing ? existingReferences : newReferences;
        const newArr = ref.map(o => {
            if (o.num == num) {
                return {
                    ...o,
                    citation: newVal,
                }
            }
            return o;
        });
        if (existing) {
            setExistingReferences(newArr);
        } else {
            setNewReferences(newArr);
        }
    }

    // =========== Submission Management ===========

    const update = api.question.update.useMutation();
    const changeActive = api.question.active.useMutation();

    const createGuides = api.interviewGuide.createArray.useMutation();
    const updateGuides = api.interviewGuide.updateArray.useMutation();
    const deleteGuides = api.interviewGuide.deleteArray.useMutation();

    const createReferences = api.reference.createArray.useMutation();
    const updateReferences = api.reference.updateArray.useMutation();
    const deleteReferences = api.reference.deleteArray.useMutation();

    const createSME = api.sme.create.useMutation();
    const updateSME = api.sme.update.useMutation();

    const createRatings = api.rating.createArray.useMutation();
    const updateRatings = api.rating.updateArray.useMutation();

    const createChangelog = api.changelog.create.useMutation();

    React.useEffect(() => {
        let newQuestionData = questionData;
        if (data) {
            newQuestionData = {
                ...newQuestionData,
                number: data.number,
                question: data.question,
                pillar: data.pillar,
                practiceArea: data.practice_area,
                topicArea: data.topic_area,
                priority: data.priority,
                hint: data.hint,
            }


            if (data.smes[0]) {
                newQuestionData = {
                    ...newQuestionData,
                    sme: data.smes[0].id,
                    smeFirstName: data.smes[0].first_name,
                    smeLastName: data.smes[0].last_name,
                    smeEmail: data.smes[0].email,
                    smePhone: data.smes[0].mobile_phone,
                }
            }

            if (data.references) {
                let count = 0;
                const existingArray = data.references.map((o: { id: any; citation: any; }) => {
                    count++;
                    return {
                        id: o.id,
                        num: count,
                        citation: o.citation,
                    }
                });
                setExistingReferences(existingArray);
                const array = newReferences.map(o => {
                    count++;
                    return {
                        ...o,
                        num: count,
                    }
                });
                setNewReferences(array);
            }
            if (data.interview_guides) {
                let count = 0;
                const existingArray = data.interview_guides.map((o: { id: any; interview_question: any; }) => {
                    count++;
                    return {
                        id: o.id,
                        num: count,
                        interview_question: o.interview_question,
                    }
                });
                setExistingGuide(existingArray);
                const array = newGuide.map(o => {
                    count++;
                    return {
                        num: count,
                        interview_question: o.interview_question,
                    }
                });
                setNewGuide(array);
            }
        }
        if (ratingData) {
            for (let i = 1; i <= 5; i++) {
                const currRating = ratingData.find(o => o.level_number == i.toString());
                if (currRating) {
                    newQuestionData = {
                        ...newQuestionData,
                        ['level' + i.toString()]: currRating.id,
                        ['criteria' + i.toString()]: currRating.criteria,
                        ['progression' + i.toString()]: currRating.progression_statement,
                    }
                }
            }
        } else {
            for (let i = 1; i <= 5; i++) {
                newQuestionData = {
                    ...newQuestionData,
                    ['level' + i.toString()]: undefined,
                    ['criteria' + i.toString()]: '',
                    ['progression' + i.toString()]: '',
                }
            }
        }

        setQuestionData(newQuestionData);
    }, [data, ratingData])


    const handleActive = () => {
        if (data) {
            changeActive.mutate({
                id: data.id,
                active: !data.active,
            }, {
                onSuccess() { Router.reload() }
            })
        }
    }

    const compareChanges = (changed: any, former: any, prefix?: string) => {
        for (const prop in changed) {
            if (prop != 'id' && prop != 'created_at' && prop != 'updated_at') {
                if (Object.prototype.hasOwnProperty.call(changed, prop)) {
                    if (Object.prototype.hasOwnProperty.call(former, prop)) {
                        if (changed[prop] != former[prop]) {
                            const propName = underscoreToTitle(prop);
                            createChangelog.mutate({
                                field: prefix ? `${prefix}${propName}` : propName,
                                former_value: former[prop].toString(),
                                new_value: changed[prop].toString(),
                                question_id: Number(data?.id),
                            })
                        }
                    }
                }
            }
        }
    }

    const handleSubmit = (values: FormValues) => {
        if (data) {
            // ----------- Question -----------

            update.mutate({
                id: data.id,
                active: data.active,
                number: values.number,
                question: values.question,
                pillar: values.pillar,
                practice_area: values.practiceArea,
                topic_area: values.topicArea,
                priority: values.priority,
                hint: values.hint,
            }, {
                onSuccess(data) {
                    compareChanges(data, initialValues().question, `Question: `)
                }
            })

            // ----------- Interview Guide -----------

            const mappedExistingGuides = existingGuide.map(o => {
                return {
                    id: o.id,
                    active: true,
                    interview_question: o.interview_question,
                    question_id: data.id,
                    site_id: 1,
                    filter_id: filterSelection ? filterSelection.id : 1,
                }
            })
            updateGuides.mutate(mappedExistingGuides, {
                onSuccess() {
                    mappedExistingGuides.forEach(g => {
                        const former = initialValues().guides.find(formerObject => formerObject.id == g.id);
                        if (former) compareChanges(g, former, `Interview Guide ${g.id ?? ''}: `);
                    })
                }
            });
            createGuides.mutate(newGuide.map(o => {
                return {
                    active: true,
                    interview_question: o.interview_question,
                    question_id: data.id,
                    site_id: 1,
                    filter_id: filterSelection ? filterSelection.id : 1,
                }
            }), {
                onSuccess(data) {
                    const newExistingArray = existingGuide;
                    data.forEach((o, i) => {
                        newExistingArray.push({
                            id: o.id,
                            num: existingGuide.length + i + 1,
                            interview_question: o.interview_question,
                        })
                    });
                    setExistingGuide(newExistingArray);
                    setNewGuide([{ num: 1, interview_question: '' }]);
                }
            });
            deleteGuides.mutate(deletedGuides.map(o => o.id), {
                onSuccess() {
                    deletedGuides.forEach(deleted => {
                        if (deleted.id)
                            createChangelog.mutate({
                                field: 'Interview Guide ' + deleted.id.toString(),
                                former_value: deleted.interview_question,
                                new_value: undefined,
                                question_id: Number(data?.id),
                            })
                    });
                    setDeletedGuides([]);
                }
            })

            // ----------- Reference -----------

            const mappedExistingReferences = existingReferences.map(o => {
                return {
                    id: o.id,
                    citation: o.citation,
                    question_id: data.id,
                }
            })
            updateReferences.mutate(mappedExistingReferences, {
                onSuccess() {
                    mappedExistingReferences.forEach(g => {
                        const former = initialValues().references.find(formerObject => formerObject.id == g.id);
                        if (former) compareChanges(g, former, `Reference ${g.id ?? ''}: `);
                    })
                }
            });
            createReferences.mutate(newReferences.map(o => {
                return {
                    citation: o.citation,
                    question_id: data.id,
                }
            }), {
                onSuccess(data) {
                    const newExistingArray = existingReferences;
                    data.forEach((o, i) => {
                        newExistingArray.push({
                            id: o.id,
                            num: existingReferences.length + i + 1,
                            citation: o.citation,
                        });
                    });
                    setExistingReferences(newExistingArray);
                    setNewReferences([{ num: 1, citation: '' }]);
                }
            });
            deleteReferences.mutate(deletedReferences.map(o => o.id), {
                onSuccess() {
                    deletedReferences.forEach(deleted => {
                        if (deleted.id)
                            createChangelog.mutate({
                                field: 'Reference ' + deleted.id.toString(),
                                former_value: deleted.citation,
                                new_value: undefined,
                                question_id: Number(data?.id),
                            })
                    });
                    setDeletedReferences([]);
                }
            })

            // ----------- Rating -----------

            const mappedRatings: any[] = [];
            for (let i = 1; i <= 5; i++) {
                mappedRatings.push({
                    id: (values as any)[`level${i}`],
                    active: true,
                    level_number: i.toString(),
                    criteria: (values as any)[`criteria${i}`],
                    progression_statement: (values as any)[`progression${i}`],
                    question_id: data.id,
                    filter_id: (filterType != 'default' && filterSelection) ? filterSelection.id : undefined,
                })
            }
            if (ratingData && ratingData.length > 1) {
                updateRatings.mutate(mappedRatings, {
                    onSuccess() {
                        mappedRatings.forEach(g => {
                            const former = initialValues().ratings.find(formerObject => formerObject.id == g.id);
                            if (former) compareChanges(g, former, `Rating ${g.level_number}: `);
                        })
                    }
                });
            } else {
                createRatings.mutate(mappedRatings, {
                    onSuccess(data) {
                        let newQuestionData = questionData;
                        for (let i = 1; i <= 5; i++) {
                            const currRating = data.find(o => o.level_number == i.toString());
                            if (currRating) {
                                newQuestionData = {
                                    ...newQuestionData,
                                    ['level' + i.toString()]: currRating.id,
                                }
                            }
                        }
                        setQuestionData(newQuestionData);
                    }
                });
            }

            // ----------- SME -----------

            if (values.sme) {
                updateSME.mutate({
                    id: values.sme,
                    first_name: values.smeFirstName,
                    last_name: values.smeLastName,
                    mobile_phone: values.smePhone,
                    email: values.smeEmail,
                    question_id: data.id,
                }, {
                    onSuccess(success) {
                        compareChanges(success, initialValues().sme, `SME: `)
                    }
                })
            } else {
                createSME.mutate({
                    first_name: values.smeFirstName,
                    last_name: values.smeLastName,
                    mobile_phone: values.smePhone,
                    email: values.smeEmail,
                    question_id: data.id,
                }, {
                    onSuccess(data) {
                        setQuestionData({ ...questionData, sme: data.id })
                    }
                })
            }

        }
    }


    return (
        <Formik
            enableReinitialize
            initialValues={questionData}
            validationSchema={validationSchema}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={handleSubmit}
        >
            <Form>
                <div className='assessment'>
                    <div className='assessment-content'>
                        <Card className='context'>
                            <div className='question-number'>
                                <Typography>Question # : </Typography>
                                <Field
                                    name='number' label='' size='small'
                                    placeholder='Number...'
                                    component={TextField}
                                />
                                <div className='question-status'>
                                    <div className={'active-signature ' + (data?.active ? 'active' : '')} />
                                    {data?.active ? 'Active' : 'Inactive'}
                                </div>
                            </div>
                            <div>
                                <Button
                                    variant='contained'
                                    color={data?.active ? 'error' : 'success'}
                                    onClick={() => handleActive()}
                                >
                                    {data?.active ? 'Deactivate' : 'Activate'}
                                </Button>
                                <Button variant='contained' type='submit'>Save</Button>
                            </div>
                        </Card>
                        <div className='assessment-form'>
                            <Grid container spacing={2}>
                                <Grid item xs={7}>
                                    <Card className='question-content'>
                                        <div className='widget-header'>General</div>
                                        <div className='widget-body widget-form'>
                                            <Typography>Question Content</Typography>
                                            <Field
                                                name='question' label='' size='small' multiline
                                                placeholder='Question Content...'
                                                component={TextField}
                                            />
                                        </div>
                                        <div className='filters'>
                                            <SelectFilter
                                                filterSelection={filterSelection}
                                                setFilterSelection={setFilterSelection}
                                                filterType={filterType}
                                                setFilterType={setFilterType}
                                            />
                                        </div>
                                        {!(filterType != 'default' && filterSelection == null) &&
                                            <div className='widget-body widget-form'>
                                                <Typography>Level 1</Typography>
                                                <Field
                                                    name='criteria1' label='' size='small' multiline
                                                    placeholder='Criteria...'
                                                    component={TextField}
                                                />
                                                <Typography>Progression Statement</Typography>
                                                <Field
                                                    name='progression1' label='' size='small' multiline
                                                    placeholder='Progression statement...'
                                                    component={TextField}
                                                />
                                                <Typography>Level 2</Typography>
                                                <Field
                                                    name='criteria2' label='' size='small' multiline
                                                    placeholder='Criteria...'
                                                    component={TextField}
                                                />
                                                <Typography>Progression Statement</Typography>
                                                <Field
                                                    name='progression2' label='' size='small' multiline
                                                    placeholder='Progression statement...'
                                                    component={TextField}
                                                />
                                                <Typography>Level 3</Typography>
                                                <Field
                                                    name='criteria3' label='' size='small' multiline
                                                    placeholder='Criteria...'
                                                    component={TextField}
                                                />
                                                <Typography>Progression Statement</Typography>
                                                <Field
                                                    name='progression3' label='' size='small' multiline
                                                    placeholder='Progression statement...'
                                                    component={TextField}
                                                />
                                                <Typography>Level 4</Typography>
                                                <Field
                                                    name='criteria4' label='' size='small' multiline
                                                    placeholder='Criteria...'
                                                    component={TextField}
                                                />
                                                <Typography>Progression Statement</Typography>
                                                <Field
                                                    name='progression4' label='' size='small' multiline
                                                    placeholder='Progression statement...'
                                                    component={TextField}
                                                />
                                                <Typography>Level 5</Typography>
                                                <Field
                                                    name='criteria5' label='' size='small' multiline
                                                    placeholder='Criteria...'
                                                    component={TextField}
                                                />
                                            </div>
                                        }
                                    </Card>
                                </Grid>
                                <Grid item xs={5}>
                                    <Card className='reference'>
                                        <div className='widget-header'>General Information</div>
                                        <div className='widget-body widget-form'>
                                            <Grid container spacing={1}>
                                                <Grid item xs={6}>
                                                    <Typography>Pillar</Typography>
                                                    <Field
                                                        name='pillar' label='' size='small'
                                                        placeholder='Pillar...'
                                                        component={TextField}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography>Practice Area</Typography>
                                                    <Field
                                                        name='practiceArea' label='' size='small'
                                                        placeholder='Practice Area...'
                                                        component={TextField}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography>Topic Area</Typography>
                                                    <Field
                                                        name='topicArea' label='' size='small'
                                                        placeholder='Topic Area...'
                                                        component={TextField}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography>Priority</Typography>
                                                    <Field
                                                        name='priority' label='' size='small'
                                                        component={Select}
                                                    >
                                                        <MenuItem value=''><em>Select priority...</em></MenuItem>
                                                        <MenuItem value='low'>
                                                            <PriorityIndicator priority='low' />
                                                        </MenuItem>
                                                        <MenuItem value='medium'>
                                                            <PriorityIndicator priority='medium' />
                                                        </MenuItem>
                                                        <MenuItem value='high'>
                                                            <PriorityIndicator priority='high' />
                                                        </MenuItem>
                                                    </Field>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography>Hint</Typography>
                                                    <Field
                                                        name='hint' label='' size='small'
                                                        placeholder='Hint...'
                                                        component={TextField}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div>
                                            <div className='widget-header'>Interview Guide</div>
                                            <div className='widget-body'>
                                                {existingGuide.map((o, i) => {
                                                    return (
                                                        <div key={i} className='input-row'>
                                                            <Typography style={{ paddingRight: 10 }}>{o.num}.</Typography>
                                                            <MuiTextField
                                                                placeholder='Guide...' size='small'
                                                                value={o.interview_question}
                                                                onChange={(event) => handleGuideChange(o.num, event.target.value, true)}
                                                            />
                                                            <IconButton
                                                                color='default'
                                                                onClick={() => {
                                                                    const newDeleted = deletedGuides;
                                                                    newDeleted.push(o);
                                                                    setDeletedGuides(newDeleted);

                                                                    let count = 0;
                                                                    const newExisting: GuideType[] = []
                                                                    existingGuide.map(x => {
                                                                        if (x.id != o.id) {
                                                                            count++;
                                                                            newExisting.push({
                                                                                ...x,
                                                                                num: count,
                                                                            })
                                                                        }
                                                                    });
                                                                    setExistingGuide(newExisting);

                                                                    const newNew: GuideType[] = []
                                                                    newGuide.map(x => {
                                                                        count++;
                                                                        newNew.push({
                                                                            ...x,
                                                                            num: count,
                                                                        })
                                                                    });
                                                                    setNewGuide(newNew);
                                                                }}
                                                            ><Delete /></IconButton>
                                                        </div>
                                                    )
                                                })}
                                                {newGuide.map((o, i) => {
                                                    if (i == newGuide.length - 1)
                                                        return (
                                                            <div key={i} className='input-row'>
                                                                <Typography style={{ paddingRight: 10 }}>{o.num}.</Typography>
                                                                <MuiTextField
                                                                    placeholder='Guide...' size='small'
                                                                    value={o.interview_question}
                                                                    onChange={(event) => handleGuideChange(o.num, event.target.value)}
                                                                />
                                                                <IconButton
                                                                    onClick={() => {
                                                                        const last = newGuide[newGuide.length - 1];
                                                                        if (last) setNewGuide([...newGuide, { num: last.num + 1, interview_question: '' }])
                                                                    }}
                                                                ><Add /></IconButton>
                                                            </div>
                                                        )
                                                    return (
                                                        <div key={i} className='input-row'>
                                                            <Typography style={{ paddingRight: 10 }}>{o.num}.</Typography>
                                                            <MuiTextField
                                                                placeholder='Guide...' size='small'
                                                                value={o.interview_question}
                                                                onChange={(event) => handleGuideChange(o.num, event.target.value)}
                                                            />
                                                            <IconButton
                                                                color='default'
                                                                onClick={() => {
                                                                    if (newGuide[0]) {
                                                                        let newIndex = (newGuide[0]?.num) - 1;
                                                                        const removed: GuideType[] = [];
                                                                        newGuide.forEach(d => {
                                                                            if (d.num != o.num) {
                                                                                newIndex++;
                                                                                removed.push({
                                                                                    ...d,
                                                                                    num: newIndex,
                                                                                })
                                                                            }
                                                                            return;

                                                                        });
                                                                        setNewGuide(removed);
                                                                    }
                                                                }}
                                                            ><Delete /></IconButton>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        <div>
                                            <div className='widget-header'>References</div>
                                            <div className='widget-body'>
                                                {existingReferences.map((o, i) => {
                                                    return (
                                                        <div key={i} className='input-row'>
                                                            <Typography style={{ paddingRight: 10 }}>{o.num}.</Typography>
                                                            <MuiTextField
                                                                placeholder='Reference...' size='small'
                                                                value={o.citation}
                                                                onChange={(event) => handleReferenceChange(o.num, event.target.value, true)}
                                                            />
                                                            <IconButton
                                                                color='default'
                                                                onClick={() => {
                                                                    const newDeleted = deletedReferences;
                                                                    newDeleted.push(o);
                                                                    setDeletedReferences(newDeleted);

                                                                    let count = 0;
                                                                    const newExisting: ReferenceType[] = []
                                                                    existingReferences.map(x => {
                                                                        if (x.id != o.id) {
                                                                            count++;
                                                                            newExisting.push({
                                                                                ...x,
                                                                                num: count,
                                                                            })
                                                                        }
                                                                    });
                                                                    setExistingReferences(newExisting);

                                                                    const newNew: ReferenceType[] = []
                                                                    newReferences.map(x => {
                                                                        count++;
                                                                        newNew.push({
                                                                            ...x,
                                                                            num: count,
                                                                        })
                                                                    });
                                                                    setNewReferences(newNew);
                                                                }}
                                                            ><Delete /></IconButton>
                                                        </div>
                                                    )
                                                })}
                                                {newReferences.map((o, i) => {
                                                    if (i == newReferences.length - 1)
                                                        return (
                                                            <div key={i} className='input-row'>
                                                                <Typography style={{ paddingRight: 10 }}>{o.num}.</Typography>
                                                                <MuiTextField
                                                                    placeholder='Reference...' size='small'
                                                                    value={o.citation}
                                                                    onChange={(event) => handleReferenceChange(o.num, event.target.value)}
                                                                />
                                                                <IconButton
                                                                    onClick={() => {
                                                                        const last = newReferences[newReferences.length - 1];
                                                                        if (last) setNewReferences([...newReferences, { num: last.num + 1, citation: '' }])
                                                                    }}
                                                                ><Add /></IconButton>
                                                            </div>
                                                        )
                                                    return (
                                                        <div key={i} className='input-row'>
                                                            <Typography style={{ paddingRight: 10 }}>{o.num}.</Typography>
                                                            <MuiTextField
                                                                placeholder='Reference...' size='small'
                                                                value={o.citation}
                                                                onChange={(event) => handleReferenceChange(o.num, event.target.value)}
                                                            />
                                                            <IconButton
                                                                color='default'
                                                                onClick={() => {
                                                                    if (newReferences[0]) {
                                                                        let newIndex = (newReferences[0]?.num) - 1;
                                                                        const removed: ReferenceType[] = [];
                                                                        newReferences.forEach(d => {
                                                                            if (d.num != o.num) {
                                                                                newIndex++;
                                                                                removed.push({
                                                                                    ...d,
                                                                                    num: newIndex,
                                                                                })
                                                                            }
                                                                            return;

                                                                        });
                                                                        setNewReferences(removed);
                                                                    }
                                                                }}
                                                            ><Delete /></IconButton>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        <div>
                                            <div className='widget-header'>SME Information</div>
                                            <div className='widget-body widget-form'>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={6}>
                                                        <Typography>First Name</Typography>
                                                        <Field
                                                            name='smeFirstName' label='' size='small'
                                                            placeholder='First Name...'
                                                            component={TextField}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography>Last Name</Typography>
                                                        <Field
                                                            name='smeLastName' label='' size='small'
                                                            placeholder='Last Name...'
                                                            component={TextField}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography>Phone Number</Typography>
                                                        <Field
                                                            name='smePhone' label='' size='small'
                                                            placeholder='Phone Number...'
                                                            component={TextField}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography>Email</Typography>
                                                        <Field
                                                            name='smeEmail' label='' size='small'
                                                            placeholder='Email...'
                                                            component={TextField}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        </div>
                                        <div>
                                            <div className='widget-header'>Details</div>
                                            <div className='widget-body information-list'>
                                                <div>
                                                    <Typography>Owned By:</Typography>
                                                    <Typography></Typography>
                                                </div>
                                                <div>
                                                    <Typography>Updated At:</Typography>
                                                    <Typography>{data?.updated_at.toLocaleString()}</Typography>
                                                </div>
                                                <div>
                                                    <Typography>Updated By:</Typography>
                                                    <Typography>{data?.updated_by}</Typography>
                                                </div>
                                                <div>
                                                    <Typography>Created At:</Typography>
                                                    <Typography>{data?.created_at.toLocaleString()}</Typography>
                                                </div>
                                                <div>
                                                    <Typography>Created By:</Typography>
                                                    <Typography>{data?.created_by}</Typography>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Grid>
                                <Grid item xs={12}>
                                    <Card>
                                        <div className='widget-header'>Changelog</div>
                                        <ChangelogTable changelogs={data?.changelogs} fileName={`Question${data ? data.id : ''} Changelog`} />
                                    </Card>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </div>
            </Form>
        </Formik>
    );
};

export default EditQuestion;