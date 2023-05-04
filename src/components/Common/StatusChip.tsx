import { hyphenToTitle } from "~/utils/utils";

interface Props {
    status: 'created' | 'ongoing' | 'assessor-review' | 'oversight' | 'client-review' | 'completed';
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