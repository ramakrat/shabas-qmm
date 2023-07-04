import { ArrowDownward, HorizontalRule, ArrowUpward } from "@mui/icons-material";

interface Props {
    priority: string;
}

export const PriorityIndicator: React.FC<Props> = (props) => {
    const { priority } = props;

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
    return (
        <div>
            {priority}
        </div>
    )
}

export default PriorityIndicator;