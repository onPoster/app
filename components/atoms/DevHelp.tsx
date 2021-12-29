import { Flex, GridItem, Grid, SimpleGrid, Text } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { POSTER_DEFAULT_CHAIN_ID, POSTER_DEFAULT_NETWORK, POSTER_SUBGRAPH_URLS_BY_CHAIN_ID_MAP } from "../../constants/poster";

export const DevHelp = () => {
  const { chainId, active } = useEthers();
  return (
    <Grid
      templateColumns='repeat(6, 1fr)'
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
            <Text fontFamily={"mono"} fontSize={"xs"}>{POSTER_DEFAULT_NETWORK}</Text>
            <Text fontFamily={"mono"} fontSize={"xs"}>{active ? 'Active' : 'Not active'}</Text>
          </Flex>
          <Flex justifyContent="right">
            <Text fontFamily={"mono"} fontSize={"xs"}>{POSTER_SUBGRAPH_URLS_BY_CHAIN_ID_MAP[
              chainId ? chainId : POSTER_DEFAULT_CHAIN_ID
            ]}</Text>
          </Flex>
        </SimpleGrid>
      </GridItem>
    </Grid>
  )
}

