import * as React from 'react';
import Router from 'next/router';
import type { Filter, Question } from '@prisma/client';

import * as yup from "yup";
import { Field, Form, Formik } from "formik";
import TextField from '~/components/Form/TextField';
import Select from '~/components/Form/Select';

import { Button, Card, Grid, MenuItem, Typography } from '@mui/material';
import { Delete } from '@mui/icons-material';

import { api } from "~/utils/api";
import { underscoreToTitle } from '~/utils/utils';
import ChangelogTable from '~/components/Table/ChangelogTable';
import SelectFilter from '~/components/Question/SelectFilter';
import PriorityIndicator from './PriorityIndicator';
import InputList from './InputList';
import ConfirmModal from '../Modal/Common/ConfirmModal';
import router from 'next/router';

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
    rating?: number;
    criteria1: string;
    progression1: string;
    criteria2: string;
    progression2: string;
    criteria3: string;
    progression3: string;
    criteria4: string;
    progression4: string;
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
        questionId: data?.id,
        filterId: (filterType != 'default' && filterSelection) ? filterSelection.id : undefined,
    }).data;

    interface AllValues {
        question: any;
        guides: any[];
        references: any[];
        ratings: any;
        sme: any;
    }

    const initialValues = (): AllValues => {
        return {
            question: data,
            guides: data?.interview_guides,
            references: data?.references,
            ratings: ratingData,
            sme: data?.sme,
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

    const createRating = api.rating.create.useMutation();
    const updateRating = api.rating.update.useMutation();

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

                rating: ratingData?.id ?? undefined,
                criteria1: ratingData?.criteria_1 ?? '',
                progression1: ratingData?.progression_statement_1 ?? '',
                criteria2: ratingData?.criteria_2 ?? '',
                progression2: ratingData?.progression_statement_2 ?? '',
                criteria3: ratingData?.criteria_3 ?? '',
                progression3: ratingData?.progression_statement_3 ?? '',
                criteria4: ratingData?.criteria_4 ?? '',
                progression4: ratingData?.progression_statement_4 ?? '',
                criteria5: ratingData?.criteria_5 ?? '',

                sme: data.sme?.id ?? '',
                smeFirstName: data.sme?.first_name ?? '',
                smeLastName: data.sme?.last_name ?? '',
                smeEmail: data.sme?.email ?? '',
                smePhone: data.sme?.mobile_phone ?? '',
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

            let newFormState = questionData;

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
                onSuccess(success: Question) {
                    newFormState = {
                        ...newFormState,
                        number: success.number,
                        question: success.question,
                        pillar: success.pillar,
                        practiceArea: success.practice_area,
                        topicArea: success.topic_area,
                        priority: success.priority,
                        hint: success.hint,
                    };
                    compareChanges(success, initialValues().question, `Question: `)
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
                    const lastNum = existingGuide.length + 1;
                    data.forEach((o, i) => {
                        newExistingArray.push({
                            id: o.id,
                            num: lastNum + i,
                            interview_question: o.interview_question,
                        })
                    });
                    setExistingGuide(newExistingArray);
                    setNewGuide([{ num: newExistingArray.length + 1, interview_question: '' }]);
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
                    const lastNum = existingReferences.length + 1;
                    data.forEach((o, i) => {
                        newExistingArray.push({
                            id: o.id,
                            num: lastNum + i,
                            citation: o.citation,
                        });
                    });
                    setExistingReferences(newExistingArray);
                    setNewReferences([{ num: newExistingArray.length + 1, citation: '' }]);
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

            if (values.rating) {
                updateRating.mutate({
                    id: values.rating,
                    question_id: data.id,
                    criteria_1: values.criteria1,
                    progression_statement_1: values.progression1,
                    criteria_2: values.criteria2,
                    progression_statement_2: values.progression2,
                    criteria_3: values.criteria3,
                    progression_statement_3: values.progression3,
                    criteria_4: values.criteria4,
                    progression_statement_4: values.progression4,
                    criteria_5: values.criteria5,
                }, {
                    onSuccess(success) {
                        newFormState = {
                            ...newFormState,
                            rating: success.id,
                            criteria1: success.criteria_1,
                            progression1: success.progression_statement_1,
                            criteria2: success.criteria_2,
                            progression2: success.progression_statement_2,
                            criteria3: success.criteria_3,
                            progression3: success.progression_statement_3,
                            criteria4: success.criteria_4,
                            progression4: success.progression_statement_4,
                            criteria5: success.criteria_5,
                        };
                        compareChanges(success, initialValues().ratings, `Ratings: `);
                    }
                });
            } else {
                createRating.mutate({
                    question_id: data.id,
                    filter_id: (filterType != 'default' && filterSelection) ? filterSelection.id : undefined,
                    criteria_1: values.criteria1,
                    progression_statement_1: values.progression1,
                    criteria_2: values.criteria2,
                    progression_statement_2: values.progression2,
                    criteria_3: values.criteria3,
                    progression_statement_3: values.progression3,
                    criteria_4: values.criteria4,
                    progression_statement_4: values.progression4,
                    criteria_5: values.criteria5,
                }, {
                    onSuccess(success) {
                        newFormState = {
                            ...newFormState,
                            rating: success.id,
                            criteria1: success.criteria_1,
                            progression1: success.progression_statement_1,
                            criteria2: success.criteria_2,
                            progression2: success.progression_statement_2,
                            criteria3: success.criteria_3,
                            progression3: success.progression_statement_3,
                            criteria4: success.criteria_4,
                            progression4: success.progression_statement_4,
                            criteria5: success.criteria_5,
                        };
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
                        newFormState = {
                            ...newFormState,
                            sme: data.id,
                            smeFirstName: data.first_name,
                            smeLastName: data.last_name,
                            smePhone: data.mobile_phone,
                            smeEmail: data.email,
                        }
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
                        newFormState = {
                            ...newFormState,
                            sme: data.id,
                            smeFirstName: data.first_name,
                            smeLastName: data.last_name,
                            smePhone: data.mobile_phone,
                            smeEmail: data.email,
                        }
                    }
                })
            }
            setQuestionData(newFormState)
        }
    }


    // =========== Deletion Management ===========

    const [deleteModal, setDeleteModal] = React.useState<boolean>(false);
    const [deleteError, setDeleteError] = React.useState<string | undefined>(undefined);
    const deleteQuestion = api.question.deleteById.useMutation();

    return (<>
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
                                    color={data?.active ? 'inherit' : 'success'}
                                    onClick={() => handleActive()}
                                >
                                    {data?.active ? 'Deactivate' : 'Activate'}
                                </Button>
                                <Button variant='contained' color='error' onClick={() => setDeleteModal(true)}>Delete</Button>
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
                                                <div className='informational-text'>
                                                    Please save changes before editing or creating a different set of filtered ratings.
                                                </div>
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
                                                {filterSelection &&
                                                    <Button
                                                        color='error'
                                                        variant='contained'
                                                    >
                                                        Delete Filter Ratings
                                                    </Button>
                                                }
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
                                                <InputList
                                                    existingObjects={existingGuide}
                                                    setExistingObjects={setExistingGuide}
                                                    newObjects={newGuide}
                                                    setNewObjects={setNewGuide}
                                                    deletedObjects={deletedGuides}
                                                    setDeletedObjects={setDeletedGuides}
                                                    property='interview_question'
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className='widget-header'>References</div>
                                            <div className='widget-body'>
                                                <InputList
                                                    existingObjects={existingReferences}
                                                    setExistingObjects={setExistingReferences}
                                                    newObjects={newReferences}
                                                    setNewObjects={setNewReferences}
                                                    deletedObjects={deletedReferences}
                                                    setDeletedObjects={setDeletedReferences}
                                                    property='citation'
                                                />
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
        {deleteModal &&
            <ConfirmModal
                title={`Delete Question ${data?.id}`}
                message='Are you sure you want to permanently delete this question?'
                errorMessage={deleteError}
                handleConfirm={() => {
                    deleteQuestion.mutate(Number(data?.id), {
                        onError(err) {
                            setDeleteError(err.message);
                        },
                        onSuccess() {
                            setDeleteError(undefined);
                            router.push('/questions');
                        }
                    });
                }}
                open={deleteModal}
                setOpen={setDeleteModal}
            />
        }
    </>)
};

export default EditQuestion;