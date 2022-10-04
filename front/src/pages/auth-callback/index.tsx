import { Navigate, useSearchParams } from 'react-router-dom';

const AuthCallback = ({ setUser }: any) => {
  const [params] = useSearchParams();

  console.log({ code: params.get('code') });

  setUser({ id: 42, name: 'paulo' });

  // return <div>carai</div>;
  return <Navigate to="/" />;
};

export default AuthCallback;
