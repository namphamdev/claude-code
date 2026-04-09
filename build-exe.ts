import { getMacroDefines } from './scripts/defines.ts'
import { resolve } from 'path'
import { rename } from 'fs/promises'

// Detect platform/arch for native addon embedding
const platform = process.platform // 'win32' | 'darwin' | 'linux'
const arch = process.arch // 'x64' | 'arm64'
const addonDir = `vendor/audio-capture/${arch}-${platform}`
const addonPath = resolve(addonDir, 'audio-capture.node')

// Same feature set as build.ts
const DEFAULT_BUILD_FEATURES = [
  'AGENT_TRIGGERS_REMOTE',
  'CHICAGO_MCP',
  'VOICE_MODE',
  'SHOT_STATS',
  'PROMPT_CACHE_BREAK_DETECTION',
  'TOKEN_BUDGET',
  'AGENT_TRIGGERS',
  'ULTRATHINK',
  'BUILTIN_EXPLORE_PLAN_AGENTS',
  'LODESTONE',
  'EXTRACT_MEMORIES',
  'VERIFICATION_AGENT',
  'KAIROS_BRIEF',
  'AWAY_SUMMARY',
  'ULTRAPLAN',
  'DAEMON',
]

const envFeatures = Object.keys(process.env)
  .filter(k => k.startsWith('FEATURE_'))
  .map(k => k.replace('FEATURE_', ''))
const features = [...new Set([...DEFAULT_BUILD_FEATURES, ...envFeatures])]

const outName = platform === 'win32' ? 'ccb.exe' : 'ccb'

console.log(`Building executable: dist/${outName}`)
console.log(`Platform: ${platform}/${arch}`)
console.log(`Features: ${features.join(', ')}`)
console.log(`Native addon: ${addonPath}`)

const result = await Bun.build({
  entrypoints: ['src/entrypoints/cli.tsx'],
  outdir: 'dist',
  target: 'bun',
  compile: true,
  define: {
    ...getMacroDefines(),
    // Tell audio-capture loader to use the embedded path
    'process.env.AUDIO_CAPTURE_NODE_PATH': JSON.stringify(
      `../../audio-capture.node`,
    ),
  },
  features,
  naming: outName,
  // Embed the native addon for the current platform
  embed: [addonPath],
})

if (!result.success) {
  console.error('Build failed:')
  for (const log of result.logs) {
    console.error(log)
  }
  process.exit(1)
}

// Bun compile ignores `naming` — output is always based on entrypoint name.
// Rename cli.exe → ccb.exe (or cli → ccb on unix).
const compiledName = platform === 'win32' ? 'cli.exe' : 'cli'
if (compiledName !== outName) {
  await rename(resolve('dist', compiledName), resolve('dist', outName))
}

console.log(`\nExecutable built: dist/${outName}`)
