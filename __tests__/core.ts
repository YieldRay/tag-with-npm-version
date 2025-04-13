/**
 * Unit tests for src/core.ts
 */

import { cmd, getPackageJSON, isCwdGit, lsRemoteTags } from '../src/core'
import { expect } from '@jest/globals'

describe('core', () => {
  it('getPackageJSON', async () => {
    await expect(getPackageJSON().then(pkg => pkg.version)).resolves.toContain(
      ''
    )
  })

  it('isCwdGit', async () => {
    await expect(isCwdGit()).resolves.toBe(true)
  })

  it('lsRemoteTags', async () => {
    const hash2tag = await lsRemoteTags()
    expect(hash2tag.size).toBeGreaterThan(0)
  })

  it('cmd', async () => {
    await expect(cmd("echo 'Hello'")).resolves.toContain('Hello')

    await expect(cmd('cmd-not-exists')).rejects.toThrow()
  })
})
