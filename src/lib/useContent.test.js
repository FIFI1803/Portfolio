import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useContent } from './useContent'

const mockSelect = vi.fn()
vi.mock('./supabase', () => ({
  supabase: { from: () => ({ select: () => ({ order: (...a) => mockSelect(...a) }) }) },
}))

const local = [{ id: 'local-1', name: 'Local Project' }]

describe('useContent', () => {
  beforeEach(() => { mockSelect.mockReset() })

  it('returns local content synchronously on first render', () => {
    mockSelect.mockReturnValue(new Promise(() => {}))
    const { result } = renderHook(() => useContent('projects', local))
    expect(result.current).toEqual(local)
  })

  it('replaces local content when remote returns rows', async () => {
    const remote = [{ id: 'remote-1', name: 'Remote Project' }]
    mockSelect.mockResolvedValue({ data: remote, error: null })
    const { result } = renderHook(() => useContent('projects', local))
    await waitFor(() => expect(result.current).toEqual(remote))
  })

  it('keeps local content when remote returns an empty array', async () => {
    mockSelect.mockResolvedValue({ data: [], error: null })
    const { result } = renderHook(() => useContent('projects', local))
    await new Promise(r => setTimeout(r, 20))
    expect(result.current).toEqual(local)
  })

  it('keeps local content when remote errors', async () => {
    mockSelect.mockResolvedValue({ data: null, error: { message: 'paused' } })
    const { result } = renderHook(() => useContent('projects', local))
    await new Promise(r => setTimeout(r, 20))
    expect(result.current).toEqual(local)
  })

  it('keeps local content when the query rejects', async () => {
    mockSelect.mockRejectedValue(new Error('network down'))
    const { result } = renderHook(() => useContent('projects', local))
    await new Promise(r => setTimeout(r, 20))
    expect(result.current).toEqual(local)
  })
})
