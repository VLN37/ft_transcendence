import jwtDecode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import LoadDualSpinner from '../../components/LoadDualSpinner';
import { TokenPayload } from '../../models/TokenPayload';
import { chatApi, mmApi } from '../../services/api_index';
import { api, userApi } from '../../services/api_index';
import userStorage from '../../services/userStorage';
import { TFAModal } from './components/2fa-modal';

import './style.css';

const AuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [params] = useSearchParams();
  const [isSending2fa, setIsSending2fa] = useState(false);

  useEffect(() => {
    const code = params.get('code');

    async function validateCode(code: string | null): Promise<void> {
      setLoading(true);
      // HACK: we should validate at least the size
      // if (!code || code.length !== 64) throw new Error('invalid code');
      if (!code) throw new Error('invalid code');

      try {
        const token = await api.authenticate(code);
        api.setToken(token);
        mmApi.setMatchMakingSocket(api);
        chatApi.setDMSocket(api);
        localStorage.setItem('selfkey', token);
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
      const token = (await api.authenticate2fa(tfaCode)).data.access_token;
      api.setToken(token);
      const payload = jwtDecode<TokenPayload>(token);
      finishLogin(payload);
      setIsSending2fa(true);
    } catch (e) {
      console.error(e);
    }
    setIsModalOpen(false);
  };

  const finishLogin = (payload: TokenPayload) => {
    console.log({ payload });

    userApi.getUser('v2/me').then((user) => {
      const link =
        process.env.REACT_APP_BACK_HOSTNAME + user.profile.avatar_path;
      localStorage.setItem('avatar', link);
      userStorage.saveUser(user);
      setLoading(false);
    });
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
