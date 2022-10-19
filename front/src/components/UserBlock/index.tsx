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
      <Td>
        <Image
            borderRadius='full'
            boxSize='65px'
            src={props.avatar_path}
        />
      </Td>
      <Td>{props.login_intra}</Td>
      <Td>{props.id}</Td>
      <Td>{props.tfa_enabled}</Td>
    </Tr>
  );
}
