/**
 * Unit tests for src/core.ts
 */

import { getVersion, isCwdGit, cmd } from '../src/core'
import { expect } from '@jest/globals'

describe('core', () => {
  it('getVersion', async () => {
    await expect(getVersion()).resolves.toContain('')
  })

  it('isCwdGit', async () => {
    await expect(isCwdGit()).resolves.toBe(true)
  })

  it('cmd', async () => {
    await expect(cmd("echo 'Hello'")).resolves.toContain('Hello')

    await expect(cmd('cmd-not-exists')).rejects.toThrow()
  })
})
