import Layout from "../Layout/Layout";

export const AccessDenied: React.FC = () => {
    return (
        <Layout empty>
            <div className='page-message'>
                <span className='title'>
                    Access Denied
                </span>
                <span className='subheading'>
                    Contact an administrator if this is unexpected.
                </span>
            </div>
        </Layout>
    )
}

export default AccessDenied;