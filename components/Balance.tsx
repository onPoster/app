import { Text } from '@chakra-ui/react'
import { useEtherBalance } from '@usedapp/core'
import { utils } from 'ethers'

/**
 * Component
 */
function Balance({ account }: { account: string }): JSX.Element {
  const etherBalance = useEtherBalance(account)
  const finalBalance = etherBalance ? utils.formatEther(etherBalance) : ''

  return <Text>{finalBalance} ETH</Text>
}

export default Balance
