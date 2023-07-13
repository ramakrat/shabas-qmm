import * as React from 'react';
import type { Filter } from '@prisma/client';

import { Card, Grid, Typography } from '@mui/material';

import { api } from "~/utils/api";
import ChangelogTable from '~/components/Table/ChangelogTable';
import PriorityIndicator from './PriorityIndicator';
import SelectFilter from './SelectFilter';

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

interface Props {
    data: any;
}

const ViewQuestion: React.FC<Props> = (props) => {
    const { data } = props;

    // =========== Form Context ===========

    const [filterType, setFilterType] = React.useState<string>('default');
    const [filterSelection, setFilterSelection] = React.useState<Filter | null>(null);

    const ratingData = api.rating.getByQuestionFilter.useQuery({
        questionId: data?.id,
        filterId: (filterType != 'default' && filterSelection) ? filterSelection.id : undefined,
    }).data;

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

    const [existingReferences, setExistingReferences] = React.useState<ReferenceType[]>([]);


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
            }
        }

        setQuestionData(newQuestionData);
    }, [data, ratingData])


    return (
        <div className='assessment'>
            <div className='assessment-content'>
                <Card className='context'>
                    <div className='question-number'>
                        <Typography>Question # : </Typography>
                        <Typography>{data.number}</Typography>
                        <div className='question-status'>
                            <div className={'active-signature ' + (data?.active ? 'active' : '')} />
                            {data?.active ? 'Active (In Use)' : 'Inactive (In Use)'}
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
                                    <SelectFilter
                                        filterSelection={filterSelection}
                                        setFilterSelection={setFilterSelection}
                                        filterType={filterType}
                                        setFilterType={setFilterType}
                                        readOnly
                                    />
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
                                        <Typography><PriorityIndicator priority={questionData.priority} /></Typography>
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
                                <ChangelogTable changelogs={data?.changelogs} fileName={`Question${data ? data.id : ''} Changelog`} />
                            </Card>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>
    )
};

export default ViewQuestion;