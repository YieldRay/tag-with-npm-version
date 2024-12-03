import * as exec from '@actions/exec'
import * as fs from 'node:fs'

export async function core(origin: string): Promise<Record<string, any>> {
  if (!(await isCwdGit())) throw new Error('Not in a git repository')

  const version = await getVersion()
  const remoteTags = (await cmd(`git ls-remote --tags "${origin}"`)).split(
    /\r|\n/
  )
  if (remoteTags.some(tag => tag.includes(`refs/tags/${version}`))) {
    return { skip: true }
  }
  await exec.exec(`git tag "${version}"`)
  await exec.exec(`git push "${origin}" "${version}"`)
  return { version, skip: false }
}

export async function isCwdGit() {
  const bool = await cmd('git rev-parse --is-inside-work-tree')
  return bool === 'true'
}

export async function getVersion() {
  const version = JSON.parse(fs.readFileSync('package.json', 'utf-8'))[
    'version'
  ]
  return version
}

export async function cmd(commandLine: string, args?: string[]) {
  const { exitCode, stdout, stderr } = await exec.getExecOutput(
    commandLine,
    args
  )
  if (exitCode) {
    throw new Error(`Failed to execute \`${commandLine}\`, stderr:\n${stderr}`)
  }
  return stdout.trim()
}
