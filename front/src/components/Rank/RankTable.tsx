import { useEffect, useState, useRef } from 'react';
import { UserBlock } from './';
import { Table, Thead, Tbody, Tr, Th, TableContainer } from '@chakra-ui/react';
import { TableUser } from '../../models/TableUser';
import { User } from '../../models/User';
import api from '../../services/api';

const URL = 'http://localhost:3000/users';

async function fetchUsers() {}

export function RankTable(props: any) {
  // let teste = 'wins' as ObjectKey;
  const [type, setType] = useState<keyof TableUser>('wins');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [userList, setUserList] = useState([
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
      const result: User[] = await api.getRankedUsers();
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
      setUserList(restructure);
    }
    fetchh();
  }, []);

  function usePrevious(value: keyof TableUser) {
    const ref = useRef<keyof TableUser>();
    useEffect(() => {
      ref.current = value; //assign the value of ref to the argument
    }, [value]); //this code will run when the value of 'value' changes
    return ref.current; // but in the end, it doesn't even matter
  }

  useEffect(() => {
    console.log('prop: ', props.query);
  }, [props.query]);

  useEffect(() => {
    const sorted = userList.slice(0).sort(sortAscending);
    setUserList(sorted);
  }, [type]);

  useEffect(() => {
    let sorted: TableUser[];
    const sortFn = order == 'ASC' ? sortAscending : sortDescending;
    sorted = userList.slice(0).sort(sortFn);
    setUserList(sorted);
  }, [order]);

  function changeOrder() {
    order === 'ASC' ? setOrder('DESC') : setOrder('ASC');
  }

  function tableOrdering(value: keyof TableUser) {
    if (type === prevtype) changeOrder();
    setType(value);
  }

  const prevtype = usePrevious(type);
  if (!userList[0].login_intra) {
    return (
      <div className="page">
        <h1>esperando</h1>
      </div>
    );
  }

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
        <Tbody>
          {!userList[0].login_intra ? (
            <UserBlock />
          ) : (
            userList
              .filter((user) => user.login_intra.includes(props.query))
              .map((user) => <UserBlock user={user} />)
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
