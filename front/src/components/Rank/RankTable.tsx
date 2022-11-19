import { useEffect, useState, useRef } from 'react';
import { UserBlock } from './';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Box,
} from '@chakra-ui/react';
import { TableUser } from '../../models/TableUser';
import { User } from '../../models/User';
import api from '../../services/api';

function ListUsers(props: { users: TableUser[]; query: string }) {
  if (!props.users[0].login_intra) return <></>;
  const users = props.users
    .filter((user) => user.login_intra.includes(props.query))
    .map((user, i) => (
      <UserBlock
        key={i}
        user={user}
        path={process.env.REACT_APP_HOSNAME + user.avatar_path}
      ></UserBlock>
    ));
  return <>{users}</>;
}

export function RankTable(props: any) {
  const [type, setType] = useState<keyof TableUser>('wins');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [userList, setUserList] = useState([TableUser()]);

  useEffect(() => {
    async function queryDatabase() {
      const result: User[] = await api.getRankedUsers();
      const restructure: TableUser[] = result.map((user) => {
        return TableUser(user);
      });
      setUserList(restructure);
    }
    queryDatabase();
  }, []);

  useEffect(() => {}, [props.query]);

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
    <>
      <TableContainer overflowY={'scroll'} h={'100%'} maxHeight={'100%'}>
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
            <ListUsers users={userList} query={props.query}></ListUsers>
          </Tbody>
        </Table>
      </TableContainer>
      <Box bg={'gray.800'} padding={'1rem'} />
    </>
  );
}
