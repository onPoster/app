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

import { truncate } from '../../lib/helpers'
import { ActionType } from '../../lib/reducers'


export const Account = ({ account, dispatch, useFallbackAccount, deactivate }: { account: string, dispatch: React.Dispatch<ActionType>, useFallbackAccount: boolean, deactivate: () => void }) => {
  let blockieImageSrc
  if (typeof window !== 'undefined') {
    blockieImageSrc = blockies.create({ seed: account }).toDataURL()
  }

  return (
    <Flex
      order={[null, null, null, 2]}
      alignItems={'center'}
      justifyContent={['flex-start', null, null, 'flex-end']}
      w={{ base: '200%', md: 'auto' }}
    >
      <Image ml="4" src={blockieImageSrc} alt="blockie" />
      <Menu placement="bottom-end">
        <MenuButton as={Button} ml="4" w={{ base: '200%', md: 'auto' }}>
          {truncate(account)}
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => {
              if (useFallbackAccount) {
                dispatch({
                  type: 'SET_FALLBACK_ACCOUNT',
                  useFallbackAccount: false,
                })
              }
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
