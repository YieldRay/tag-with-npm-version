import * as exec from '@actions/exec'
import * as fs from 'node:fs/promises'

export async function core(
  origin = 'origin',
  prefix = '',
  force = false
): Promise<Record<string, string | number | boolean>> {
  if (!(await isCwdGit())) throw new Error('Not in a git repository')

  const version = await getVersion()
  const tag = prefix + version
  const remoteTags = (await cmd(`git ls-remote --tags "${origin}"`)).split(
    /\r|\n/
  )
  if (!force && remoteTags.some(tag => tag.includes(`refs/tags/${tag}`))) {
    return { skip: true }
  }
  await exec.exec(`git tag "${version}"`)
  await exec.exec(`git push ${force ? '-f' : ''} "${origin}" "${tag}"`)
  return { version, skip: false }
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
  const { exitCode, stdout, stderr } = await exec.getExecOutput(
    commandLine,
    args
  )
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
