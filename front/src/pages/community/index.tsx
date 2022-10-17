import { useEffect, useState } from "react";

import {
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react'

interface UserDto {
  id: number,
  login_intra: string,
  tfa_enabled: boolean,
  tfa_secret: string,
}

const URL = 'http://localhost:3000/users';

async function fetchUsers() {
  const response = await fetch(URL, {
    method: 'GET',
  });
  console.log(response.body);
  return response.json();
}

function UserBlock(props: any) {
  return (
      <Tr>
        <Td>{props.login_intra}</Td>
        <Td>{props.id}</Td>
        <Td>{props.tfa_enabled}</Td>
      </Tr>
  );
}

function MeuMenu(props: any) {
  async function clickcallback() {
    console.log('registrou');
    return ;
  }

  return (
    <Menu isLazy>
      <MenuButton>{props.input}</MenuButton>
      <MenuList>
        {/* MenuItems are not rendered unless Menu is open */}
        <MenuItem onClick={clickcallback} >addFriend</MenuItem>
        <MenuItem>Open Closed Tab</MenuItem>
        <MenuItem>Open File</MenuItem>
      </MenuList>
    </Menu>
  )
}

export default function CommunityPage() {
  const [User, setUser] = useState([{
    login_intra: '',
    id: 0,
    tfa_enabled: false,
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
          login_intra={<MeuMenu input={user.login_intra}></MeuMenu>}
          id={user.id}
          tfa_enabled={user.tfa_enabled} />)
    return <div className="page">
      <TableContainer>
        <Table variant='simple'>
          <Thead>
            <Tr>
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

