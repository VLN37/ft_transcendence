import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import {
  SearchIcon
} from "@chakra-ui/icons";
import {
    RankTable,
} from "../../components/Rank/";


export default function RankPage() {
  function SearchForm() {
    console.log('pesquisar');
  }

  return (
  <div>
  <Box marginLeft={'315px'} width='60%'>
    <InputGroup>
      <Input placeholder='Search by login name' size='md'/>
      <InputRightElement
        children={<SearchIcon color='gray.300' onClick={SearchForm}/>}
      />
    </InputGroup>
  </Box>
  <Box marginLeft={'315px'} width='60%' bg='cyan.800'>
      {/* <Button>submit</Button> */}
      <div className="page" >
          <RankTable />
      </div>
  </Box>
  </div>
  );
}
