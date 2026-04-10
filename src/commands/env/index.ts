import type { Command } from '../../commands.js'
import type { LocalCommandCall } from '../../types/command.js'
import { applyConfigEnvironmentVariables } from '../../utils/managedEnv.js'
import {
  getSettings_DEPRECATED,
  updateSettingsForSource,
} from '../../utils/settings/settings.js'

const call: LocalCommandCall = async (args) => {
  const arg = args.trim()
  const settings = getSettings_DEPRECATED()
  const envs = settings?.envs ?? {}
  const activeEnv = settings?.activeEnv

  // No argument: list available envs and show active one
  if (!arg) {
    const names = Object.keys(envs)
    if (names.length === 0) {
      return {
        type: 'text',
        value:
          'No named environments configured. Add an "envs" map to your settings.json.',
      }
    }
    const lines = names.map((name) => {
      const marker = name === activeEnv ? '* ' : '  '
      return `${marker}${name}`
    })
    return {
      type: 'text',
      value: `Available environments (active marked with *):\n${lines.join('\n')}`,
    }
  }

  // "unset" — clear the active env
  if (arg === 'unset') {
    updateSettingsForSource('userSettings', { activeEnv: undefined })
    applyConfigEnvironmentVariables()
    return { type: 'text', value: 'Active environment cleared.' }
  }

  // Switch to named env
  if (!(arg in envs)) {
    const names = Object.keys(envs)
    const hint =
      names.length > 0
        ? `Available: ${names.join(', ')}`
        : 'No environments defined in settings.json.'
    return { type: 'text', value: `Unknown environment: "${arg}". ${hint}` }
  }

  updateSettingsForSource('userSettings', { activeEnv: arg })
  applyConfigEnvironmentVariables()
  return { type: 'text', value: `Switched to environment: ${arg}` }
}

const envCommand = {
  type: 'local',
  name: 'env',
  description: 'List or switch named environment presets (from settings.json "envs")',
  aliases: [],
  argumentHint: '[name|unset]',
  supportsNonInteractive: true,
  load: () => Promise.resolve({ call }),
} satisfies Command

export default envCommand
