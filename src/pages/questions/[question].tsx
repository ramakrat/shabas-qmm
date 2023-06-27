import * as React from 'react';
import { type NextPage } from "next";
import Router, { useRouter } from 'next/router';
import type { Filter } from '@prisma/client';

import * as yup from "yup";
import { Field, Form, Formik } from "formik";
import TextField from '~/components/Form/TextField';
import Select from '~/components/Form/Select';

import {
    Button, Card, Grid, IconButton, MenuItem, Select as MuiSelect,
    TextField as MuiTextField, ToggleButton, ToggleButtonGroup, Typography
} from '@mui/material';
import { Add, ArrowDownward, ArrowDropDown, ArrowDropUp, ArrowUpward, Delete, HorizontalRule } from '@mui/icons-material';

import { api } from "~/utils/api";
import Layout from "~/components/Layout/Layout";
import BusinessTypeModal from '~/components/Administrator/QuestionFilters/BusinessTypeModal';
import ManufacturingTypeModal from '~/components/Administrator/QuestionFilters/ManufacturingTypeModal';
import SiteSpecificModal from '~/components/Administrator/QuestionFilters/SiteSpecificModal';
import ChangelogTable from '~/components/Common/ChangelogTable';
import { underscoreToTitle } from '~/utils/utils';
import { useSession } from 'next-auth/react';

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

export const priorityIndicator = (priority: string) => {
    if (priority == 'low') {
        return (
            <div className='priority'>
                <ArrowDownward color='success' />
                Low
            </div>
        )
    }
    if (priority == 'medium') {
        return (
            <div className='priority'>
                <HorizontalRule color='primary' />
                Medium
            </div>
        )
    }
    if (priority == 'high') {
        return (
            <div className='priority'>
                <ArrowUpward color='error' />
                High
            </div>
        )
    }
    return priority;
}

const Question: NextPage = () => {

    const { data: session } = useSession();

    const { question } = useRouter().query;
    const [refetch, setRefetch] = React.useState<number>(0);


    // =========== Form Context ===========

    const [filterType, setFilterType] = React.useState<string>('default');
    const [filterSelection, setFilterSelection] = React.useState<Filter | null>(null);
    const [addBusinessType, setAddBusinessType] = React.useState<boolean>(false);
    const [addManufacturingType, setAddManufacturingType] = React.useState<boolean>(false);
    const [addSiteSpecific, setAddSiteSpecific] = React.useState<boolean>(false);

    const { data } = api.question.getById.useQuery({ id: Number(question) });
    const inUse = api.assessmentQuestion.getByQuestionUsage.useQuery(Number(question)).data ? true : false;

    const guideData = api.interviewGuide.getByQuestionId.useQuery({ id: Number(question) }).data;
    const referencesData = api.reference.getByQuestionId.useQuery({ id: Number(question) }).data;
    const SME = api.sme.getByQuestionId.useQuery({ id: Number(question) }).data;
    const ratingData = api.rating.getByQuestionFilter.useQuery({
        questionId: Number(question),
        filterId: (filterType != 'default' && filterSelection) ? filterSelection.id : undefined,
    }).data;
    const fullChangelog = api.changelog.getAllByQuestion.useQuery({ questionId: data?.id, refetch: refetch }).data;

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
            guides: guideData,
            references: referencesData,
            ratings: ratingData,
            sme: SME,
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

    const [active, setActive] = React.useState<boolean>(true);

    const [existingGuide, setExistingGuide] = React.useState<GuideType[]>([]);
    const [newGuide, setNewGuide] = React.useState<GuideType[]>([{ num: 1, interview_question: '' }]);
    const [deletedGuides, setDeletedGuides] = React.useState<GuideType[]>([]);

    const [existingReferences, setExistingReferences] = React.useState<ReferenceType[]>([]);
    const [newReferences, setNewReferences] = React.useState<ReferenceType[]>([{ num: 1, citation: '' }]);
    const [deletedReferences, setDeletedReferences] = React.useState<ReferenceType[]>([]);

    React.useEffect(() => {
        if (guideData) {
            let count = 0;
            const existingArray = guideData.map(o => {
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
    }, [guideData]);

    React.useEffect(() => {
        if (referencesData) {
            let count = 0;
            const existingArray = referencesData.map(o => {
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
    }, [referencesData])

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
            setActive(data.active);
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
        if (SME) {
            newQuestionData = {
                ...newQuestionData,
                sme: SME.id,
                smeFirstName: SME.first_name,
                smeLastName: SME.last_name,
                smeEmail: SME.email,
                smePhone: SME.mobile_phone,
            }
        }
        setQuestionData(newQuestionData);
    }, [data, ratingData, SME])


    const handleActive = () => {
        if (data) {
            changeActive.mutate({
                id: data.id,
                active: !active,
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
                active: active,
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
        setRefetch(refetch + 1);
    }


    // =========== Retrieve Form Context ===========

    // TODO: Don't run query unless modal closed
    const businessTypes = api.filter.getAllBusinessTypes.useQuery(addBusinessType).data;
    const manufacturingTypes = api.filter.getAllManufacturingTypes.useQuery(addManufacturingType).data;
    const siteSpecifics = api.filter.getAllSiteSpecific.useQuery(addSiteSpecific).data;

    const filterSelect = () => {
        if (filterType == 'default') return;

        let filterOptions: Filter[] | undefined = businessTypes;
        if (filterType == 'manufacturing-type') filterOptions = manufacturingTypes;
        if (filterType == 'site-specific') filterOptions = siteSpecifics;

        return (<>
            <Typography style={{ padding: '0px 10px 0px 5px' }}>:</Typography>
            <MuiSelect
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
            </MuiSelect>
        </>)
    }

    if (inUse) {
        return (
            <Layout active='questions' session={session} requiredRoles={['ADMIN']}>
                <div className='assessment'>
                    <div className='assessment-content'>
                        <Card className='context'>
                            <div className='question-number'>
                                <Typography>Question # : </Typography>
                                <Typography>{question}</Typography>
                                <div className='question-status'>
                                    <div className={'active-signature ' + (active ? 'active' : '')} />
                                    {active ? 'Active (In Use)' : 'Inactive (In Use)'}
                                </div>
                            </div>
                        </Card>
                        <div className='assessment-form'>
                            <Grid container spacing={2}>
                                <Grid item xs={7}>
                                    <Card className='question-content'>
                                        <div className='widget-header'>General</div>
                                        <div className='widget-body information-list'>
                                            <div>
                                                <Typography>Question Content:</Typography>
                                                <Typography>{data?.question}</Typography>
                                            </div>
                                        </div>
                                        <div className='filters'>
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
                                            {filterSelect()}
                                        </div>
                                        {!(filterType != 'default' && filterSelection == null) &&
                                            <div className='widget-body information-list'>
                                                <div>
                                                    <Typography>Level 1:</Typography>
                                                    <Typography>{questionData.criteria1}</Typography>
                                                </div>
                                                <div>
                                                    <Typography>Progression Statement:</Typography>
                                                    <Typography>{questionData.progression1}</Typography>
                                                </div>
                                                <div>
                                                    <Typography>Level 2:</Typography>
                                                    <Typography>{questionData.criteria2}</Typography>
                                                </div>
                                                <div>
                                                    <Typography>Progression Statement:</Typography>
                                                    <Typography>{questionData.progression2}</Typography>
                                                </div>
                                                <div>
                                                    <Typography>Level 3:</Typography>
                                                    <Typography>{questionData.criteria3}</Typography>
                                                </div>
                                                <div>
                                                    <Typography>Progression Statement:</Typography>
                                                    <Typography>{questionData.progression3}</Typography>
                                                </div>
                                                <div>
                                                    <Typography>Level 4:</Typography>
                                                    <Typography>{questionData.criteria4}</Typography>
                                                </div>
                                                <div>
                                                    <Typography>Progression Statement:</Typography>
                                                    <Typography>{questionData.progression4}</Typography>
                                                </div>
                                                <div>
                                                    <Typography>Level 5:</Typography>
                                                    <Typography>{questionData.criteria5}</Typography>
                                                </div>
                                            </div>
                                        }
                                    </Card>
                                </Grid>
                                <Grid item xs={5}>
                                    <Card className='reference'>
                                        <div className='widget-header'>General Information</div>
                                        <div className='widget-body information-list'>
                                            <div>
                                                <Typography>Pillar:</Typography>
                                                <Typography>{questionData.pillar}</Typography>
                                            </div>
                                            <div>
                                                <Typography>Practice Area:</Typography>
                                                <Typography>{questionData.practiceArea}</Typography>
                                            </div>
                                            <div>
                                                <Typography>Topic Area:</Typography>
                                                <Typography>{questionData.topicArea}</Typography>
                                            </div>
                                            <div>
                                                <Typography>Priority:</Typography>
                                                <Typography>{priorityIndicator(questionData.priority)}</Typography>
                                            </div>
                                            <div>
                                                <Typography>Hint:</Typography>
                                                <Typography>{questionData.hint}</Typography>
                                            </div>
                                        </div>
                                        <div>
                                            <div className='widget-header'>Interview Guide</div>
                                            <div className='widget-body information-list'>
                                                {existingGuide?.map((r, i) => {
                                                    return (
                                                        <div key={i}>
                                                            <Typography>{i + 1}.</Typography>
                                                            <Typography>{r.interview_question}</Typography>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        <div>
                                            <div className='widget-header'>References</div>
                                            <div className='widget-body information-list'>
                                                {existingReferences?.map((r, i) => {
                                                    return (
                                                        <div key={i}>
                                                            <Typography>{i + 1}.</Typography>
                                                            <Typography>{r.citation}</Typography>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        <div>
                                            <div className='widget-header'>SME Information</div>
                                            <div className='widget-body information-list'>
                                                <div>
                                                    <Typography>First Name: </Typography>
                                                    <Typography>{questionData.smeFirstName}</Typography>
                                                </div>
                                                <div>
                                                    <Typography>Last Name</Typography>
                                                    <Typography>{questionData.smeLastName}</Typography>
                                                </div>
                                                <div>
                                                    <Typography>Phone Number</Typography>
                                                    <Typography>{questionData.smePhone}</Typography>
                                                </div>
                                                <div>
                                                    <Typography>Email</Typography>
                                                    <Typography>{questionData.smeEmail}</Typography>
                                                </div>
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
                                        <ChangelogTable changelogs={fullChangelog} fileName={`Question${data ? data.id : ''} Changelog`} />
                                    </Card>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
    return (
        <Layout active='questions' session={session} requiredRoles={['ADMIN']}>
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
                                        <div className={'active-signature ' + (active ? 'active' : '')} />
                                        {active ? 'Active' : 'Inactive'}
                                    </div>
                                </div>
                                <div>
                                    <Button
                                        variant='contained'
                                        color={active ? 'error' : 'success'}
                                        onClick={() => handleActive()}
                                    >
                                        {active ? 'Deactivate' : 'Activate'}
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
                                                {filterSelect()}
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
                                                                <div className='priority'>
                                                                    <ArrowDownward color='success' />
                                                                    Low
                                                                </div>
                                                            </MenuItem>
                                                            <MenuItem value='medium'>
                                                                <div className='priority'>
                                                                    <HorizontalRule color='primary' />
                                                                    Medium
                                                                </div>
                                                            </MenuItem>
                                                            <MenuItem value='high'>
                                                                <div className='priority'>
                                                                    <ArrowUpward color='error' />
                                                                    High
                                                                </div>
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
                                            <ChangelogTable changelogs={fullChangelog} fileName={`Question${data ? data.id : ''} Changelog`} />
                                        </Card>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    </div>
                    <BusinessTypeModal open={addBusinessType} setOpen={setAddBusinessType} />
                    <ManufacturingTypeModal open={addManufacturingType} setOpen={setAddManufacturingType} />
                    <SiteSpecificModal open={addSiteSpecific} setOpen={setAddSiteSpecific} />
                </Form>
            </Formik>
        </Layout>
    );
};

export default Question;