import { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

const AuthCallback = ({ setUser }: any) => {
  const [loading, setLoading] = useState(true);
  const [params] = useSearchParams();

  useEffect(() => {
    const code = params.get('code');

    async function validateCode(code: string | null): Promise<boolean> {
      setLoading(true);
      if (!code || code.length != 64) return false;

      const url = `http://localhost:3000/auth/login?code=${code}`;
      console.log({ url });
      const response = await fetch(url, {
        method: 'POST',
      });

      console.log({ response });
      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      console.log({ result });
      localStorage.setItem('RESULT', result);
      setUser(result);
      setLoading(false);
      return true;
    }

    validateCode(code);
  }, []);

  if (loading) {
    return <div style={{ color: '#fff' }}>Carregando</div>;
  } else {
    return <Navigate to="/" />;
  }

  // return <div>carai</div>;
};

export default AuthCallback;
