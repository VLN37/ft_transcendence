import { Link } from 'react-router-dom';
import NeonButton from '../../components/NeonButton';

export default function LoginPage({ user }: any) {
  const authorizationUrl = process.env.REACT_APP_INTRA_AUTHORIZATION_URL;
  console.log({ authorizationUrl });
  console.log({ env: process.env.NODE_ENV });
  return (
    <div className="main-container">
      <h2>Welcome to PONG Transcendence</h2>
      <p>Log in on 42 Intranet to access the game</p>
      {user ? (
        <Link to="/">
          <NeonButton>GO HOME</NeonButton>
        </Link>
      ) : (
        <a href={authorizationUrl!}>
          <NeonButton>LOGIN</NeonButton>
        </a>
      )}
    </div>
  );
}
