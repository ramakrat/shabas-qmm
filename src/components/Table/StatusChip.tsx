import { hyphenToTitle } from "~/utils/utils";

export type AssessmentStatus = 'created' | 'ongoing' | 'ongoing-review' | 'oversight' | 'oversight-review' | 'client' | 'client-review' | 'completed';
export type EngagementStatus = 'pending' | 'open' | 'closed';

interface Props {
    status: AssessmentStatus | EngagementStatus;
}

const StatusChip: React.FC<Props> = (props) => {
    const { status } = props;

    return (
        <div className={'status-chip ' + status}>
            <span>
                {hyphenToTitle(status)}
            </span>
        </div>
    )
};

export default StatusChip;