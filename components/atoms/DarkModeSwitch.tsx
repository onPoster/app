
import { useColorMode, Switch } from '@chakra-ui/react'

export const DarkModeSwitch = (): JSX.Element => {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  return (
    <Switch
      position="fixed"
      bottom="1rem"
      right="1rem"
      color="green"
      isChecked={isDark}
      onChange={toggleColorMode}
    />
  )
}