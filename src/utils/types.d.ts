import { number } from "zod";

export interface Client {
    id: Number;

    first_name: string;
    last_name: string;
    street_address: string
    city: string;
    state: string;
    country: string;
    zip_code: string;
    description: string;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: string;
    updated_by: string;
}

export interface Site {
    id: Number;

    name: string;
    street_address: string
    city: string;
    state: string;
    country: string;
    zip_code: string;
    description: string;

    client_id: Number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: string;
    updated_by: string;
}

export interface POC {
    id: Number;

    first_name: string;
    last_name: string;
    title: string;
    mobile_phone_number: string;
    work_phone_number: string;
    email: string;
    staff: string;

    user_id: Number;
    client_id: Number;
    engagement_id: Number;
    site_id: Number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: string;
    updated_by: string;
}

export interface Question {
    id: Number;

    active: string;
    question: string;
    pillar: string;
    practice_area: string;
    topic_area: string;
    hint: string;
    priority: string;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: string;
    updated_by: string;
}

export interface Rating {
    id: Number;

    active: string;
    level_number: string;
    criteria: string;
    progression_statement: string;
    api_segment: string;
    industry_segment: string;

    question_id: Number;
    site_id: Number;
    filter_id: Number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: string;
    updated_by: string;
}

export interface Reference {
    id: Number;

    citation: string;

    question_id: Number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: string;
    updated_by: string;
}

export interface SME {
    id: Number;

    first_name: string;
    last_name: string;
    mobile_phone_number: string;
    email: string;

    question_id: Number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: string;
    updated_by: string;
}

export interface InterviewGuide {
    id: Number;

    active: string;
    interview_question: string;

    question_id: Number;
    site_id: Number;
    filter_id: Number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: string;
    updated_by: string;
}

export interface Filter {
    id: Number;

    type: string;
    name: string;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: string;
    updated_by: string;
}

export interface Engagement {
    id: Number;

    start_date: DateTime;
    end_date: DateTime;
    description: string;
    status: string;
    shabas_poc: string;
    shabas_poc_contact_info: string;
    client_poc: string;
    client_poc_role: string;
    client_poc_contact_info: string;
    lead_assessor: string;

    client_id: Number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: string;
    updated_by: string;
}

export interface Assessment {
    id: Number;

    status: string;
    export: string;
    dates: DateTime;
    side_description: string;
    side_address: string;

    site_id: Number;
    engagement_id: Number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: string;
    updated_by: string;
}

export interface AssessmentUser {
    id: Number;

    user_id: Number;
    assessment_id: Number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: string;
    updated_by: string;
}

export interface AssessmentQuestion {
    id: Number;

    question_id: Number;
    assessment_id: Number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: string;
    updated_by: string;
}

export interface Answer {
    id: Number;

    assessor_rating: string;
    assessor_explanation: string;
    assessor_evidence: string;
    consensus_rating: string;
    consensus_explanation: string;
    consensus_evidence: string;
    oversight_concurrence: string;
    oversight_explanation: string;
    oversight_evidence: string;
    client_concurrence: string;
    client_explanation: string;
    client_evidence: string;

    user_id: number;
    question_id: number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: string;
    updated_by: string;
}

export interface StartTime {
    id: Number;

    time: DateTime;

    answer_id: Number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: string;
    updated_by: string;
}
