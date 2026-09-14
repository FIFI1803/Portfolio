import { render, screen, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import Reveal from './Reveal'

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals() })

describe('Reveal', () => {
  it('renders visible when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    render(<Reveal><p>content</p></Reveal>)
    expect(screen.getByText('content').parentElement).toHaveAttribute('data-reveal', 'in')
  })

  it('reveals when the observer reports intersection', async () => {
    let trigger
    vi.stubGlobal('IntersectionObserver', class {
      constructor(cb) { trigger = cb }
      observe() {}
      disconnect() {}
    })
    render(<Reveal><p>content</p></Reveal>)
    expect(screen.getByText('content').parentElement).toHaveAttribute('data-reveal', 'out')
    trigger([{ isIntersecting: true }])
    await waitFor(() =>
      expect(screen.getByText('content').parentElement).toHaveAttribute('data-reveal', 'in'))
  })

  it('reveals via the fallback timer if the observer never fires', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('IntersectionObserver', class {
      constructor() {}
      observe() {}
      disconnect() {}
    })
    render(<Reveal><p>content</p></Reveal>)
    expect(screen.getByText('content').parentElement).toHaveAttribute('data-reveal', 'out')
    await act(async () => { await vi.advanceTimersByTimeAsync(2600) })
    expect(screen.getByText('content').parentElement).toHaveAttribute('data-reveal', 'in')
  })
})
