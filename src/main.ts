import * as core from '@actions/core'
import { core as coreFn } from './core'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const origin = core.getInput('origin')
    const force = core.getInput('force') === 'true'

    const outputs = await coreFn(origin, force)

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`origin is ${origin}`)

    // Set outputs for other workflow steps to use
    for (const [name, value] of Object.entries(outputs)) {
      core.setOutput(name, value)
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
