import { Web3Provider } from '@ethersproject/providers'
import { ethers } from 'ethers'
import Poster from '@poster/contracts/artifacts/contracts/Poster.sol/Poster.json'
import { Poster as PosterType } from '@poster/contracts/typechain'

/**
 * Prop Types
 */
type StateType = {
  inputValue: string
  isLoading: boolean
  charactersAmount: number
}
type ActionType =
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
  

/**
 * Component
 */
export const initialState: StateType = {
  inputValue: '',
  isLoading: false,
  charactersAmount: 0
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
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
      }
    default:
      throw new Error()
  }
}

export async function setPostContent(
  PosterContractAddress: string,
  state: StateType,
  provider: Web3Provider,
  dispatch: React.Dispatch<ActionType>
): Promise<void> {
  if (!state.inputValue) return
  if (provider) {
    dispatch({
      type: 'SET_LOADING',
      isLoading: true,
    })
    const signer = provider.getSigner()
    const contract = new ethers.Contract(
      PosterContractAddress,
      Poster.abi,
      signer
    ) as unknown as PosterType
    const transaction = await contract.post(state.inputValue)
    await transaction.wait()
    dispatch({
      type: 'SET_LOADING',
      isLoading: false,
    })
    dispatch({
      type: 'SET_INPUT_VALUE',
      inputValue: ''
    })
  }
}