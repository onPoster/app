import { JsonRpcSigner } from '@ethersproject/providers'
import Poster from 'Poster/artifacts/contracts/Poster.sol/Poster.json'
import { ethers } from 'ethers'
import { Poster as PosterType } from 'Poster/typechain/Poster'
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
  previewImageError: string
  settingsDeveloper: boolean
  useFallbackAccount: boolean
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
      type: 'SET_IMAGE_UPLOAD_ERROR'
      previewImageError: StateType['previewImageError']
    }
  | {
      type: 'SET_TOGGLE_SETTINGS_DEVELOPER'
      settingsDeveloper: StateType['settingsDeveloper']
  }
  | {
      type: 'SET_FALLBACK_ACCOUNT',
      useFallbackAccount: StateType['useFallbackAccount']
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
  previewImageError: '',
  settingsDeveloper: false,
  useFallbackAccount: false
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
        charactersAmount: action.charactersAmount,
      }
    case 'SET_REPLY_TO_CONTENT':
      return {
        ...state,
        replyToContent: action.replyToContent,
      }
    case 'SET_REPLY_TO_CONTENT_ID':
      return {
        ...state,
        replyToContentId: action.replyToContentId,
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
        isReloadIntervalLoading: action.isReloadIntervalLoading,
      }
    case 'SET_PREVIEW_IMAGE_CID':
      return {
        ...state,
        previewImageCID: action.previewImageCID,
      }
    case 'SET_IMAGE_UPLOAD_ERROR':
      return {
        ...state,
        previewImageError: action.previewImageError,
      }
    case 'SET_TOGGLE_SETTINGS_DEVELOPER':
      return {
        ...state,
        settingsDeveloper: action.settingsDeveloper
      }
    case 'SET_FALLBACK_ACCOUNT':
      return {
        ...state,
        useFallbackAccount: action.useFallbackAccount
      }
    default:
      throw new Error()
  }
}

export async function setPostContent(
  PosterContractAddress: string,
  state: StateType,
  signer: ethers.Wallet | JsonRpcSigner,
  dispatch: React.Dispatch<ActionType>
): Promise<void> {
  if (!state.inputValue) return
  if (signer) {
    try {
      dispatch({
        type: 'SET_LOADING',
        isLoading: true,
      })
      const contract = new ethers.Contract(
        PosterContractAddress,
        Poster.abi,
        signer
      ) as unknown as PosterType

      // @TODO: For now, replies do not have images.
      const post = state.replyToContentId
        ? PosterSchema.createReplyToPost(
            state.inputValue,
            state.replyToContentId
          )
        : state.previewImageCID
        ? PosterSchema.createNewPostWithImage(
            state.inputValue,
            state.previewImageCID
          )
        : PosterSchema.createNewPost(state.inputValue)

      await (await contract.post(post, 'post')).wait()

      dispatch({
        type: 'SET_LOADING',
        isLoading: false,
      })
      dispatch({
        type: 'SET_INPUT_VALUE',
        inputValue: '',
      })
      dispatch({
        type: 'SET_CHARACTERS_AMOUNT',
        charactersAmount: 0,
      })
      dispatch({
        type: 'SET_PREVIEW_IMAGE_CID',
        previewImageCID: null,
      })
      // @TODO: Decide to remove this altogether to only show upon
      // event detection via the additional RPC provider.
      // dispatch({
      //   type: 'SET_SUBGRAPH_RELOAD_INTERVAL_LOADING',
      //   isReloadIntervalLoading: true
      // })
    } catch (e) {
      console.error(e);
      dispatch({
        type: 'SET_LOADING',
        isLoading: false,
      })
    }
    dispatch({
      type: 'SET_REPLY_TO_CONTENT',
      replyToContent: '',
    })
    dispatch({
      type: 'SET_REPLY_TO_CONTENT_ID',
      replyToContentId: '',
    })
  }
}
