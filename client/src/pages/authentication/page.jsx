import { useParams } from 'react-router-dom'
import SignUp from './signup/page';
import SignIn from './signin/page';
import TwoAuth from './twoauth/page';

const MainAuthentication = () => {
    const { page } = useParams();
    if (page === 'signup') return <SignUp />;
    if (page === 'login') return <SignIn />;
    if (page === 'twoauth') return <TwoAuth />;
    return <div>MainAuthentication</div>;
}

export default MainAuthentication