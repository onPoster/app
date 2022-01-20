// Takes a long hash string and truncates it.
export function truncate(hash: string, length = 38, initialCharsLength = 6): string {
  return hash.replace(hash.substring(initialCharsLength, length), '...')
}