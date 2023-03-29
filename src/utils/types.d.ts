import { number } from "zod";

export interface Client {
    id: Number;

    first_name: String;
    last_name: String;
    street_address: String
    city: String;
    state: String;
    country: String;
    zip_code: String;
    description: String;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: String;
    updated_by: String;
}

export interface Site {
    id: Number;

    name: String;
    street_address: String
    city: String;
    state: String;
    country: String;
    zip_code: String;
    description: String;

    client_id: Number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: String;
    updated_by: String;
}

export interface POC {
    id: Number;

    first_name: String;
    last_name: String;
    title: String;
    mobile_phone_number: String;
    work_phone_number: String;
    email: String;
    staff: String;

    user_id: Number;
    client_id: Number;
    engagement_id: Number;
    site_id: Number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: String;
    updated_by: String;
}

export interface Question {
    id: Number;

    active: String;
    question: String;
    pillar: String;
    practice_area: String;
    topic_area: String;
    hint: String;
    priority: String;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: String;
    updated_by: String;
}

export interface Rating {
    id: Number;

    active: String;
    level_number: String;
    criteria: String;
    progression_statement: String;
    api_segment: String;
    industry_segment: String;

    question_id: Number;
    site_id: Number;
    filter_id: Number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: String;
    updated_by: String;
}

export interface Reference {
    id: Number;

    citation: String;

    question_id: Number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: String;
    updated_by: String;
}

export interface SME {
    id: Number;

    first_name: String;
    last_name: String;
    mobile_phone_number: String;
    email: String;

    question_id: Number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: String;
    updated_by: String;
}

export interface InterviewGuide {
    id: Number;

    active: String;
    interview_question: String;

    question_id: Number;
    site_id: Number;
    filter_id: Number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: String;
    updated_by: String;
}

export interface Filter {
    id: Number;

    type: String;
    name: String;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: String;
    updated_by: String;
}

export interface Engagement {
    id: Number;

    start_date: DateTime;
    end_date: DateTime;
    description: String;
    status: String;
    shabas_poc: String;
    shabas_poc_contact_info: String;
    client_poc: String;
    client_poc_role: String;
    client_poc_contact_info: String;
    lead_assessor: String;

    client_id: Number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: String;
    updated_by: String;
}

export interface Assessment {
    id: Number;

    status: String;
    export: String;
    dates: DateTime;
    side_description: String;
    side_address: String;

    site_id: Number;
    engagement_id: Number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: String;
    updated_by: String;
}

export interface AssessmentUser {
    id: Number;

    user_id: Number;
    assessment_id: Number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: String;
    updated_by: String;
}

export interface AssessmentQuestion {
    id: Number;

    question_id: Number;
    assessment_id: Number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: String;
    updated_by: String;
}

export interface Answer {
    id: Number;

    assessor_rating: String;
    assessor_explanation: String;
    assessor_evidence: String;
    consensus_rating: String;
    consensus_explanation: String;
    consensus_evidence: String;
    oversight_concurrence: String;
    oversight_explanation: String;
    oversight_evidence: String;
    client_concurrence: String;
    client_explanation: String;
    client_evidence: String;

    user_id: number;
    question_id: number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: String;
    updated_by: String;
}

export interface StartTime {
    id: Number;

    time: DateTime;

    answer_id: Number;

    created_at: DateTime;
    updated_at: DateTime;
    created_by: String;
    updated_by: String;
}
