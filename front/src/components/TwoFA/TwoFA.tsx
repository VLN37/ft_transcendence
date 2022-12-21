import { Switch, Button, Text, Box } from "@chakra-ui/react"
import { useState } from "react";
import { emptyUser, User } from "../../models/User";
import userStorage from "../../services/userStorage";

export default function TwoFa() {
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
        ? <Text>disable 2fa flow
          <Button
          bgColor={'red.500'}
          onClick={() => {
            setIsChecked(true)
            setDisable2FA(false)
            setInProgress(false)
          }}>failure</Button>
          <Button
          bgColor={'green.500'}
          onClick={() => {
            setIsChecked(false)
            setDisable2FA(false)
            setInProgress(false)
          }}>success</Button>
          </Text>
        : null
    }
    {
      enable2FA && inProgress
        ? <Text>enable 2fa flow
          <Button
          bgColor={'red.500'}
          onClick={() => {
            setIsChecked(false)
            setEnable2FA(false)
            setInProgress(false)
          }}>failure</Button>
          <Button
          bgColor={'green.500'}
          onClick={() => {
            setIsChecked(true)
            setEnable2FA(false)
            setInProgress(false)
          }}>success</Button>
          </Text>
        : null
    }
  </Box>
  )
}
