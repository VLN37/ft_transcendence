import { Image } from '@chakra-ui/react'

export function Profile() {
  const link = JSON.parse(localStorage.getItem('user') || '')
                   .profile.avatar_path || '';
  return (
    <div>
    <Image
      marginTop={'15px'}
      borderRadius="full"
      boxSize="65px"
      src={link}
    />
    </div>
  )
}

