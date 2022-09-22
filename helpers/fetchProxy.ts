declare const BASENAME: any

export const BASE_URL = BASENAME || ''

export const proxiedFetch: typeof fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input === 'string') {
    return fetch(`${BASE_URL}${input}`, init)
  }

  return fetch(input as any, init)
}
