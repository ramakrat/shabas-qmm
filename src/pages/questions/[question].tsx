import * as React from 'react';
import { type NextPage } from "next";
import Router, { useRouter } from 'next/router';
import type { Filter, Rating } from '@prisma/client';

import {
    Button, Card, Grid, IconButton, MenuItem, Select,
    TextField, ToggleButton, ToggleButtonGroup, Typography
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

import { api } from "~/utils/api";
import Layout from "~/components/Layout/Layout";
import BusinessTypeModal from '~/components/Administrator/QuestionFilters/BusinessTypeModal';
import ManufacturingTypeModal from '~/components/Administrator/QuestionFilters/ManufacturingTypeModal';
import SiteSpecificModal from '~/components/Administrator/QuestionFilters/SiteSpecificModal';
import ChangelogTable from '~/components/Common/ChangelogTable';
import { underscoreToTitle } from '~/utils/utils';

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

interface RatingType {
    level_number: number;
    criteria: string;
    progression_statement: string;
}

const Question: NextPage = () => {

    const { question } = useRouter().query;

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
    const fullChangelog = api.changelog.getAllByQuestion.useQuery(data?.id).data;

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

    const [active, setActive] = React.useState<boolean>(true);
    const [number, setNumber] = React.useState<string>('');
    const [questionContent, setQuestionContent] = React.useState<string>('');
    const [pillar, setPillar] = React.useState<string>('');
    const [practiceArea, setPracticeArea] = React.useState<string>('');
    const [topicArea, setTopicArea] = React.useState<string>('');
    const [hint, setHint] = React.useState<string>('');
    const [priority, setPriority] = React.useState<string>('');

    const [firstName, setFirstName] = React.useState<string>('');
    const [lastName, setLastName] = React.useState<string>('');
    const [email, setEmail] = React.useState<string>('');
    const [phone, setPhone] = React.useState<string>('');

    const [existingGuide, setExistingGuide] = React.useState<GuideType[]>([]);
    const [newGuide, setNewGuide] = React.useState<GuideType[]>([{ num: 1, interview_question: '' }]);
    const [deletedGuides, setDeletedGuides] = React.useState<GuideType[]>([]);

    const [existingReferences, setExistingReferences] = React.useState<ReferenceType[]>([]);
    const [newReferences, setNewReferences] = React.useState<ReferenceType[]>([{ num: 1, citation: '' }]);
    const [deletedReferences, setDeletedReferences] = React.useState<ReferenceType[]>([]);

    const [ratings, setRatings] = React.useState<Rating[] | RatingType[]>([{
        level_number: 1,
        criteria: '',
        progression_statement: '',
    }, {
        level_number: 2,
        criteria: '',
        progression_statement: '',
    }, {
        level_number: 3,
        criteria: '',
        progression_statement: '',
    }, {
        level_number: 4,
        criteria: '',
        progression_statement: '',
    }, {
        level_number: 5,
        criteria: '',
        progression_statement: '',
    }]);


    React.useEffect(() => {
        if (SME) {
            setFirstName(SME.first_name);
            setLastName(SME.last_name);
            setEmail(SME.email);
            setPhone(SME.mobile_phone);
        }
    }, [SME]);

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

    React.useEffect(() => {
        if (ratingData && ratingData.length > 1) {
            setRatings(ratingData)
        } else {
            setRatings([{
                level_number: 1,
                criteria: '',
                progression_statement: '',
            }, {
                level_number: 2,
                criteria: '',
                progression_statement: '',
            }, {
                level_number: 3,
                criteria: '',
                progression_statement: '',
            }, {
                level_number: 4,
                criteria: '',
                progression_statement: '',
            }, {
                level_number: 5,
                criteria: '',
                progression_statement: '',
            }])
        }
    }, [ratingData])

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

    const handleRatingChange = (num: number, newVal: string, criteria?: boolean) => {
        const newArr = ratings.map(o => {
            if (o.level_number == num) {
                if (criteria)
                    return {
                        ...o,
                        criteria: newVal,
                    }
                return {
                    ...o,
                    progression_statement: newVal,
                }
            }
            return o;
        }) as (Rating[] | RatingType[]);
        setRatings(newArr);
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
        if (data) {
            setActive(data.active);
            setNumber(data.number);
            setQuestionContent(data.question);
            setPillar(data.pillar);
            setPracticeArea(data.practice_area);
            setTopicArea(data.topic_area);
            setHint(data.hint);
            setPriority(data.priority);
        }
    }, [data])

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

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (data) {
            let succeeded = true;

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

            const mappedExistingReferences = existingReferences.map(o => {
                return {
                    id: o.id,
                    citation: o.citation,
                    question_id: data.id,
                }
            })

            const mappedExistingRatings = ratings.map(r => {
                const o = r as Rating;
                return {
                    id: o.id,
                    active: true,
                    level_number: o.level_number.toString(),
                    criteria: o.criteria,
                    progression_statement: o.progression_statement,
                    question_id: data.id,
                    filter_id: (filterType != 'default' && filterSelection) ? filterSelection.id : undefined,
                }
            })

            // ----------- Question -----------

            update.mutate({
                id: data.id,
                active: active,
                number: number,
                question: questionContent,
                pillar: pillar,
                practice_area: practiceArea,
                topic_area: topicArea,
                hint: hint,
                priority: priority,
            }, {
                onSuccess(data) {
                    compareChanges(data, initialValues().question, `Question: `)
                },
                onError(err) {
                    succeeded = false;
                    console.log(err);
                }
            })

            // ----------- Interview Guide -----------

            updateGuides.mutate(mappedExistingGuides, {
                onSuccess() {
                    mappedExistingGuides.forEach(g => {
                        const former = initialValues().guides.find(formerObject => formerObject.id == g.id);
                        if (former) compareChanges(g, former, `Interview Guide ${g.id ?? ''}: `);
                    })
                },
                onError(err) {
                    succeeded = false;
                    console.log(err);
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
                onError(err) {
                    succeeded = false;
                    console.log(err);
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
                    })
                }
            })

            // ----------- Reference -----------

            updateReferences.mutate(mappedExistingReferences, {
                onSuccess() {
                    mappedExistingReferences.forEach(g => {
                        const former = initialValues().references.find(formerObject => formerObject.id == g.id);
                        if (former) compareChanges(g, former, `Reference ${g.id ?? ''}: `);
                    })
                },
                onError(err) {
                    succeeded = false;
                    console.log(err);
                }
            });
            createReferences.mutate(newReferences.map(o => {
                return {
                    citation: o.citation,
                    question_id: data.id,
                }
            }), {
                onError(err) {
                    succeeded = false;
                    console.log(err);
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
                    })
                }
            })

            // ----------- Rating -----------

            if (ratingData && ratingData.length > 1) {
                updateRatings.mutate(mappedExistingRatings, {
                    onSuccess() {
                        mappedExistingRatings.forEach(g => {
                            const former = initialValues().ratings.find(formerObject => formerObject.id == g.id);
                            if (former) compareChanges(g, former, `Rating ${g.level_number}: `);
                        })
                    },
                    onError(err) {
                        succeeded = false;
                        console.log(err);
                    }
                });
            } else {
                createRatings.mutate(ratings.map(o => {
                    return {
                        active: true,
                        level_number: o.level_number.toString(),
                        criteria: o.criteria,
                        progression_statement: o.progression_statement,
                        question_id: data.id,
                        filter_id: (filterType != 'default' && filterSelection) ? filterSelection.id : undefined,
                    }
                }), {
                    onError(err) {
                        succeeded = false;
                        console.log(err);
                    }
                });
            }

            // ----------- SME -----------

            if (SME) {
                updateSME.mutate({
                    id: SME.id,
                    first_name: firstName,
                    last_name: lastName,
                    mobile_phone: phone,
                    email: email,
                    question_id: data.id,
                }, {
                    onSuccess(success) {
                        compareChanges(success, initialValues().sme, `SME: `)
                    },
                    onError(err) {
                        succeeded = false;
                        console.log(err);
                    }
                })
            } else {
                createSME.mutate({
                    first_name: firstName,
                    last_name: lastName,
                    mobile_phone: phone,
                    email: email,
                    question_id: data.id,
                }, {
                    onError(err) {
                        succeeded = false;
                        console.log(err);
                    }
                })
            }

            if (succeeded) {
                // Router.reload();
            }
        }
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
            </Select>
        </>)
    }

    if (inUse) {
        return (
            <Layout active='questions' admin>
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
                                                {ratings.map((r, i) => {
                                                    return (
                                                        <>
                                                            <div key={'level-' + i}>
                                                                <Typography>Level {r.level_number}:</Typography>
                                                                <Typography>{r.criteria}</Typography>
                                                            </div>
                                                            {i !== ratings.length - 1 &&
                                                                <div key={'progression-' + i}>
                                                                    <Typography>Progression Statement:</Typography>
                                                                    <Typography>{r.progression_statement}</Typography>
                                                                </div>
                                                            }
                                                        </>
                                                    )
                                                })}
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
                                                <Typography>{pillar}</Typography>
                                            </div>
                                            <div>
                                                <Typography>Practice Area:</Typography>
                                                <Typography>{practiceArea}</Typography>
                                            </div>
                                            <div>
                                                <Typography>Topic Area:</Typography>
                                                <Typography>{topicArea}</Typography>
                                            </div>
                                            <div>
                                                <Typography>Priority:</Typography>
                                                <Typography>{priority}</Typography>
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
                                                    <Typography>{firstName}</Typography>
                                                </div>
                                                <div>
                                                    <Typography>Last Name</Typography>
                                                    <Typography>{lastName}</Typography>
                                                </div>
                                                <div>
                                                    <Typography>Phone Number</Typography>
                                                    <Typography>{phone}</Typography>
                                                </div>
                                                <div>
                                                    <Typography>Email</Typography>
                                                    <Typography>{email}</Typography>
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
        <Layout active='questions' admin>
            <form onSubmit={handleSubmit}>
                <div className='assessment'>
                    <div className='assessment-content'>
                        <Card className='context'>
                            <div className='question-number'>
                                <Typography>Question # : </Typography>
                                <TextField
                                    name='number' size='small'
                                    value={number}
                                    onChange={e => setNumber(e.target.value)}
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
                                            <TextField
                                                name='question' size='small' multiline
                                                value={questionContent}
                                                onChange={e => setQuestionContent(e.target.value)}
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
                                                {ratings.map((o) => {
                                                    return (
                                                        <>
                                                            <Typography>Level {o.level_number}</Typography>
                                                            <TextField
                                                                placeholder='Criteria...' size='small' multiline
                                                                value={o.criteria}
                                                                onChange={(event) => handleRatingChange(Number(o.level_number), event.target.value, true)}
                                                            />
                                                            {(Number(o.level_number) < 5) &&
                                                                <>
                                                                    <Typography>Progression Statement</Typography>
                                                                    <TextField
                                                                        placeholder='Progression statement...' size='small' multiline
                                                                        value={o.progression_statement}
                                                                        onChange={(event) => handleRatingChange(Number(o.level_number), event.target.value, false)}
                                                                    />
                                                                </>
                                                            }
                                                        </>
                                                    )
                                                })}
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
                                                    <TextField
                                                        name='pillar' size='small' placeholder='Pillar...'
                                                        value={pillar}
                                                        onChange={e => setPillar(e.target.value)}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography>Practice Area</Typography>
                                                    <TextField
                                                        name='practiceArea' size='small' placeholder='Practice Area...'
                                                        value={practiceArea}
                                                        onChange={e => setPracticeArea(e.target.value)}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography>Topic Area</Typography>
                                                    <TextField
                                                        name='topicArea' size='small' placeholder='Topic Area...'
                                                        value={topicArea}
                                                        onChange={e => setTopicArea(e.target.value)}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography>Priority</Typography>
                                                    <TextField
                                                        name='priority' size='small' placeholder='Priority...'
                                                        value={priority}
                                                        onChange={e => setPriority(e.target.value)}
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
                                                            <TextField
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
                                                                <TextField
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
                                                            <TextField
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
                                                            <TextField
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
                                                                <TextField
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
                                                            <TextField
                                                                placeholder='Reference...' size='small'
                                                                value={o.citation}
                                                                onChange={(event) => handleReferenceChange(o.num, event.target.value)}
                                                            />
                                                            <IconButton
                                                                color='default'
                                                                onClick={() => {
                                                                    if (newGuide[0]) {
                                                                        let newIndex = (newGuide[0]?.num) - 1;
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
                                                        <TextField
                                                            name='firstName' size='small' placeholder='First Name...'
                                                            value={firstName}
                                                            onChange={e => setFirstName(e.target.value)}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography>Last Name</Typography>
                                                        <TextField
                                                            name='lastName' size='small' placeholder='Last Name...'
                                                            value={lastName}
                                                            onChange={e => setLastName(e.target.value)}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography>Phone Number</Typography>
                                                        <TextField
                                                            name='phone' size='small' placeholder='Phone Number...'
                                                            value={phone}
                                                            onChange={e => setPhone(e.target.value)}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography>Email</Typography>
                                                        <TextField
                                                            name='email' size='small' placeholder='Email...'
                                                            value={email}
                                                            onChange={e => setEmail(e.target.value)}
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
            </form>
        </Layout>
    );
};

export default Question;