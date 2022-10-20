import jwtDecode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import LoadDualSpinner from '../../components/LoadDualSpinner';
import { TokenPayload } from '../../models/TokenPayload';
import { User } from '../../models/User';

import api from '../../services/api';
import userStorage from '../../services/userStorage';
import { TFAModal } from './components/2fa-modal';

import './style.css';

const AuthCallback = ({ setUser }: any) => {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [params] = useSearchParams();
  const [isSending2fa, setIsSending2fa] = useState(false);

  useEffect(() => {
    const code = params.get('code');

    async function validateCode(code: string | null): Promise<void> {
      setLoading(true);
      if (!code || code.length !== 64) throw new Error('invalid code');

      try {
        const token = await api.authenticate(code);
        api.setToken(token);

        const payload = jwtDecode<TokenPayload>(token);

        if (payload.tfa_enabled && !payload.is_authenticated_twice) {
          start2faFlow();
          return;
        }
        finishLogin(payload);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    }

    validateCode(code);
  }, []);

  const handleSendClick = async (tfaCode: string) => {
    setIsSending2fa(true);
    try {
      const token = await api.authenticate2fa(tfaCode);
      api.setToken(token);
      const payload = jwtDecode<TokenPayload>(token);
      finishLogin(payload);
      setIsSending2fa(true);
    } catch (e) {
      console.error(e);
    }
    setIsModalOpen(false);
  };

  const finishLogin = (payload: any) => {
    console.log({ payload });

    const user: User = {
      id: payload.sub,
    };

    userStorage.saveUser(user);
    setUser(user);
    setLoading(false);
  };

  const onClose = () => {
    console.log('closing modal');
    setIsModalOpen(false);
    setLoading(false);
  };

  const start2faFlow = () => {
    console.log('opening modal');
    setIsModalOpen(true);
  };

  if (loading || isModalOpen) {
    return (
      <div className="loading-wrapper">
        <TFAModal
          isOpen={isModalOpen}
          onClose={onClose}
          handleSendClick={handleSendClick}
          isSending2fa={isSending2fa}
        />
        <LoadDualSpinner />
      </div>
    );
  } else {
    return <Navigate to="/" replace />;
  }

  // return <div>carai</div>;
};

export default AuthCallback;
