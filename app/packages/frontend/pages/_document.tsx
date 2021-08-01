import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import { ColorModeScript } from '@chakra-ui/react'

const scriptTxt = `
(function () {
  const { pathname } = window.location
  const ipfsMatch = /.*\\/Qm\\w{44}\\//.exec(pathname)
  const base = document.createElement('base')
  base.href = ipfsMatch ? ipfsMatch[0] : '/'
  document.head.append(base)
})();
`

export default class Document extends NextDocument {
  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <script dangerouslySetInnerHTML={{__html: scriptTxt}}/>
        </Head>
        <body>
          {/* Make Color mode to persists when you refresh the page. */}
          <ColorModeScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}