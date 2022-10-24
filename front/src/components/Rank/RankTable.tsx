import { useEffect, useState, useRef } from 'react';
import { UserBlock } from './';
import { Table, Thead, Tbody, Tr, Th, TableContainer } from '@chakra-ui/react';
import { TableUser } from '../../models/TableUser';
import { User } from '../../models/User';
import api from '../../services/api';

export function RankTable(props: any) {
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

  useEffect(() => {
    async function queryDatabase() {
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
    queryDatabase();
  }, []);

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

  const sortAscending = (a: TableUser, b: TableUser) =>
    a[type] < b[type] ? 1 : -1;

  const sortDescending = (a: TableUser, b: TableUser) =>
    a[type] < b[type] ? -1 : 1;

  function changeOrder() {
    order === 'ASC' ? setOrder('DESC') : setOrder('ASC');
  }

  // tsx files need 'T extends any' ts files only 'T'
  function UsePrevious<T extends unknown>(value: T): T | undefined {
    const ref = useRef<T>();
    useEffect(() => {
      ref.current = value; //assign the value of ref to the argument
    }, [value]); //this code will run when the value of 'value' changes
    return ref.current; // but in the end, it doesn't even matter
  }

  const prevtype = UsePrevious(type);
  function tableOrdering(value: keyof TableUser) {
    if (type === prevtype) changeOrder();
    setType(value);
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
            <UserBlock user={userList[0]} />
          ) : (
            userList
              .filter((user) => user.login_intra.includes(props.query))
              .map((user, i) => <UserBlock key={i} user={user} />)
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
