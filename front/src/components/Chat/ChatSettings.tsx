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
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Channel } from '../../models/Channel';
import { emptyUser } from '../../models/User';
import api from '../../services/api';
import userStorage from '../../services/userStorage';

function PassForm(props: {
  channel: Channel,
  setChannel: any,
  setPasswordForm: any,
  setChannelType: any,
}) {
  const [input1, setInput1] = useState<string>('');
  const [input2, setInput2] = useState<string>('');
  const toast = useToast();
  const me = userStorage.getUser() || emptyUser();

  const handleInput1 = (e: any) => setInput1(e.target.value);
  const handleInput2 = (e: any) => setInput2(e.target.value);
  const isError = input1 != input2;


  async function sendForm() {
    const newChannel: Channel = {... props.channel};
    newChannel.type = 'PROTECTED';
    newChannel.password = input1;

    const response: any = await api.updateChannel(newChannel, input1, null);
    const status = response.status == 200 ? 'success' : 'error';
    const message = response.status == 200 ? '' : response.data.message;

    toast({
      title: 'Password creation request sent',
      status: status,
      description: message,
    })
    if (response.status == 200) {
      delete newChannel.password;
      props.setChannel({... newChannel});
      props.setChannelType(newChannel.type);
      props.setPasswordForm(false);
    }
  }

  return (
    <FormControl isInvalid={isError}>
      <FormLabel>Password</FormLabel>
      <Input size={'sm'} id={'1'} value={input1} onChange={handleInput1} type='password' />
      <FormLabel>Repeat password</FormLabel>
      <Input size={'sm'} id={'2' }value={input2} onChange={handleInput2} type='password' />
      {isError ? <FormHelperText>Passwords don't match</FormHelperText> : null}
      <Button size={'sm'} marginTop={2} onClick={sendForm}>Submit</Button>
    </FormControl>
  )
}

function RemovePassForm(props: {
  channel: Channel,
  setChannel: any,
  setRemovePasswordForm: any,
  setChannelType: any,
}) {
  const [oldPass, setOldPass] = useState<string>('');

  const toast = useToast();
  const handleOldPass = (e: any) => setOldPass(e.target.value);

  async function sendForm() {
    const newChannel: Channel = {... props.channel};
    newChannel.type = 'PUBLIC';
    delete newChannel.password;

    const response: any = await api.updateChannel(newChannel, null, oldPass);
    const status = response.status == 200 ? 'success' : 'error';
    const message = response.status == 200 ? '' : response.data.message;

    toast({
      title: 'Password removal request sent',
      status: status,
      description: message,
    })
    if (response.status == 200) {
      delete newChannel.password;
      props.setChannel({... newChannel});
      props.setChannelType(newChannel.type);
      props.setRemovePasswordForm(false);
    }
  }


  return (
    <FormControl >
      <FormLabel>Old password</FormLabel>
      <Input size={'sm'} id={'1'} value={oldPass} onChange={handleOldPass} type='password' />
      <Button size={'sm'} marginTop={2} onClick={sendForm}>Submit</Button>
    </FormControl>
  )
}

function ChangePassForm(props: {
  channel: Channel,
  setChannel: any,
  setChangePasswordForm: any,
  setChannelType: any,
}) {
  const [oldPass, setOldPass] = useState<string>('');
  const [input1, setInput1] = useState<string>('');
  const [input2, setInput2] = useState<string>('');
  const toast = useToast();

  const handleInput1 = (e: any) => setInput1(e.target.value);
  const handleInput2 = (e: any) => setInput2(e.target.value);
  const handleInput3 = (e: any) => setOldPass(e.target.value);
  const isError = input1 != input2;

  async function sendForm() {
    const newChannel: Channel = {... props.channel};
    newChannel.password = input1;

    const response: any = await api.updateChannel(newChannel, input1, oldPass);
    const status = response.status == 200 ? 'success' : 'error';
    const message = response.status == 200 ? '' : response.data.message;

    toast({
      title: 'Update password request sent',
      status: status,
      description: message,
    })
    if (response.status == 200) {
      delete newChannel.password;
      props.setChannel({... newChannel});
      props.setChannelType(newChannel.type);
      props.setChangePasswordForm(false);
    }
  }

  return (
    <FormControl isInvalid={isError}>
      <FormLabel>Old password</FormLabel>
      <Input size={'sm'} id={'1'} value={oldPass} onChange={handleInput3} type='password' />
      <FormLabel>New password</FormLabel>
      <Input size={'sm'} id={'2'} value={input1} onChange={handleInput1} type='password' />
      <FormLabel>Repeat new password</FormLabel>
      <Input size={'sm'} id={'3'} value={input2} onChange={handleInput2} type='password' />
      {isError ? <FormHelperText>Passwords don't match</FormHelperText> : null}
      <Button size={'sm'} id={'4'} marginTop={2} onClick={sendForm}>Submit</Button>
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
  const [changePasswordForm, setChangePasswordForm] = useState<boolean>(false);

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
    setRemovePasswordForm(!removePasswordForm);
  }

  function flipChangePass() {
    setChangePasswordForm(!changePasswordForm);
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
            <Button size={'sm'} onClick={flipChangePass}>Change Password</Button>
            </>
        }
        {
          passwordForm
            ? <PassForm
                channel={props.channel}
                setChannel={props.setChannel}
                setPasswordForm={setPasswordForm}
                setChannelType={setChannelType}
              />
            : null
        }
        {
          removePasswordForm
            ? <RemovePassForm
                channel={props.channel}
                setChannel={props.setChannel}
                setRemovePasswordForm={setRemovePasswordForm}
                setChannelType={setChannelType}
              />
            : null
        }
        {
          changePasswordForm
            ? <ChangePassForm
                channel={props.channel}
                setChannel={props.setChannel}
                setChangePasswordForm={setChangePasswordForm}
                setChannelType={setChannelType}
              />
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
