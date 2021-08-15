import { Box } from '@chakra-ui/react'
export const PosterImage = ({src}: { src: string}): JSX.Element => (
  <Box
    margin="5"
    padding="5"
    backgroundImage={src}
    backgroundRepeat="no-repeat"
    d="block"
    h="300px"
    backgroundSize="contain"
    backgroundPosition="center"
  ></Box>
)
