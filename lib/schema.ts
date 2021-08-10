type microblog = 'microblog'

type newPost = {
  type: microblog,
  text: string
}

class PosterSchema {
  static createNewPost = (rawContent: string): string => JSON.stringify({
    "type": "microblog",
    "text": rawContent
  } as newPost)
}

export default PosterSchema;