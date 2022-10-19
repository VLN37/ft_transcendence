import jwtDecode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import LoadDualSpinner from '../../components/LoadDualSpinner';
import { TokenPayload } from '../../models/TokenPayload';
import { User } from '../../models/User';

import api from '../../services/api';
import userStorage from '../../services/userStorage';

import './style.css';

const AuthCallback = ({ setUser }: any) => {
  const [loading, setLoading] = useState(true);
  const [params] = useSearchParams();

  useEffect(() => {
    const code = params.get('code');

    async function validateCode(code: string | null): Promise<void> {
      setLoading(true);
      if (!code || code.length !== 64) throw new Error('invalid code');

      try {
        const token = await api.authenticate(code);

        const payload = jwtDecode<TokenPayload>(token);
        console.log({ payload });

        const user: User = {
          id: payload.sub,
        };

        userStorage.saveUser(user);

        setUser(user);

        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    }

    validateCode(code);
  }, []);

  if (loading) {
    return (
      <div className="loading-wrapper">
        <LoadDualSpinner />
      </div>
    );
  } else {
    return <Navigate to="/" replace />;
  }

  // return <div>carai</div>;
};

export default AuthCallback;
