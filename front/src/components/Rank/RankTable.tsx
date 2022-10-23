import { useEffect, useState } from "react";
import {UserBlock, RankMenu } from './';
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
  UseRadioGroupProps,
} from '@chakra-ui/react'
import { User } from "../../models/User";

interface APIUser {
  login_intra: string,
  id: number,
  tfa_enabled: boolean,
  profile: {
    avatar_path: string,
    nickname: string,
    wins: number,
    losses: number,
  }
}

interface TableUser {
  login_intra: string,
  id: number,
  tfa_enabled: boolean,
  avatar_path: string,
  nickname: string,
  wins: number,
  losses: number
}

const URL = 'http://localhost:3000/users';

async function fetchUsers() {
  const response = await fetch(URL, {
    method: 'GET',
  });
  console.log(response.body);
  return response.json();
}

export function RankTable(props: any) {
  type ObjectKey = keyof typeof User;
  let teste = 'profile: wins' as ObjectKey;
  const [sort, setSort] = useState(0);
  const [type, setType] = useState(teste);
  const [User, setUser] = useState([{
    login_intra: '',
    id: 0,
    tfa_enabled: false,
    profile: {
      avatar_path: '',
      nickname: '',
      wins: 0,
      losses: 0,
    }
  }]);

  useEffect(() => {
    async function fetchh() {
      const result = await fetchUsers();
      const sorted = result.slice(0).sort((a: User, b: User) =>
      a[type as keyof User] < b[type as keyof User] ? -1 : 1);
      console.log('sorted: ', sorted);
      setUser(sorted);
    }
    console.log('mounted');
    fetchh();
  }, []);


  useEffect(() => {
    console.log('prop: ', props.query);
  },
  [props.query]);

  // if (!User[0].login_intra){
  //   return <div className="page">
  //     <h1>esperando</h1>
  //   </div>;
  // }
  // else {
    let index = 1;
    // setType("wins");
    // console.log('something: ', type);
    // console.log('something: ', User[0][type]);
    // setUser(sorted);
    const userList = User
      .map(user =>
        <UserBlock
          rank={index++}
          key={user.id}
          login_intra={
            <RankMenu input={user.profile.nickname} id={user.id} />
          }
          id={user.id}
          tfa_enabled={user.tfa_enabled}
          avatar_path={user.profile.avatar_path}
          wins={user.profile.wins}
          losses={user.profile.losses} />)
    return (
      <TableContainer minWidth={'100%'} >
        <Table variant='striped'>
          <Thead>
            <Tr>
              <Th>Rank</Th>
              <Th>Avatar</Th>
              <Th>Login</Th>
              <Th>ID</Th>
              <Th>Wins</Th>
              <Th>Losses</Th>
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
    );
  }
