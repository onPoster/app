import { Web3Provider } from '@ethersproject/providers'
import { ethers, PopulatedTransaction } from 'ethers'
import { Biconomy } from '@biconomy/mexa'
import { Poster as PosterType } from 'Poster/typechain/Poster'
import { SUBGRAPH_RELOADING_TIME_IN_MS } from './constants'
import PosterSchema from './schema'

/**
 * Prop Types
 */
type StateType = {
  inputValue: string
  isLoading: boolean
  charactersAmount: number
  needsToReloadGetAllPosts: boolean
  isReloadIntervalLoading: boolean
  replyToContent: string
  replyToContentId: string
  previewImageCID: string
  biconomy: Biconomy
}
export type ActionType =
  | {
    type: 'SET_INPUT_VALUE'
    inputValue: StateType['inputValue']
  }
  | {
    type: 'SET_LOADING'
    isLoading: StateType['isLoading']
  }
  | {
    type: 'SET_CHARACTERS_AMOUNT'
    charactersAmount: StateType['charactersAmount']
  }
  | {
    type: 'SET_SUBGRAPH_GETALLPOSTS_RELOAD'
    needsToReloadGetAllPosts: StateType['needsToReloadGetAllPosts']
  }
  | {
    type: 'SET_SUBGRAPH_RELOAD_INTERVAL_LOADING'
    isReloadIntervalLoading: StateType['isReloadIntervalLoading']
  }
  | {
    type: 'SET_REPLY_TO_CONTENT'
    replyToContent: StateType['replyToContent']
  }
  | {
    type: 'SET_REPLY_TO_CONTENT_ID'
    replyToContentId: StateType['replyToContentId']
  }
  | {
    type: 'SET_PREVIEW_IMAGE_CID'
    previewImageCID: StateType['previewImageCID']
  }
  | {
    type: 'SET_BICONOMY'
    biconomy: StateType['biconomy']
  }


/**
 * Component
 */
export const initialState: StateType = {
  inputValue: '',
  isLoading: false,
  charactersAmount: 0,
  needsToReloadGetAllPosts: false,
  isReloadIntervalLoading: false,
  replyToContent: '',
  replyToContentId: '',
  previewImageCID: '',
  biconomy: null
}

export function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case 'SET_INPUT_VALUE':
      return {
        ...state,
        inputValue: action.inputValue,
      }
    case 'SET_CHARACTERS_AMOUNT':
      return {
        ...state,
        charactersAmount: action.charactersAmount
      }
    case 'SET_REPLY_TO_CONTENT':
      return {
        ...state,
        replyToContent: action.replyToContent
      }
    case 'SET_REPLY_TO_CONTENT_ID':
      return {
        ...state,
        replyToContentId: action.replyToContentId
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
      }
    case 'SET_SUBGRAPH_GETALLPOSTS_RELOAD':
      return {
        ...state,
        needsToReloadGetAllPosts: action.needsToReloadGetAllPosts,
      }
    case 'SET_SUBGRAPH_RELOAD_INTERVAL_LOADING':
      return {
        ...state,
        isReloadIntervalLoading: action.isReloadIntervalLoading
      }
    case 'SET_PREVIEW_IMAGE_CID':
      return {
        ...state,
        previewImageCID: action.previewImageCID
      }
    case 'SET_BICONOMY':
      return {
        ...state,
        biconomy: action.biconomy,
      }
    default:
      throw new Error()
  }
}

const gasLessPost = async (
  contractAddress: string,
  address: string,
  state: StateType,
  transaction: Promise<PopulatedTransaction>,
  dispatch: React.Dispatch<ActionType>
) => {
  const { data } = await transaction;
  const provider = state.biconomy.getEthersProvider()

  const tx = await provider.send('eth_sendTransaction', [{ data, from: address, to: contractAddress, signatureType: 'EIP712_SIGN' }])
    .catch(err => console.error(err))

  const timeout = setTimeout(() => {
    dispatch({
      type: 'SET_SUBGRAPH_GETALLPOSTS_RELOAD',
      needsToReloadGetAllPosts: true,
    })
  }, SUBGRAPH_RELOADING_TIME_IN_MS * 5)

  await provider.once(tx, () => {
    clearTimeout(timeout)
    dispatch({
      type: 'SET_SUBGRAPH_GETALLPOSTS_RELOAD',
      needsToReloadGetAllPosts: true,
    })
  })
}

export async function setPostContent(
  PosterContractAddress: string,
  state: StateType,
  provider: Web3Provider,
  dispatch: React.Dispatch<ActionType>
): Promise<void> {
  if (!state.inputValue) return
  if (provider) {
    try {
      dispatch({
        type: 'SET_LOADING',
        isLoading: true,
      })
      const signer = provider.getSigner()
      const address = await signer.getAddress()

      // See https://github.com/ETHPoster/proxy,
      // Address deployed from 0x9101A466Dc1acb6D0a538D207E8D3e3D45AD0c85
      const PROXYPOSTERADDRESS = '0x41622a156AC81Ac830032de597aAe5b53e359898'
      const proxyPosterABI = [{ "inputs": [{ "internalType": "address", "name": "_posterAddress", "type": "address" }, { "internalType": "address", "name": "_trustedForwarder", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "address", "name": "forwarder", "type": "address" }], "name": "isTrustedForwarder", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "content", "type": "string" }], "name": "post", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "posterContract", "outputs": [{ "internalType": "contract IPoster", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }]

      // Replaced by gasless tx
      const contract = new ethers.Contract(
        PROXYPOSTERADDRESS,
        proxyPosterABI,
        state.biconomy ?
          state.biconomy.getSignerByAddress(address) : signer
      ) as unknown as PosterType

      // @TODO: For now, replies do not have images.
      const post = state.replyToContentId ?
        PosterSchema.createReplyToPost(state.inputValue, state.replyToContentId) :
        state.previewImageCID ?
          PosterSchema.createNewPostWithImage(state.inputValue, state.previewImageCID) :
          PosterSchema.createNewPost(state.inputValue)

      // Replacing for gas-less transaction
      await gasLessPost(
        PROXYPOSTERADDRESS,
        await signer.getAddress(),
        state,
        contract.populateTransaction.post(post),
        dispatch
      )

      dispatch({
        type: 'SET_LOADING',
        isLoading: false,
      })
      dispatch({
        type: 'SET_INPUT_VALUE',
        inputValue: ''
      })
      dispatch({
        type: 'SET_CHARACTERS_AMOUNT',
        charactersAmount: 0
      })
      dispatch({
        type: 'SET_SUBGRAPH_RELOAD_INTERVAL_LOADING',
        isReloadIntervalLoading: true
      })
    } catch (e) {
      dispatch({
        type: 'SET_LOADING',
        isLoading: false,
      })
    }
    dispatch({
      type: 'SET_REPLY_TO_CONTENT',
      replyToContent: ''
    })
    dispatch({
      type: 'SET_REPLY_TO_CONTENT_ID',
      replyToContentId: ''
    })
  }
}