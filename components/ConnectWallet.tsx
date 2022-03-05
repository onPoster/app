import {
  Box,
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import React from 'react'
import { Web3Ethers } from '@usedapp/core'
import { walletconnect } from '../lib/connectors'
import { ActionType } from '../lib/reducers'

function ConnectWallet({ dispatch, activate, activateBrowserWallet }: { dispatch: React.Dispatch<ActionType>, activate: Web3Ethers["activate"], activateBrowserWallet: () => void }): JSX.Element {
  const { onOpen, isOpen, onClose } = useDisclosure()

  return (
    <>
      <Box
        order={[null, null, null, 2]}
        textAlign={['right', null, null, 'right']}
        w="100%"
        display="block"
        margin="auto"
      >
        <Button aria-label="Connect Wallet" colorScheme="teal" variant="outline" onClick={onOpen}>
          Connect wallet
        </Button>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Connect to a wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Button
              justifyContent="space-between"
              width="100%"
              mb="4"
              size="lg"
              variant="outline"
              rightIcon={
                <Image
                  maxWidth="20px"
                  src="images/logo-metamask.png"
                  alt="MetaMask"
                />
              }
              onClick={() => {
                activateBrowserWallet()
              }}
            >
              MetaMask
            </Button>
            <Button
              justifyContent="space-between"
              width="100%"
              mb="4"
              size="lg"
              variant="outline"
              rightIcon={
                <Image
                  maxWidth="20px"
                  src="images/logo-walletconnect.svg"
                  alt="WalletConnect"
                />
              }
              onClick={() => {
                activate(walletconnect)
              }}
            >
              WalletConnect
            </Button>
            <Button
              aria-label='Private (Demo)'
              justifyContent="space-between"
              width="100%"
              mb="4"
              size="lg"
              variant="outline"
              rightIcon={
                <ViewIcon
                  maxWidth="20px"
                  alt="Private Mode"
                />
              }
              onClick={() => {
                dispatch({
                  type: 'SET_FALLBACK_ACCOUNT',
                  useFallbackAccount: true,
                })
              }}
            >
              Private (Demo)
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ConnectWallet
