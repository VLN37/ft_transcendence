import { Box } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import NeonButton from '../../components/NeonButton';

export default function LoginPage({ user }: any) {
  const authorizationUrl = process.env.REACT_APP_INTRA_AUTHORIZATION_URL;

  return (
    <Box paddingX="10%">
      <h2>Welcome to PONG Transcendence</h2>
      <p>Log in on 42 Intranet to access the game</p>
      {user ? (
        <Link to="/">
          <NeonButton>GO HOME</NeonButton>
        </Link>
      ) : (
        <div>
          <a href={authorizationUrl!}>
            <NeonButton>LOGIN</NeonButton>
          </a>
          <br />
          <a href={
            process.env.REACT_APP_FRONT_HOSTNAME + "/auth-callback?code=abcd"
          }>
            <NeonButton>login as paulo</NeonButton>
          </a>
          <br />
          <a href={
            process.env.REACT_APP_FRONT_HOSTNAME + "/auth-callback?code=1234"
          }>
            <NeonButton>login as joao</NeonButton>
          </a>
          <br />
          <a href={
            process.env.REACT_APP_FRONT_HOSTNAME + "/auth-callback?code=noob"
          }>
            <NeonButton>login as welton</NeonButton>
          </a>
          <br />
          <a href={
            process.env.REACT_APP_FRONT_HOSTNAME + "/auth-callback?code=guest"
          }>
            <NeonButton>LOGIN AS GUEST</NeonButton>
          </a>
        </div>
      )}
    </Box>
  );
}
