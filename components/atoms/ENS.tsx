import { Text, TextProps } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { truncate } from '../../lib/helpers'
import { JsonRpcProvider } from '@ethersproject/providers'

export const ENS = ({
  address,
  props,
  library
}: {
  address: string
  props: TextProps
  library: JsonRpcProvider
}): JSX.Element => {
  const [ens, setEns] = useState<string | null>()

  useEffect(() => {
    let mounted = true
    if (address && library) {
      library
        ?.lookupAddress(address)
        .then((name) => {
          if (mounted) {
            setEns(name)
          }
        })
        .catch(() => setEns(null))
    }
    return () => {
      mounted = false
      setEns(null)
    }
  }, [address, library])

  return (
    <Text fontFamily="mono" {...props}>
      {ens || truncate(address)}
    </Text>
  )
}
