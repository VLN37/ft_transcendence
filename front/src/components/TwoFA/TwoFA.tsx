import { Switch, Button, Text, Box, Image, PinInput, PinInputField, useToast } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { emptyUser, User } from "../../models/User";
import api from "../../services/api";
import userStorage from "../../services/userStorage";

function Disable2FA(props: {
  setInProgress: any,
  setDisable2FA: any,
}) {
  const [pin, setPin] = useState<string>('');
  const toast = useToast();

  async function check2fa(tfa_code: string) {
    // console.log('tfa code', tfa_code);
    if (tfa_code.length < 6)
      return;
    const response: any = await api.toggle2fa(tfa_code, 'DISABLED');

    let message: string;
    let status: 'success' | 'error';
    if (response.status == 200) {
      message = '2FA authentication removed';
      status = 'success';
      // console.log('new token', response.data);
      api.setToken(response.data.access_token);
      await userStorage.updateUser();
      props.setInProgress(false);
      props.setDisable2FA(false);
    }
    else {
      message = response.data.message;
      status = 'error';
      setPin('');
    }
    toast({
      title: 'Code verified',
      status: status,
      description: message,
    })
  }

  return (
    <Box>
      <Text>Confirm your pin to remove 2FA</Text>
      <PinInput
      onChange={(value: string) => {setPin(value)}}
      onComplete={(pin: string) => check2fa(pin)}
      value={pin}
      focusBorderColor='yellow.100'
    >
      <PinInputField />
      <PinInputField />
      <PinInputField />
      <PinInputField />
      <PinInputField />
      <PinInputField />
    </PinInput>
    </Box>
  );
}

function Enable2FA(props: {
  setInProgress: any,
  setEnable2FA: any,
}) {
  const toast = useToast();

  const [pin, setPin] = useState<string>('');
  const [QRCode, setQRCode] = useState<any>({
    qrcode_data: '',
    link: '',
    secret: '',
  });
  useEffect(() => {
    async function fetchQRCode() {
      const response = await api.get2faQRcode();
      setQRCode(response);
    };
    fetchQRCode();
  }, [])

  async function check2fa(tfa_code: string) {
    // console.log('tfa code', tfa_code);
    if (tfa_code.length < 6)
      return;
    const response: any = await api.toggle2fa(tfa_code, 'ENABLED');

    let message: string;
    let status: 'success' | 'error';
    if (response.status == 200) {
      message = 'don\'t lose your token';
      status = 'success';
      api.setToken(response.data.access_token);
      await userStorage.updateUser();
      props.setInProgress(false);
      props.setEnable2FA(false);
    }
    else {
      message = response.data.message;
      status = 'error';
      setPin('');
    }
    toast({
      title: '2FA verified',
      status: status,
      description: message,
    })
  }

  return (
    <Box>
      <Text>Configuring Google Authenticator</Text>
      <ol>
        <li>Install Google Authenticator (IoS - Android)</li>
        <li>In the authenticator app, select "+" icon.</li>
        <li>Select "Scan a barcode (or QR code)"
          and use the phone camera to scan it</li>
      </ol>
    <Image
    src={QRCode.qrcode_data} alignSelf={'center'}></Image>
    <Text>Or use this link <a href={QRCode.link}>click me</a></Text>
    <Text>Or use the secret in the authenticator</Text>
    <Text wordBreak={'break-all'}>{QRCode.secret}</Text>
    <PinInput
      onChange={(value: string) => {setPin(value)}}
      onComplete={(pin: string) => check2fa(pin)}
      value={pin}
      focusBorderColor='yellow.100'
    >
      <PinInputField />
      <PinInputField />
      <PinInputField />
      <PinInputField />
      <PinInputField />
      <PinInputField />
    </PinInput>
    </Box>
  )
}

export default function TwoFA() {
  const user: User = userStorage.getUser() || emptyUser();
  const [enable2FA, setEnable2FA] = useState(false);
  const [disable2FA, setDisable2FA] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [isChecked, setIsChecked] = useState(user.tfa_enabled);

  const onChange = () => {
    isChecked
      ? setDisable2FA(!disable2FA)
      : setEnable2FA(!enable2FA)
    setIsChecked(!isChecked)
    setInProgress(!inProgress)
  }

  return (
  <Box marginTop={'0.5rem'}>
    <Switch isChecked={isChecked} isDisabled={inProgress} onChange={onChange}
    >2FA
    </Switch>
    {
      disable2FA && inProgress
        ? <Disable2FA
          setInProgress={setInProgress}
          setDisable2FA={setDisable2FA}
        ></Disable2FA>
        : null
    }
    {
      enable2FA && inProgress
        ? <Enable2FA
        setInProgress={setInProgress}
        setEnable2FA={setEnable2FA}
        ></Enable2FA>
        : null
    }
  </Box>
  )
}
