import { Box, VStack, Link } from '@chakra-ui/react';
import NeonButton from '../../components/NeonButton';

export default function LoginPage({ user }: any) {
  const authorizationUrl = process.env.REACT_APP_INTRA_AUTHORIZATION_URL;
  const link = process.env.REACT_APP_FRONT_HOSTNAME + '/auth-callback?';
  return (
    <VStack marginTop={'15%'} justifyItems={'center'} spacing={'24px'}>
      {/* <Box>
        <p >Welcome to PONG Transcendence</p>
        <p >Log in on 42 Intranet to access the game</p>
      </Box> */}
      {/* <Box>
        <Link to="/">
          <NeonButton>GO HOME</NeonButton>
        </Link>
      </Box> */}
      <Box>
        <Link href={authorizationUrl!}>
          <NeonButton>LOGIN AS 42</NeonButton>
        </Link>
      </Box>
      <Box>
        <Link href={link + 'code=guest'}>
          <NeonButton>LOGIN AS GUEST</NeonButton>
        </Link>
      </Box>
      {process.env.REACT_APP_ENVIRONMENT != 'prod' && (
        <>
          <Box>
            <Link href={link + 'code=abcd'}>
              <NeonButton>PAULO</NeonButton>
            </Link>
          </Box>
          <Box>
            <Link href={link + 'code=1234'}>
              <NeonButton>JOAO</NeonButton>
            </Link>
          </Box>
          <Box>
            <Link href={link + 'code=noob'}>
              <NeonButton>WELTON</NeonButton>
            </Link>
          </Box>
        </>
      )}
    </VStack>
  );
}
{
  /* <Box>
            <a href={authorizationUrl!}>
              <NeonButton>LOGIN</NeonButton>
            </a>
          </Box>
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
      )} */
}
