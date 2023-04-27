interface Props {
    status: 'ongoing' | 'assessor-review' | 'oversight' | 'client-review' | 'completed';
}

const StatusChip: React.FC<Props> = (props) => {
    const { status } = props;

    return (
        <div>
            {status}
        </div>
    )
};

export default StatusChip;