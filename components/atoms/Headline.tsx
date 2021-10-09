import { Box, Heading, Image, Text, useColorMode } from '@chakra-ui/react'
import { POSTER_UI_LOGO } from '../../constants/ui'
export const Headline = () => {
  const { colorMode } = useColorMode()
  return (
    <Box d="flex" alignItems="center">
      <Heading as="h1">
        <Image maxWidth={{ base: "40px", md: "60px" }} src={POSTER_UI_LOGO[colorMode]} alt="Poster" />
      </Heading>
      <Text ml={{ base: 0, md: '10px' }} display={{ base: 'none', md: 'block' }} fontSize="lg">
        A general purpose decentralized social network.
      </Text>
    </Box>
  )
}
