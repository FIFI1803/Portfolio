import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useContent, useSite } from './useContent'

const mockQuery = vi.fn()
vi.mock('./supabase', () => ({
  supabase: { from: () => ({ select: () => ({ order: () => mockQuery(), limit: () => mockQuery() }) }) },
}))

const local = [{ id: 'local-1', name: 'Local Project' }]

describe('useContent', () => {
  beforeEach(() => { mockQuery.mockReset() })

  it('returns local content synchronously on first render', () => {
    mockQuery.mockReturnValue(new Promise(() => {}))
    const { result } = renderHook(() => useContent('projects', local))
    expect(result.current).toEqual(local)
  })

  it('replaces local content when remote returns rows', async () => {
    const remote = [{ id: 'remote-1', name: 'Remote Project' }]
    mockQuery.mockResolvedValue({ data: remote, error: null })
    const { result } = renderHook(() => useContent('projects', local))
    await waitFor(() => expect(result.current).toEqual(remote))
  })

  it('keeps local content when remote returns an empty array', async () => {
    mockQuery.mockResolvedValue({ data: [], error: null })
    const { result } = renderHook(() => useContent('projects', local))
    await new Promise(r => setTimeout(r, 20))
    expect(result.current).toEqual(local)
  })

  it('keeps local content when remote errors', async () => {
    mockQuery.mockResolvedValue({ data: null, error: { message: 'paused' } })
    const { result } = renderHook(() => useContent('projects', local))
    await new Promise(r => setTimeout(r, 20))
    expect(result.current).toEqual(local)
  })

  it('keeps local content when the query rejects', async () => {
    mockQuery.mockRejectedValue(new Error('network down'))
    const { result } = renderHook(() => useContent('projects', local))
    await new Promise(r => setTimeout(r, 20))
    expect(result.current).toEqual(local)
  })
})

describe('useSite', () => {
  beforeEach(() => { mockQuery.mockReset() })

  it('merges the remote row over the local profile so missing columns keep local values', async () => {
    mockQuery.mockResolvedValue({ data: [{ id: 1, role: 'Remote Role', email: null }], error: null })
    const { result } = renderHook(() => useSite({ role: 'Local Role', email: 'a@b.c', focus: 'UI' }))
    await waitFor(() => expect(result.current.role).toBe('Remote Role'))
    expect(result.current.focus).toBe('UI')
    expect(result.current.email).toBeNull()
  })
})
