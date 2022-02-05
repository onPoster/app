import { Icon, IconProps } from '@chakra-ui/react'
import { BiImage } from 'react-icons/bi'

export const FrameIcon = (props: IconProps): JSX.Element => (
  <Icon as={BiImage} {...props} />
)
