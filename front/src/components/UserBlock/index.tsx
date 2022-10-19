import {
  Box,
  useToast,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Button,
  Image,
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

export default function UserBlock(props: any) {
  return (
    <Tr>
      <Td>{props.rank}</Td>
      <Td>
        <Image
            borderRadius='full'
            boxSize='65px'
            src={props.avatar_path}
        />
      </Td>
      <Td>{props.login_intra}</Td>
      <Td>{props.wins}</Td>
      <Td>{props.losses}</Td>
    </Tr>
  );
}
