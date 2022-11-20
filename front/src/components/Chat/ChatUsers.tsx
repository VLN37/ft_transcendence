import {
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { TableUser } from '../../models/TableUser';
import { User } from '../../models/User';
import { PublicProfile } from '../Profile/profile.public';

function UserMenu(props: {user: TableUser}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box padding={1}>
      <PublicProfile
        user={props.user}
        isOpen={isOpen}
        onClose={onClose}
      ></PublicProfile>
      <Menu isLazy>
        <MenuButton>{props.user.nickname}</MenuButton>
        <MenuList>
          <MenuItem onClick={onOpen}>view profile</MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
}

export function ChatUsers(props: { users: User[] }) {
  const userList = props.users.map((user: User, i: number) => {
    const tableuser = TableUser(user);
    return <UserMenu key={i} user={tableuser}></UserMenu>;
    // <Text key={i}>{user.profile.nickname}</Text>
  });
  console.log('users: ', props.users);
  return <>{userList}</>;
}
