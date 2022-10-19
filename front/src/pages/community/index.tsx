import { useEffect, useState } from "react";

import {
  Box,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Button,
  Image,
  TableContainer,
} from '@chakra-ui/react'

import UserBlock from '../../components/UserBlock';
import RankMenu from '../../components/RankMenu';

interface UserDto {
  id: number,
  login_intra: string,
  tfa_enabled: boolean,
  tfa_secret: string,
  profile: {
    avatar_path: string,
  }
}

const URL = 'http://localhost:3000/users';

async function fetchUsers() {
  const response = await fetch(URL, {
    method: 'GET',
  });
  console.log(response.body);
  return response.json();
}

function AddToast() {
  const toast = useToast();
  return toast({ description: 'some text' })
}

function CustomToastExample() {
  const toast = useToast()
  return (
    <Button
      onClick={() =>
        toast({
          position: 'bottom-left',
          render: () => (
            <Box color='white' p={3} bg='blue.500'>
              Hello World
            </Box>
          ),
        })
      }
    >
      Show Toast
    </Button>
  )
}


export default function CommunityPage() {
  const [User, setUser] = useState([{
    login_intra: '',
    id: 0,
    tfa_enabled: false,
    profile: {
      avatar_path: '',
    }
  }]);

  useEffect(() => {
    async function fetchh() {
      const result = await fetchUsers();
      setUser(result);
    }

    fetchh();
  }, [])

  // if (!User[0].login_intra){
  //   return <div className="page">
  //     <h1>esperando</h1>
  //   </div>;
  // }
  // else {
    const userList = User
      .map(user =>
        <UserBlock
          login_intra={<RankMenu input={user.login_intra}></RankMenu>}
          id={user.id}
          tfa_enabled={user.tfa_enabled}
          avatar_path={user.profile.avatar_path} />)
    return <div className="page">
      <TableContainer>
        <Table variant='striped'>
          <Thead>
            <Tr>
              <Th>Avatar</Th>
              <Th>Login</Th>
              <Th>ID</Th>
              <Th>TFA</Th>
            </Tr>
          </Thead>
          <Tbody>
          {
            !User[0].login_intra
            ? <UserBlock />
            : userList
          }
          </Tbody>
        </Table>
      </TableContainer>
    </div>;
  }

