import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../contexts/userContext';
import { axiosInstance } from '../../utils/axios';

const Logout = () => {
    const history = useHistory();
    const user = useContext(UserContext);

    useEffect(() => {
        user?.logout();
        axiosInstance.get('/api/auth/logout');
        history.push('/');
    });

    return null;
};

export { Logout };
