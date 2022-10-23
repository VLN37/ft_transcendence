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
import { isErrored } from "stream";

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
  let teste = 'wins' as ObjectKey;
  const [sort, setSort] = useState(0);
  const [type, setType] = useState(teste);
  const [User, setUser] = useState([{
    login_intra: '',
    id: 0,
    tfa_enabled: false,
    avatar_path: '',
    nickname: '',
    wins: 0,
    losses: 0,
  }]);

  useEffect(() => {
    async function fetchh() {
      const result: APIUser[] = await fetchUsers();
      const restructure: TableUser[] = result.map(user => {
        let newuser: TableUser = {
          login_intra: user.login_intra,
          id: user.id,
          tfa_enabled: user.tfa_enabled,
          avatar_path: user.profile.avatar_path,
          nickname: user.profile.nickname,
          wins: user.profile.wins,
          losses: user.profile.losses,
        }
        return newuser;
      })
      const sorted = restructure.slice(0).sort((a: TableUser, b: TableUser) =>
      a[type as keyof User] < b[type as keyof User] ? 1 : -1);
      console.log('sorted: ', sorted);
      setUser(sorted);
    }
    console.log('mounted');
    fetchh();
  }, []);


  function setter(value: ObjectKey) {
    setType(value);
  }

  useEffect(() => {
    console.log('prop: ', props.query);
  },
  [props.query]);

  useEffect(() => {
    const sorted = User.slice(0).sort((a: TableUser, b: TableUser) =>
    a[type as keyof User] < b[type as keyof User] ? 1 : -1);
    console.log('sorted: ', sorted);
    setUser(sorted);
  },
  [type]);

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
            <RankMenu input={user.nickname} id={user.id} />
          }
          id={user.id}
          tfa_enabled={user.tfa_enabled}
          avatar_path={user.avatar_path}
          wins={user.wins}
          losses={user.losses} />)
    return (
      <TableContainer minWidth={'100%'} >
        <Table variant='striped'>
          <Thead>
            <Tr>
              <Th>Rank</Th>
              <Th>Avatar</Th>
              <Th onClick={()=> setType('login_intra' as ObjectKey)}>Login</Th>
              <Th onClick={()=> setType('id' as ObjectKey)}>ID</Th>
              <Th onClick={()=> setType('wins' as ObjectKey)}>Wins</Th>
              <Th onClick={()=> setType('losses' as ObjectKey)}>Losses</Th>
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
