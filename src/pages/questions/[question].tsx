import * as React from 'react';
import { type NextPage } from "next";
import { useRouter } from 'next/router';
import { Filter, InterviewGuide, Rating, Reference } from '@prisma/client';

import {
    Button, Card, Grid, IconButton, MenuItem, Select, Switch,
    TextField, ToggleButton, ToggleButtonGroup, Typography
} from '@mui/material';
import { Add } from '@mui/icons-material';

import { api } from "~/utils/api";
import Layout from "~/components/Layout/Layout";
import IndustryModal from '~/components/Modals/QuestionFilters/IndustryModal';
import ApiSegmentModal from '~/components/Modals/QuestionFilters/ApiSegmentModal';
import SiteSpecificModal from '~/components/Modals/QuestionFilters/SiteSpecificModal';
import QuestionsSidebar from '~/components/Assessment/QuestionsSidebar';

const Question: NextPage = () => {

    const { push } = useRouter();

    const { question } = useRouter().query;


    const [filterType, setFilterType] = React.useState<string>('standard');
    const [filterSelection, setFilterSelection] = React.useState<{ type: string, id: number }>({ type: '', id: 0 });
    const [addIndustry, setAddIndustry] = React.useState<boolean>(false);
    const [addApiSegment, setAddApiSegment] = React.useState<boolean>(false);
    const [addSiteSpecific, setAddSiteSpecific] = React.useState<boolean>(false);


    const { data } = api.question.getById.useQuery({ id: Number(question) });

    const guideData = api.interviewGuide.getByQuestionId.useQuery({ id: Number(question) }).data;
    const referencesData = api.reference.getByQuestionId.useQuery({ id: Number(question) }).data;
    const SME = api.sme.getByQuestionId.useQuery({ id: Number(question) }).data;
    const ratingData = api.rating.getByQuestionFilter.useQuery({
        questionId: Number(question),
        filterId: filterType != 'standard' ? filterSelection.id : undefined,
    }).data;



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

    interface GuideType {
        id?: number;
        num: number;
        interview_question: string;
    }
    const [existingGuide, setExistingGuide] = React.useState<GuideType[]>([]);
    const [guide, setGuide] = React.useState<GuideType[]>([{ num: 1, interview_question: '' }]);
    interface ReferenceType {
        id?: number;
        num: number;
        citation: string;
    }
    const [existingReferences, setExistingReferences] = React.useState<ReferenceType[]>([]);
    const [references, setReferences] = React.useState<ReferenceType[]>([{ num: 1, citation: '' }]);
    interface RatingType {
        id?: number;
        level_number: number;
        criteria: string;
        progression_statement: string;
    }
    const [existingRatings, setExistingRatings] = React.useState<RatingType[]>([]);
    const [ratings, setRatings] = React.useState<RatingType[]>([]);



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
            const array = guide.map(o => {
                count++;
                return {
                    num: count,
                    interview_question: o.interview_question,
                }
            });
            setGuide(array);
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
            console.log(existingArray)
            setExistingReferences(existingArray);
            const array = references.map(o => {
                count++;
                return {
                    ...o,
                    num: count,
                }
            });
            setReferences(array);
        }
    }, [referencesData])

    React.useEffect(() => {
        if (ratingData) {
            let count = 0;
            const existingArray = ratingData.map(o => {
                count++;
                return {
                    id: o.id,
                    level_number: count,
                    criteria: o.criteria,
                    progression_statement: o.progression_statement,
                }
            });
            setExistingRatings(existingArray);
            const array = ratings.map(o => {
                count++;
                return {
                    ...o,
                    level_number: count,
                }
            });
            setRatings(array);
        }
    }, [ratingData])

    const handleGuideChange = (num: number, newVal: string, existing?: boolean) => {
        const ref = existing ? existingGuide : guide;
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
            setGuide(newArr);
        }
    }

    const handleReferenceChange = (num: number, newVal: string, existing?: boolean) => {
        const ref = existing ? existingReferences : references;
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
            setReferences(newArr);
        }
    }

    const handleRatingChange = (num: number, newVal: string, criteria?: boolean, existing?: boolean) => {
        const ref = existing ? existingRatings : ratings;
        const newArr = ref.map(o => {
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
        });
        if (existing) {
            setExistingRatings(newArr);
        } else {
            setRatings(newArr);
        }
    }

    // =========== Submission Management ===========

    const create = api.question.create.useMutation();
    const update = api.question.update.useMutation();

    const createGuide = api.interviewGuide.create.useMutation();
    const updateGuide = api.interviewGuide.update.useMutation();

    const createReference = api.reference.create.useMutation();
    const updateReference = api.reference.update.useMutation();

    const createSME = api.sme.create.useMutation();
    const updateSME = api.sme.update.useMutation();

    const createRating = api.rating.create.useMutation();
    const updateRating = api.rating.update.useMutation();

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

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (data) {
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
            })
            existingGuide.forEach(o => {
                updateGuide.mutate({
                    id: o.id,
                    active: true,
                    interview_question: o.interview_question,
                    question_id: data.id,
                    site_id: 1,
                    filter_id: filterSelection.id ?? 1,
                })
            })
            guide.forEach(o => {
                if (o.interview_question != '') {
                    createGuide.mutate({
                        active: true,
                        interview_question: o.interview_question,
                        question_id: data.id,
                        site_id: 1,
                        filter_id: filterSelection.id ?? 1,
                    })
                }
            })
            existingReferences.forEach(o => {
                updateReference.mutate({
                    id: o.id,
                    citation: o.citation,
                    question_id: data.id,
                })
            })
            references.forEach(o => {
                if (o.citation != '') {
                    createReference.mutate({
                        citation: o.citation,
                        question_id: data.id,
                    })
                }
            })

            existingRatings.forEach(o => {
                updateRating.mutate({
                    id: o.id,
                    active: true,
                    level_number: o.level_number.toString(),
                    criteria: o.criteria,
                    progression_statement: o.progression_statement,
                    question_id: data.id,
                    filter_id: filterType != 'standard' ? filterSelection.id : undefined,
                })
            })
            ratings.forEach(o => {
                if (o.criteria != '' || o.progression_statement != '') {
                    createRating.mutate({
                        active: true,
                        level_number: o.level_number.toString(),
                        criteria: o.criteria,
                        progression_statement: o.progression_statement,
                        question_id: data.id,
                        filter_id: filterType != 'standard' ? filterSelection.id : undefined,
                    })
                }
            })

            if (SME) {
                updateSME.mutate({
                    id: SME.id,
                    first_name: firstName,
                    last_name: lastName,
                    mobile_phone: phone,
                    email: email,
                    question_id: data.id,
                })
            } else {
                createSME.mutate({
                    first_name: firstName,
                    last_name: lastName,
                    mobile_phone: phone,
                    email: email,
                    question_id: data.id,
                })
            }
        }
    }

    const setQuestionSelection = (question: number) => {
        push('/questions/' + question);
    }

    // =========== Retrieve Form Context ===========

    const questions = api.question.getAll.useQuery().data;

    const industries = api.filter.getAllIndustry.useQuery().data;
    const apiSegments = api.filter.getAllApiSegment.useQuery().data;
    const siteSpecifics = api.filter.getAllSiteSpecific.useQuery().data;


    const filterSelect = () => {
        if (filterType == 'standard') return;

        let filterOptions: Filter[] | undefined = industries;
        if (filterType == 'api-segment') filterOptions = apiSegments;
        if (filterType == 'site-specific') filterOptions = siteSpecifics;
        return (<>
            <Typography style={{ padding: '0px 10px 0px 5px' }}>:</Typography>
            <Select
                size='small' displayEmpty
                value={filterType == filterSelection.type ? filterSelection.id : ''}
                onChange={(event) => setFilterSelection({ type: filterType, id: Number(event.target.value) })}
            >
                <MenuItem value=''><em>Select a filter...</em></MenuItem>
                {filterOptions?.map(o => {
                    return <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem>;
                })}
                <MenuItem>
                    <Button
                        variant='contained'
                        onClick={() => {
                            if (filterType == 'industry') setAddIndustry(true)
                            if (filterType == 'api-segment') setAddApiSegment(true)
                            if (filterType == 'site-specific') setAddSiteSpecific(true)
                        }}
                    >
                        <Add />
                        {filterType == 'industry' && 'Add Industry'}
                        {filterType == 'api-segment' && 'Add API Segment'}
                        {filterType == 'site-specific' && 'Add Site Specific'}
                    </Button>
                </MenuItem>
            </Select>
        </>)
    }

    return (
        <Layout active='questions'>
            <form onSubmit={handleSubmit}>
                <div className='assessment'>
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            {questions &&
                                <QuestionsSidebar
                                    questions={questions}
                                    question={Number(question)}
                                    setQuestion={setQuestionSelection}
                                    addOption
                                />
                            }
                        </Grid>
                        <Grid item xs={10} container spacing={2}>
                            <Grid item xs={12}>
                                <Card className='context'>
                                    <div>
                                        <Typography>Question #</Typography>
                                        <TextField
                                            name='number' size='small'
                                            value={number}
                                            onChange={e => setNumber(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Typography>Pillar (Not Needed)</Typography>
                                        <TextField
                                            name='pillar' size='small'
                                            value={pillar}
                                            onChange={e => setPillar(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Typography>Practice Area</Typography>
                                        <TextField
                                            name='practiceArea' size='small'
                                            value={practiceArea}
                                            onChange={e => setPracticeArea(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Typography>Topic Area</Typography>
                                        <TextField
                                            name='topicArea' size='small'
                                            value={topicArea}
                                            onChange={e => setTopicArea(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Typography>Priority</Typography>
                                        <TextField
                                            name='priority' size='small'
                                            value={priority}
                                            onChange={e => setPriority(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Typography>Active</Typography>
                                        <Switch
                                            checked={active}
                                            onChange={(_event, checked) => setActive(checked)}
                                        />
                                    </div>
                                </Card>
                            </Grid>
                            <Grid item xs={8}>
                                <Card className='filters'>
                                    <ToggleButtonGroup exclusive size='small' value={filterType} onChange={(_event, value) => setFilterType(value)}>
                                        <ToggleButton value='standard'>Standard</ToggleButton>
                                        <ToggleButton value='industry'>Industry</ToggleButton>
                                        <ToggleButton value='api-segment'>API Segment</ToggleButton>
                                        <ToggleButton value='site-specific'>Site Specific</ToggleButton>
                                    </ToggleButtonGroup>
                                    {filterSelect()}
                                </Card>
                                <Card className='question-content'>
                                    <Typography>Question Content</Typography>
                                    <TextField
                                        name='question' size='small' multiline
                                        value={questionContent}
                                        onChange={e => setQuestionContent(e.target.value)}
                                    />
                                    {existingRatings.map((o, i) => {
                                        return (
                                            <div key={i}>
                                                <Typography>Level {o.level_number}</Typography>
                                                <TextField
                                                    placeholder='Criteria...' size='small' multiline
                                                    value={o.criteria}
                                                    onChange={(event) => handleRatingChange(o.level_number, event.target.value, true, true)}
                                                />
                                                {(i != existingRatings.length - 1 || ratings.length != 0) &&
                                                    <>
                                                        <Typography>Progression Statement</Typography>
                                                        <TextField
                                                            placeholder='Progression statement...' size='small' multiline
                                                            value={o.progression_statement}
                                                            onChange={(event) => handleRatingChange(o.level_number, event.target.value, false, true)}
                                                        />
                                                    </>
                                                }
                                            </div>
                                        )
                                    })}
                                    {ratings.map((o, i) => {
                                        return (
                                            <div key={i}>
                                                <Typography>Level {o.level_number}</Typography>
                                                <TextField
                                                    placeholder='Criteria...' size='small' multiline
                                                    value={o.criteria}
                                                    onChange={(event) => handleRatingChange(o.level_number, event.target.value, true)}
                                                />
                                                {(i != ratings.length - 1) &&
                                                    <>
                                                        <Typography>Progression Statement</Typography>
                                                        <TextField
                                                            placeholder='Progression statement...' size='small' multiline
                                                            value={o.progression_statement}
                                                            onChange={(event) => handleRatingChange(o.level_number, event.target.value, false)}
                                                        />
                                                    </>
                                                }
                                            </div>
                                        )
                                    })}
                                    <Button
                                        variant='outlined' startIcon={<Add />}
                                        onClick={() => {
                                            let num = existingRatings.length + 1;
                                            if (ratings.length > 0) num = ratings[ratings.length - 1].level_number + 1;
                                            setRatings([
                                                ...ratings,
                                                {
                                                    level_number: num,
                                                    criteria: '',
                                                    progression_statement: ''
                                                }
                                            ])
                                        }}
                                    >
                                        Add Rating
                                    </Button>
                                </Card>
                                <Card className='actions' style={{ marginTop: 16 }}>
                                    <div>
                                        <Button variant='contained' color='error'>Deactivate</Button>
                                        <Button variant='contained' color='success'>Activate</Button>
                                    </div>
                                    <Button variant='contained' type='submit'>Save</Button>
                                </Card>
                            </Grid>
                            <Grid item xs={4}>
                                <Card className='reference'>
                                    <div>
                                        <Typography>Reference Questions</Typography>
                                        {existingGuide.map((o, i) => {
                                            return (
                                                <div key={i} className='input-row'>
                                                    <Typography style={{ paddingRight: 10 }}>{o.num}.</Typography>
                                                    <TextField
                                                        placeholder='Reference...' size='small'
                                                        value={o.interview_question}
                                                        onChange={(event) => handleGuideChange(o.num, event.target.value, true)}
                                                    />
                                                </div>
                                            )
                                        })}
                                        {guide.map((o, i) => {
                                            if (i == guide.length - 1)
                                                return (
                                                    <div key={i} className='input-row'>
                                                        <Typography style={{ paddingRight: 10 }}>{o.num}.</Typography>
                                                        <TextField
                                                            placeholder='Reference...' size='small'
                                                            value={o.interview_question}
                                                            onChange={(event) => handleGuideChange(o.num, event.target.value)}
                                                        />
                                                        <IconButton
                                                            onClick={() => setGuide([...guide, { num: guide[guide.length - 1].num + 1, criteria: '' }])}
                                                        ><Add /></IconButton>
                                                    </div>
                                                )
                                            return (
                                                <div key={i} className='input-row'>
                                                    <Typography style={{ paddingRight: 10 }}>{o.num}.</Typography>
                                                    <TextField
                                                        placeholder='Reference...' size='small'
                                                        value={o.interview_question}
                                                        onChange={(event) => handleGuideChange(o.num, event.target.value)}
                                                    />
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div>
                                        <Typography>SME Info</Typography>
                                        <TextField
                                            name='firstName' label='First Name' size='small'
                                            value={firstName}
                                            onChange={e => setFirstName(e.target.value)}
                                        />
                                        <TextField
                                            name='lastName' label='Last Name' size='small'
                                            value={lastName}
                                            onChange={e => setLastName(e.target.value)}
                                        />
                                        <TextField
                                            name='phone' label='Phone Number' size='small'
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                        />
                                        <TextField
                                            name='email' label='Email' size='small'
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Typography>References</Typography>
                                        {existingReferences.map((o, i) => {
                                            return (
                                                <div key={i} className='input-row'>
                                                    <Typography style={{ paddingRight: 10 }}>{o.num}.</Typography>
                                                    <TextField
                                                        placeholder='Reference...' size='small'
                                                        value={o.citation}
                                                        onChange={(event) => handleReferenceChange(o.num, event.target.value, true)}
                                                    />
                                                </div>
                                            )
                                        })}
                                        {references.map((o, i) => {
                                            if (i == references.length - 1)
                                                return (
                                                    <div key={i} className='input-row'>
                                                        <Typography style={{ paddingRight: 10 }}>{o.num}.</Typography>
                                                        <TextField
                                                            placeholder='Reference...' size='small'
                                                            value={o.citation}
                                                            onChange={(event) => handleReferenceChange(o.num, event.target.value)}
                                                        />
                                                        <IconButton
                                                            onClick={() => setReferences([...references, { num: references[references.length - 1].num + 1, citation: '' }])}
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
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div>
                                        <Typography>Owned By:</Typography>
                                        <Typography>{'Updated At: ' + data?.updated_at.toLocaleString()}</Typography>
                                        <Typography>{'Updated By: ' + data?.updated_by}</Typography>
                                        <Typography>{'Created At: ' + data?.created_at.toLocaleString()}</Typography>
                                        <Typography>{'Created By: ' + data?.created_by}</Typography>
                                    </div>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
                <IndustryModal open={addIndustry} setOpen={setAddIndustry} />
                <ApiSegmentModal open={addApiSegment} setOpen={setAddApiSegment} />
                <SiteSpecificModal open={addSiteSpecific} setOpen={setAddSiteSpecific} />
            </form>
        </Layout>
    );
};

export default Question;