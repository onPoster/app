import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Tag,
  Text,
  useColorMode,
  useMediaQuery,
} from '@chakra-ui/react'
import { useEthers, useNotifications } from '@usedapp/core'
import blockies from 'blockies-ts'
import React from 'react'
import {
  POSTER_APP_VERSION,
  POSTER_CONTRACT_ADDRESS,
  POSTER_CONTRACT_VERSION,
  POSTER_SUBGRAPH_ID,
} from '../../lib/constants'
import Balance from '../Balance'
import ConnectWallet from '../ConnectWallet'
import Head, { MetaProps } from './Head'

// Extends `window` to add `ethereum`.
declare global {
  interface Window {
    ethereum: any
  }
}

/**
 * Constants & Helpers
 */

// Title text for the various transaction notifications.
const TRANSACTION_TITLES = {
  transactionStarted: 'Local Transaction Started',
  transactionSucceed: 'Local Transaction Completed',
}

// Takes a long hash string and truncates it.
function truncateHash(hash: string, length = 38): string {
  return hash.replace(hash.substring(6, length), '...')
}

/**
 * Prop Types
 */
interface LayoutProps {
  children: React.ReactNode
  customMeta?: MetaProps
}

/**
 * Component
 */
const Layout = ({ children, customMeta }: LayoutProps): JSX.Element => {
  const { account, deactivate } = useEthers()
  const { notifications } = useNotifications()
  const { colorMode } = useColorMode()
  const [isLargerThan640px] = useMediaQuery('(min-width: 640px)')

  let blockieImageSrc
  if (typeof window !== 'undefined') {
    blockieImageSrc = blockies.create({ seed: account }).toDataURL()
  }

  const logoSource = {
    light: 'images/logo-poster.png',
    dark: 'images/logo-poster-dark.jpg',
  }

  return (
    <>
      <Head customMeta={customMeta} />
      <header>
        <Container maxWidth="container.xl">
          <SimpleGrid
            columns={[1, 1, 1, 2]}
            alignItems="center"
            justifyContent="space-between"
            py="8"
          >
            <Box d="flex" alignItems="center">
              <Heading as="h1">
                <Image
                  maxWidth="100px"
                  src={logoSource[colorMode]}
                  alt="Poster"
                />
              </Heading>
              <Text fontSize="lg">
                A general purpose decentralized social network.
              </Text>
            </Box>
            {account ? (
              <Flex
                order={[-1, null, null, 2]}
                alignItems={'center'}
                justifyContent={['flex-start', null, null, 'flex-end']}
              >
                <Balance />
                <Image ml="4" src={blockieImageSrc} alt="blockie" />
                <Menu placement="bottom-end">
                  <MenuButton as={Button} ml="4">
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
            ) : (
              <ConnectWallet />
            )}
          </SimpleGrid>
        </Container>
      </header>
      <main>
        <Container maxWidth="container.xl">
          {children}
          {notifications.map((notification) => {
            if (notification.type === 'walletConnected') {
              return null
            }
            return (
              <Alert
                key={notification.id}
                status="success"
                position="fixed"
                bottom="8"
                right="8"
                width="400px"
              >
                <AlertIcon />
                <Box>
                  <AlertTitle>
                    {TRANSACTION_TITLES[notification.type]}
                  </AlertTitle>
                  <AlertDescription overflow="hidden">
                    Transaction Hash:{' '}
                    {truncateHash(notification.transaction.hash, 61)}
                  </AlertDescription>
                </Box>
              </Alert>
            )
          })}
        </Container>
      </main>
      <footer>
        <Container mt="8" py="8" maxWidth="container.xl">
          <SimpleGrid
            columns={[1, 1, 1, 2]}
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              Built by{' '}
              <Link href="https://twitter.com/auryn_macmillan">
                <Text display="inline" fontWeight="700">
                  Auryn Macmillan
                </Text>
              </Link>{' '}
              and{' '}
              <Link href="https://twitter.com/jjperezaguinaga">
                <Text display="inline" fontWeight="700">
                  Jose Aguinaga
                </Text>
              </Link>
              .
            </Box>
            <Flex
              justifyContent="flex-end"
              alignContent="center"
              py="8"
              flexFlow={isLargerThan640px ? 'column' : 'row'}
            >
              <Flex mr="8">
                <Text>App</Text>
                <Tag ml="5px">{POSTER_APP_VERSION}</Tag>
              </Flex>
              <Flex mr="8">
                <Link
                  href={`https://blockscan.com/address/${POSTER_CONTRACT_ADDRESS}`}
                  isExternal
                >
                  <Text>Contract</Text>
                </Link>
                <Tag ml="5px">{POSTER_CONTRACT_VERSION}</Tag>
              </Flex>
              <Flex>
                <Link
                  href={`https://thegraph.com/legacy-explorer/subgraph/${POSTER_SUBGRAPH_ID}`}
                  isExternal
                >
                  <Text>Subgraph</Text>
                </Link>
                <Tag ml="5px">{POSTER_SUBGRAPH_ID}</Tag>
              </Flex>
            </Flex>
          </SimpleGrid>
        </Container>
      </footer>
    </>
  )
}

export default Layout
