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
  Tag,
  Text,
} from '@chakra-ui/react'
import {
  getChainName,
  ChainId,
  useNotifications,
  useEthers,
} from '@usedapp/core'
import React from 'react'
import { Biconomy } from '@biconomy/mexa'
import { providers } from 'ethers'
import { ETHEREUM_PROVIDERS } from '../../constants/ethereum'
import { POSTER_APP_VERSION } from '../../lib/constants'
import {
  POSTER_DEFAULT_CHAIN_ID,
  POSTER_CONTRACT_ADDRESS,
} from '../../constants/poster'
import ConnectWallet from '../ConnectWallet'
import Head, { MetaProps } from './Head'
import { Headline } from '../atoms/Headline'
import { Account } from '../atoms/Account'
import { truncateHash } from '../../lib/helpers'
import { GitHubIcon } from '../atoms/GitHubIcon'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { ActionType } from '../../lib/reducers'
import { useEffect } from 'react'

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
}

/**
 * Component
 */
const Layout = ({
  children,
  customMeta,
  dispatch,
}: LayoutProps): JSX.Element => {
  const { account, chainId, library } = useEthers()
  const { notifications } = useNotifications()

  useEffect(() => {
    const loadBiconomy = async() => {
      const biconomy = new Biconomy(
        new providers.JsonRpcProvider(ETHEREUM_PROVIDERS[ChainId.Polygon]),
        { apiKey: process.env.NEXT_PUBLIC_BICONOMY_KEY, walletProvider: library.provider }
      )
      await new Promise((resolve, reject) => biconomy.onEvent(biconomy.READY, resolve).onEvent(biconomy.ERROR, reject))
      dispatch({
        type: 'SET_BICONOMY',
        biconomy,
      })
    }
    library && loadBiconomy()
  }, [library])

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
            {account ? <Account /> : <ConnectWallet />}
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
            <SimpleGrid
              columns={[1, 1, 3, 3]}
              gap="4"
              mt="4"
              justifyContent="flex-end"
              alignContent="center"
              alignItems="center"
              flexFlow={{ base: 'column', md: 'row' }}
            >
              <Flex alignItems="baseline" w="100%" justifyContent="center">
                <GitHubIcon />
                <Link
                  mx="2"
                  href="https://github.com/ETHPoster/app/issues/new"
                  isExternal
                >
                  Suggest feature
                </Link>
                <ExternalLinkIcon />
              </Flex>
              <Flex w="100%" justifyContent="center">
                <Text>App</Text>
                <Tag ml="5px">{POSTER_APP_VERSION}</Tag>
              </Flex>
              <Flex w="100%" justifyContent="space-around">
                <Link
                  href={`https://blockscan.com/address/${POSTER_CONTRACT_ADDRESS}`}
                  isExternal
                >
                  <Text textDecoration="underline">Contract</Text>
                </Link>
                <Link
                  href={`https://thegraph.com/legacy-explorer/subgraph/jjperezaguinaga/poster-${getChainName(
                    chainId || POSTER_DEFAULT_CHAIN_ID
                  ).toLowerCase()}`}
                  isExternal
                >
                  <Text textDecoration="underline">Subgraph</Text>
                </Link>
              </Flex>
            </SimpleGrid>
          </SimpleGrid>
        </Container>
      </footer>
    </>
  )
}

export default Layout
