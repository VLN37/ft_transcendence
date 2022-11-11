import { useEffect, useState } from 'react';
import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  Container,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { RankTable } from '../../components/Rank/';

export default function RankPage() {
  const [searchValue, setSearchValue] = useState('');
  function handleSearchClick() {
    setSearchValue(searchValue);
  }

  const handleChange = (event: any) => setSearchValue(event.target.value);

  return (
    <>
      <InputGroup>
        <Input
          placeholder="Search by login name"
          value={searchValue}
          onChange={handleChange}
          size="md"
        />
        <InputRightElement
          children={<SearchIcon color="teal.600" onClick={handleSearchClick} />}
        />
      </InputGroup>
      <Box bg="cyan.800" maxW="100%" maxHeight={'100%'} overflowY={'auto'}>
        {/* <Button>submit</Button> */}
        <RankTable query={searchValue} />
      </Box>
    </>
  );
}
