import { useState, useEffect, useRef, Dispatch } from 'react'
import { createClient } from '../../lib/connectors'
import { ActionType } from '../../lib/reducers'
import { FrameIcon } from '../atoms/FrameIcon'

export const AddImage = ({ dispatch }: { dispatch: Dispatch<ActionType> }) => {
  const [files, setFiles] = useState<FileList>()

  async function handleSubmit() {
    if (!files || files.length === 0) {
      return
    }
    const client = createClient()
    const cid = await client.add(files)
    const previewImageURL = `https://ipfs.infura.io/ipfs/${cid.path}`
    dispatch({
      type: 'SET_PREVIEW_IMAGE_URL',
      previewImageURL
    })
  }

  useEffect(() => {
    handleSubmit()
  }, [files])

  const inputFile = useRef(null)
  return (
    <>
      <FrameIcon
        boxSize="8"
        cursor="pointer"
        onClick={(e) => {
          e.preventDefault()
          inputFile.current?.click()
        }}
      />
      <input
        hidden
        ref={inputFile}
        type="file"
        onChange={(e) => setFiles(e.target.files)}
        multiple
      />
    </>
  )
}
