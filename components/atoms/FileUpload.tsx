import { ReactNode, useRef } from 'react'
import { InputGroup } from '@chakra-ui/react'

type FileUploadProps = {
  accept?: string
  multiple?: boolean
  children?: ReactNode
  onChangeHandler?: (HTMLInputElement) => void
}

export const FileUpload = (props: FileUploadProps): JSX.Element => {
  const { children, onChangeHandler } = props
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleClick = () => inputRef.current?.click()

  return (
    <InputGroup onClick={handleClick}>
      <input
        type="file"
        id="filepicker"
        name="fileList"
        ref={(e) => {
          inputRef.current = e
        }}
        hidden
        multiple
        required
        onChange={(e) => onChangeHandler(e.target.files)}
      />
      <>{children}</>
    </InputGroup>
  )
}
