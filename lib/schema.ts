type microblog = 'microblog'

type newPost = {
  type: microblog
  text: string
}

type replyToPost = {
  type: microblog
  text: string
  replyTo: string
}

type newPostWithImage = {
  type: microblog
  text: string
  image: string
}

class PosterSchema {
  static createNewPost = (rawContent: string): string => JSON.stringify({
    "type": "microblog",
    "text": rawContent
  } as newPost)

  static createReplyToPost = (rawContent: string, replyToTxId: string): string => JSON.stringify({
    "type": "microblog",
    "text": rawContent,
    "replyTo": replyToTxId
  } as replyToPost)

  static createNewPostWithImage = (rawContent: string, ipfsCID: string): string => JSON.stringify({
    "type": "microblog",
    "text": rawContent,
    "image": `ipfs://${ipfsCID}`
  } as newPostWithImage)
}

export default PosterSchema;