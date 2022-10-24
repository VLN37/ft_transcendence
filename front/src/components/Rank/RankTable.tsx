import { useEffect, useState, useRef } from 'react';
import { UserBlock, RankMenu } from './';
import { Table, Thead, Tbody, Tr, Th, TableContainer } from '@chakra-ui/react';

interface APIUser {
  login_intra: string;
  id: number;
  tfa_enabled: boolean;
  profile: {
    avatar_path: string;
    nickname: string;
    wins: number;
    losses: number;
  };
}

interface TableUser {
  login_intra: string;
  id: number;
  tfa_enabled: boolean;
  avatar_path: string;
  nickname: string;
  wins: number;
  losses: number;
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
  // let teste = 'wins' as ObjectKey;
  const [type, setType] = useState<keyof TableUser>('wins');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [User, setUser] = useState([
    {
      login_intra: '',
      id: 0,
      tfa_enabled: false,
      avatar_path: '',
      nickname: '',
      wins: 0,
      losses: 0,
    },
  ]);

  const sortAscending = (a: TableUser, b: TableUser) =>
    a[type] < b[type] ? 1 : -1;

  const sortDescending = (a: TableUser, b: TableUser) =>
    a[type] < b[type] ? -1 : 1;

  useEffect(() => {
    async function fetchh() {
      const result: APIUser[] = await fetchUsers();
      const restructure: TableUser[] = result.map((user) => {
        let newuser: TableUser = {
          login_intra: user.login_intra,
          id: user.id,
          tfa_enabled: user.tfa_enabled,
          avatar_path: user.profile.avatar_path,
          nickname: user.profile.nickname,
          wins: user.profile.wins,
          losses: user.profile.losses,
        };
        return newuser;
      });
      const sorted = restructure.slice(0).sort(sortAscending);
      console.log('sorted: ', sorted);
      setUser(sorted);
    }
    console.log('mounted');
    fetchh();
  }, []);

  function usePrevious(value: any) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value; //assign the value of ref to the argument
    }, [value]); //this code will run when the value of 'value' changes
    return ref.current; // but in the end, it doesn't even matter
  }

  useEffect(() => {
    console.log('prop: ', props.query);
  }, [props.query]);

  useEffect(() => {
    const sorted = User.slice(0).sort(sortAscending);
    console.log('sorted: ', sorted);
    setUser(sorted);
  }, [type]);

  useEffect(() => {
    let sorted: TableUser[];
    console.log('prevtype: ', prevtype);
    console.log('type: ', type);
    const sortFn = order == 'ASC' ? sortAscending : sortDescending;
    sorted = User.slice(0).sort(sortFn);
    console.log('sorted: ', sorted);
    setUser(sorted);
  }, [order]);

  function changeOrder() {
    order === 'ASC' ? setOrder('DESC') : setOrder('ASC');
  }

  function tableOrdering(value: keyof TableUser) {
    if (type === prevtype) changeOrder();
    setType(value);
    console.log('value: ', value);
    console.log('order: ', order);
  }

  const prevtype = usePrevious(type);
  if (!User[0].login_intra) {
    return (
      <div className="page">
        <h1>esperando</h1>
      </div>
    );
  }

  let index = 1;
  const userList = User.map((user) => (
    <UserBlock
      rank={index++}
      key={user.id}
      login_intra={<RankMenu input={user.nickname} id={user.id} />}
      id={user.id}
      tfa_enabled={user.tfa_enabled}
      avatar_path={user.avatar_path}
      wins={user.wins}
      losses={user.losses}
    />
  ));
  return (
    <TableContainer minWidth={'100%'}>
      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>Rank</Th>
            <Th>Avatar</Th>
            <Th onClick={() => tableOrdering('login_intra')}>Login</Th>
            <Th onClick={() => tableOrdering('id')}>ID</Th>
            <Th onClick={() => tableOrdering('wins')}>Wins</Th>
            <Th onClick={() => tableOrdering('losses')}>Losses</Th>
          </Tr>
        </Thead>
        <Tbody>{!User[0].login_intra ? <UserBlock /> : userList}</Tbody>
      </Table>
    </TableContainer>
  );
}
