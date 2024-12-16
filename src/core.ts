import { exec, getExecOutput } from '@actions/exec'
import * as fs from 'node:fs/promises'

/* istanbul ignore next */
export async function core(
  origin = 'origin',
  prefix = '',
  force = false
): Promise<Record<string, string | number | boolean>> {
  if (!(await isCwdGit())) throw new Error('Not in a git repository')

  const version = await getVersion()
  const tag = prefix + version
  const remoteTags = Array.from((await lsRemoteTags(origin)).keys())
  if (!force && remoteTags.includes(`refs/tags/${tag}`)) {
    return { skip: true }
  }
  await exec(`git tag "${tag}"`)
  await exec(`git push ${force ? '-f' : ''} "${origin}" "${tag}"`)
  return { version, skip: false }
}

export async function lsRemoteTags(
  origin = 'origin'
): Promise<Map<string, string>> {
  const output = await cmd(`git ls-remote --tags "${origin}"`)
  const map = new Map<string, string>()
  for (const line of output.trim().split(/\r|\n/)) {
    const [hash, ref] = line.trim().split(/\s+/)
    if (!ref) continue
    map.set(ref, hash)
  }
  return map
}

export async function isCwdGit(): Promise<boolean> {
  const bool = await cmd('git rev-parse --is-inside-work-tree')
  return bool === 'true'
}

export async function getVersion(): Promise<string> {
  const file = await fs.readFile('package.json', 'utf-8')
  const pkg = JSON.parse(file) as PackageJSON
  return pkg.version
}

export async function cmd(
  commandLine: string,
  args?: string[]
): Promise<string> {
  const { exitCode, stdout, stderr } = await getExecOutput(commandLine, args)
  if (exitCode) {
    throw new Error(`Failed to execute \`${commandLine}\`, stderr:\n${stderr}`)
  }
  return stdout.trim()
}

interface PackageJSON {
  dependencies?: Record<string, string>
  description?: string
  devDependencies?: Record<string, string>
  files?: string[]
  homepage?: string
  keywords?: string[]
  license?: string
  main?: string
  name: string
  optionalDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  private?: boolean
  scripts?: Record<string, string>
  version: string
  [field: string]: unknown
}
