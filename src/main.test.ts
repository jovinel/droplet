import { findByRole } from '@testing-library/dom'
import { getFunctionName } from 'convex/server'
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const convex = vi.hoisted(() => ({
  urls: [] as string[],
  providerClients: [] as unknown[],
  queryNames: [] as string[],
  setHealth: undefined as undefined | ((health: { ready: boolean }) => void),
}))

vi.mock('convex/react', async () => {
  const React = await import('react')

  return {
    ConvexReactClient: class {
      readonly url: string

      constructor(url: string) {
        this.url = url
        convex.urls.push(url)
      }
    },
    ConvexProvider: ({ client, children }: { client: unknown; children: React.ReactNode }) => {
      convex.providerClients.push(client)
      return children
    },
    useQuery: (reference: Parameters<typeof getFunctionName>[0]) => {
      convex.queryNames.push(getFunctionName(reference))
      const [health, setHealth] = React.useState<{ ready: boolean } | undefined>()
      convex.setHealth = setHealth
      return health
    },
  }
})

beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  vi.resetModules()
  convex.urls.length = 0
  convex.providerClients.length = 0
  convex.queryNames.length = 0
  convex.setHealth = undefined
  document.body.innerHTML = '<div id="root"></div>'
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('app bootstrap', () => {
  it('shows setup instructions without a Convex URL', async () => {
    vi.stubEnv('VITE_CONVEX_URL', '')

    await act(async () => {
      await import('./main.tsx')
    })

    expect((await findByRole(document.body, 'alert')).textContent).toContain('VITE_CONVEX_URL')
    expect(convex.urls).toEqual([])
    expect(convex.queryNames).toEqual([])
  })

  it('connects to Convex and displays loading then ready from a controlled query response', async () => {
    vi.stubEnv('VITE_CONVEX_URL', 'https://example.convex.cloud')

    await act(async () => {
      await import('./main.tsx')
    })

    expect(convex.urls).toEqual(['https://example.convex.cloud'])
    expect(convex.providerClients).toContainEqual(
      expect.objectContaining({ url: 'https://example.convex.cloud' }),
    )
    expect(convex.queryNames).toContain('health:check')
    expect((await findByRole(document.body, 'status')).textContent).toContain('Connecting')

    await act(async () => {
      convex.setHealth?.({ ready: true })
    })

    expect((await findByRole(document.body, 'status')).textContent).toContain('ready')
  })
})
