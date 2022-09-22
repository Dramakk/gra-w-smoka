declare const BASENAME: any
export const proxiedFetch: typeof fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input === 'string') {
    const prefix = BASENAME || ''
    return fetch(`${prefix}${input}`, init)
  }

  return fetch(input as any, init)
}