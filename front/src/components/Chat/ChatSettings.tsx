import { SettingsIcon } from '@chakra-ui/icons';
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Channel } from '../../models/Channel';
import api from '../../services/api';

function PassForm(props: {
  channel: Channel,
  setChannel: any,
  setPasswordForm: any,
}) {
  const [input1, setInput1] = useState<string>('');
  const [input2, setInput2] = useState<string>('');

  const handleInput1 = (e: any) => setInput1(e.target.value);
  const handleInput2 = (e: any) => setInput2(e.target.value);
  const isError = input1 != input2

  function sendForm() {
    props.setPasswordForm();
  }

  return (
    <FormControl isInvalid={isError}>
      <FormLabel>Password</FormLabel>
      <Input size={'sm'} value={input1} onChange={handleInput1} type='password' />
      <FormLabel>Repeat password</FormLabel>
      <Input size={'sm'} value={input2} onChange={handleInput2} type='password' />
      {isError ? <FormHelperText>Passwords don't match</FormHelperText> : null}
      <Button size={'sm'} marginTop={2} onClick={sendForm}>Submit</Button>
    </FormControl>
  )
}

export function ChatSettings(props: {
  channel: Channel,
  setChannel: any
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [channelType, setChannelType] = useState<string>(props.channel.type);
  const [passwordForm, setPasswordForm] = useState<boolean>(false);
  const [removePasswordForm, setRemovePasswordForm] = useState<boolean>(false);

  function makePublic() {
    let newChannel: Channel = {... props.channel};
    newChannel.type = 'PUBLIC';
    props.setChannel(newChannel);
    setChannelType(newChannel.type);
  }

  function makePrivate() {
    let newChannel: Channel = {... props.channel};
    newChannel.type = 'PROTECTED';
    props.setChannel(newChannel);
    setChannelType(newChannel.type);
  }

  function flipPass() {
    setPasswordForm(!passwordForm);
  }

  function flipRemPass() {
    setPasswordForm(!removePasswordForm);
  }

  return (
  <>
    <SettingsIcon onClick={onOpen} marginTop={3} boxSize={7} />
    <Modal isOpen={isOpen} onClose={onClose} size={'3xl'}>
      <ModalOverlay />
      <ModalContent>
      <ModalHeader>Channel {props.channel.name}</ModalHeader>
      <ModalBody>
        Channel type: {channelType}
        {
        channelType == 'PUBLIC'
          ? <Button size={'sm'} onClick={flipPass}>Make Private</Button>
          : <>
            <Button size={'sm'} onClick={flipRemPass}>Make Public</Button>
            <Button size={'sm'} onClick={flipRemPass}>Change Password</Button>
            </>
        }
        {
          passwordForm
            ? <PassForm
                channel={props.channel}
                setChannel={props.setChannel}
                setPasswordForm={setPasswordForm}
              />
            : null
        }
        {
          removePasswordForm
            ? <Input title='old password'></Input>
            : null
        }
      </ModalBody>
      <ModalFooter>
        <Button size={'sm'} onClick={onClose}>close</Button>
      </ModalFooter>
      </ModalContent>
    </Modal>
  </>
  );
}
