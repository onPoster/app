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
import styled from '@emotion/styled'
import { useClipboard } from '@chakra-ui/react'

import { truncate } from '../../lib/helpers'
import { ActionType } from '../../lib/reducers'


const BalancedButton = styled(Button)`
  ::after {
    content: ' ';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-left: 10px;
  }
`

const ReadyBalancedButton = styled(BalancedButton)`
  ::after {
    background: green;
  }
`

export const Account = ({ account, dispatch, useFallbackAccount, deactivate }: { account: string, dispatch: React.Dispatch<ActionType>, useFallbackAccount: boolean, deactivate: () => void }) => {
  let blockieImageSrc
  if (typeof window !== 'undefined') {
    blockieImageSrc = blockies.create({ seed: account }).toDataURL()
  }

  const {hasCopied, onCopy} = useClipboard(account);

  return (
    <Flex
      order={[null, null, null, 2]}
      alignItems={'center'}
      justifyContent={['flex-start', null, null, 'flex-end']}
      w={{ base: '200%', md: 'auto' }}
    >
      <Image ml="4" src={blockieImageSrc} alt="blockie" />
      <Menu placement="bottom-end">
        <MenuButton aria-label='Address' as={ReadyBalancedButton} ml="4" w={{ base: '200%', md: 'auto' }}>
          {truncate(account)}
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={onCopy}
          >
            {hasCopied ? 'Copied' : 'Copy'}
          </MenuItem>
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
