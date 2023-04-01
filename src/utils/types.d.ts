import { number } from "zod";

export interface Client {
    id: number;

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
    id: number;

    name: string;
    street_address: string
    city: string;
    state: string;
    country: string;
    zip_code: string;
    description: string;

    client_id: number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: string;
    updated_by: string;
}

export interface POC {
    id: number;

    first_name: string;
    last_name: string;
    title: string;
    mobile_phone_number: string;
    work_phone_number: string;
    email: string;
    staff: string;

    user_id: number;
    client_id: number;
    engagement_id: number;
    site_id: number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: string;
    updated_by: string;
}

export interface Question {
    id: number;

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
    id: number;

    active: string;
    level_number: string;
    criteria: string;
    progression_statement: string;
    api_segment: string;
    industry_segment: string;

    question_id: number;
    site_id: number;
    filter_id: number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: string;
    updated_by: string;
}

export interface Reference {
    id: number;

    citation: string;

    question_id: number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: string;
    updated_by: string;
}

export interface SME {
    id: number;

    first_name: string;
    last_name: string;
    mobile_phone_number: string;
    email: string;

    question_id: number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: string;
    updated_by: string;
}

export interface InterviewGuide {
    id: number;

    active: string;
    interview_question: string;

    question_id: number;
    site_id: number;
    filter_id: number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: string;
    updated_by: string;
}

export interface Filter {
    id: number;

    type: string;
    name: string;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: string;
    updated_by: string;
}

export interface Engagement {
    id: number;

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

    client_id: number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: string;
    updated_by: string;
}

export interface Assessment {
    id: number;

    status: string;
    export: string;
    dates: DateTime;
    side_description: string;
    side_address: string;

    site_id: number;
    engagement_id: number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: string;
    updated_by: string;
}

export interface AssessmentUser {
    id: number;

    user_id: number;
    assessment_id: number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: string;
    updated_by: string;
}

export interface AssessmentQuestion {
    id: number;

    question_id: number;
    assessment_id: number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: string;
    updated_by: string;
}

export interface Answer {
    id: number;

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
    id: number;

    time: DateTime;

    answer_id: number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: string;
    updated_by: string;
}
