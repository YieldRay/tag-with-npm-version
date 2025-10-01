/**
 * Unit tests for the action's entrypoint, src/index.ts
 */

import { jest } from '@jest/globals'

jest.unstable_mockModule('../src/main', () => ({
  run: jest.fn().mockResolvedValue(undefined)
}))

describe('index', () => {
  it('calls run when imported', async () => {
    const { run } = await import('../src/main')
    await import('../src/index')
    expect(run).toHaveBeenCalled()
  })
})
