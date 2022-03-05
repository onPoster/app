import { Flex, GridItem, Grid, SimpleGrid, Text } from '@chakra-ui/react'
import { ChainId } from '@usedapp/core'
import {
  DEFAULT_IPFS_API,
  DEFAULT_IPFS_GATEWAY,
} from '../../constants/ethereum'
import {
  POSTER_DEFAULT_CHAIN_ID,
  POSTER_DEFAULT_NETWORK,
  POSTER_SUBGRAPH_URLS_BY_CHAIN_ID_MAP,
} from '../../constants/poster'

export const DevHelp = ({ chainId }: { chainId: ChainId }): JSX.Element => {
  return (
    <Grid
      templateColumns="repeat(6, 1fr)"
      alignItems="end"
      justifyContent="space-between"
    >
      <GridItem colSpan={[6, 6, 6, 6]}>
        <SimpleGrid
          columns={[1, 1, 2, 2]}
          gap="2"
          mt="4"
          justifyContent="flex-end"
        >
          <Flex justifyContent="space-between">
            <Text fontFamily={'mono'} fontSize={'xs'}>
              <b>Default Network</b> {POSTER_DEFAULT_NETWORK}
            </Text>
          </Flex>
          <Flex justifyContent="left">
            <Text fontFamily={'mono'} fontSize={'xs'}>
              <b>Subgraph URL</b>{' '}
              {
                POSTER_SUBGRAPH_URLS_BY_CHAIN_ID_MAP[
                  chainId ? chainId : POSTER_DEFAULT_CHAIN_ID
                ]
              }
            </Text>
          </Flex>
        </SimpleGrid>
        <SimpleGrid
          columns={[1, 1, 2, 2]}
          gap="2"
          mt="4"
          justifyContent="flex-end"
        >
          <Flex justifyContent="space-between">
            <Text fontFamily={'mono'} fontSize={'xs'}>
              <b>IPFS API URL</b> {DEFAULT_IPFS_API}
            </Text>
          </Flex>
          <Flex justifyContent="left">
            <Text fontFamily={'mono'} fontSize={'xs'}>
              <b>IPFS Gateway URL</b> {DEFAULT_IPFS_GATEWAY}
            </Text>
          </Flex>
        </SimpleGrid>
      </GridItem>
    </Grid>
  )
}
