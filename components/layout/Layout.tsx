import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Container,
  Flex,
  Link,
  SimpleGrid,
  Grid,
  Tag,
  Text,
  GridItem,
  IconButton
} from '@chakra-ui/react'
import {
  SettingsIcon
} from '@chakra-ui/icons'
import {
  useNotifications,
  useEthers,
  shortenAddress,
} from '@usedapp/core'
import React from 'react'
import { POSTER_APP_VERSION } from '../../lib/constants'
import {
  POSTER_CONTRACT_ADDRESS,
  POSTER_DEFAULT_NETWORK_NAME,
  POSTER_ENVIRONMENT,
} from '../../constants/poster'
import ConnectWallet from '../ConnectWallet'
import Head, { MetaProps } from './Head'
import { Headline } from '../atoms/Headline'
import { Account } from '../atoms/Account'
import { truncate } from '../../lib/helpers'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { ActionType } from '../../lib/reducers'
import { DevHelp } from '../atoms/DevHelp'

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

/**
 * Prop Types
 */
interface LayoutProps {
  children: React.ReactNode
  customMeta?: MetaProps
  dispatch: React.Dispatch<ActionType>
  isDeveloperModeEnabled: boolean
}

/**
 * Component
 */
const Layout = ({
  children,
  customMeta,
  dispatch,
  isDeveloperModeEnabled,
}: LayoutProps): JSX.Element => {
  const { account } = useEthers()
  const { notifications } = useNotifications()
  return (
    <>
      <Head customMeta={customMeta} />
      <header>
        <Container maxWidth="container.xl">
          <SimpleGrid
            columns={[3, 2, 2, 2]}
            alignItems="center"
            justifyContent="space-between"
            py="4"
          >
            <Headline />
            <Flex justifyContent="flex-end">
              <Box>
                <IconButton
                  onClick={() => dispatch({
                    type: 'SET_TOGGLE_SETTINGS_DEVELOPER',
                    settingsDeveloper: !isDeveloperModeEnabled,
                  })}
                  variant={isDeveloperModeEnabled ? "solid" : "outline"}
                  aria-label='Search database'
                  icon={<SettingsIcon />}
                />
              </Box>
              {account ? <Account /> : <ConnectWallet />}
            </Flex>
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
                    {truncate(notification.transaction.hash, 61)}
                  </AlertDescription>
                </Box>
              </Alert>
            )
          })}
        </Container>
      </main>
      <footer>
        <Container mt="8" py="8" maxWidth="container.xl">
          <Grid
            templateColumns="repeat(6, 1fr)"
            alignItems="end"
            justifyContent="space-between"
          >
            <GridItem colSpan={[6, 2, 2, 2]}>
              <Flex w="100%" justifyContent="left">
                Built by
                <Link mx="1" href="https://twitter.com/auryn_macmillan">
                  <Text display="inline" fontWeight="700">
                    Auryn Macmillan
                  </Text>
                </Link>
                and
                <Link ml="1" href="https://twitter.com/jjperezaguinaga">
                  <Text display="inline" fontWeight="700">
                    Jose Aguinaga
                  </Text>
                </Link>
                .
              </Flex>
            </GridItem>
            <GridItem colSpan={[6, 4, 4, 4]}>
              <SimpleGrid
                columns={[1, 1, 3, 3]}
                gap="4"
                mt="4"
                justifyContent="flex-end"
                alignContent="center"
                alignItems="center"
                flexFlow={{ base: 'column', md: 'row' }}
              >
                <Flex w="100%" justifyContent="center">
                  <Link
                    mx="2"
                    href="https://github.com/onPoster/app"
                    isExternal
                  >
                    App
                    <ExternalLinkIcon ml="1" />
                  </Link>
                  <Tag ml="5px">{POSTER_APP_VERSION}</Tag>
                </Flex>
                <Flex w="100%" justifyContent="center">
                  <Link
                    mx="2"
                    href="https://github.com/onPoster/contract"
                    isExternal
                  >
                    Contract
                    <ExternalLinkIcon ml="1" />
                  </Link>
                  <Tag ml="5px">{shortenAddress(POSTER_CONTRACT_ADDRESS)}</Tag>
                </Flex>
                <Flex w="100%" justifyContent="center">
                  <Link
                    mx="2"
                    href="https://github.com/onPoster/subgraph"
                    isExternal
                  >
                    Subgraph
                    <ExternalLinkIcon ml="1" />
                  </Link>
                  <Tag ml="5px">{POSTER_DEFAULT_NETWORK_NAME}</Tag>
                </Flex>
              </SimpleGrid>
            </GridItem>
          </Grid>
          {(isDeveloperModeEnabled || POSTER_ENVIRONMENT != 'production') && <DevHelp />}
        </Container>
      </footer>
    </>
  )
}

export default Layout
