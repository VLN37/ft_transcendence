import { useEffect, useState } from "react";
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
  const [searchValue, setSearchValue] = useState('');
  const [Search, setSearch] = useState('');
  function SearchForm() {
    console.log('value: ', searchValue);
    setSearch(searchValue);
    setSearchValue('');
  }

  const handleChange = (event: any) => setSearchValue(event.target.value);

  return (
  <div>
  <Box marginLeft={'315px'} width='60%'>
    <InputGroup>
      <Input
        placeholder='Search by login name'
        value={searchValue}
        onChange={handleChange}
        size='md'/>
      <InputRightElement
        children={
          <SearchIcon
            color='teal.600'
            onClick={() => SearchForm()}/>}
      />
    </InputGroup>
  </Box>
  <Box marginLeft={'315px'} width='60%' bg='cyan.800'>
      {/* <Button>submit</Button> */}
      <div className="page" >
          <RankTable query={Search}/>
      </div>
  </Box>
  </div>
  );
}
