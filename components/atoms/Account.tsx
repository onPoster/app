import {
  Button,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import blockies from 'blockies-ts'
import { useEthers } from '@usedapp/core'
import { truncateHash } from '../../lib/helpers'
export const Account = () => {
  const { account, deactivate } = useEthers()
  let blockieImageSrc
  if (typeof window !== 'undefined') {
    blockieImageSrc = blockies.create({ seed: account }).toDataURL()
  }

  return (
    <Flex
      order={[null, null, null, 2]}
      alignItems={'center'}
      justifyContent={['flex-start', null, null, 'flex-end']}
      w={{ base: "200%", md: "auto" }}
    >
      <Image ml="4" src={blockieImageSrc} alt="blockie" />
      <Menu placement="bottom-end">
        <MenuButton as={Button} ml="4" w={{ base: "200%", md: "auto" }}>
          {truncateHash(account)}
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => {
              deactivate()
            }}
          >
            Disconnect
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  )
}
