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

function AddToast() {
  const toast = useToast();
  return toast({ description: 'some text' })
}

function CustomToastExample() {
  const toast = useToast()
  return (
    <Button
      onClick={() =>
        toast({
          position: 'bottom-left',
          render: () => (
            <Box color='white' p={3} bg='blue.500'>
              Hello World
            </Box>
          ),
        })
      }
    >
      Show Toast
    </Button>
  )
}

export default function RankMenu(props: any) {
  const toast = useToast();
  async function clickcallback() {
    console.log('added');
    toast({
      title: 'Friend request sent',
      description: 'supimpa',
      status: 'error',
    });
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
