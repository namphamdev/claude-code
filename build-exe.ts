import { getMacroDefines } from './scripts/defines.ts'
import { resolve } from 'path'
import { mkdir, rename, rm, stat } from 'fs/promises'

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

const exeName = platform === 'win32' ? 'claude.exe' : 'claude'
// Bun compile ignores `naming` — output is always based on entrypoint name.
const compiledName = platform === 'win32' ? 'cli.exe' : 'cli'

const commonDefine = {
  ...getMacroDefines(),
  // Tell audio-capture loader to use the embedded path
  'process.env.AUDIO_CAPTURE_NODE_PATH': JSON.stringify(
    `../../audio-capture.node`,
  ),
}

async function cleanDist(): Promise<void> {
  try {
    await rm('dist', { recursive: true, force: true })
    console.log('Cleaned dist folder')
  } catch {
    // Ignore if dist doesn't exist
  }
}

function formatSize(bytes: number): string {
  const mb = bytes / (1024 * 1024)
  return `${mb.toFixed(1)} MB`
}

// Clean dist folder before building
await cleanDist()

// --- Build 1: Full exe with embedded Bun runtime ---
console.log(
  `\n=== Building full executable (with runtime): dist/${exeName} ===`,
)
console.log(`Platform: ${platform}/${arch}`)
console.log(`Features: ${features.join(', ')}`)
console.log(`Native addon: ${addonPath}`)

const result1 = await Bun.build({
  entrypoints: ['src/entrypoints/cli.tsx'],
  outdir: 'dist',
  target: 'bun',
  compile: true,
  minify: true,
  define: commonDefine,
  features,
  naming: exeName,
  embed: [addonPath],
})

if (!result1.success) {
  console.error('Build (full exe) failed:')
  for (const log of result1.logs) {
    console.error(log)
  }
  process.exit(1)
}

if (compiledName !== exeName) {
  await rename(resolve('dist', compiledName), resolve('dist', exeName))
}

const fullSize = (await stat(resolve('dist', exeName))).size
console.log(`Built: dist/${exeName} (${formatSize(fullSize)})`)

// --- Build 2: Slim bundle (no embedded runtime, requires bun on PATH) ---
const slimDir = resolve('dist', 'slim')
await mkdir(slimDir, { recursive: true })

console.log(`\n=== Building slim bundle (no runtime): dist/slim/claude.js ===`)

const result2 = await Bun.build({
  entrypoints: ['src/entrypoints/cli.tsx'],
  outdir: slimDir,
  target: 'bun',
  minify: true,
  define: commonDefine,
  features,
  naming: 'claude.js',
})

if (!result2.success) {
  console.error('Build (slim bundle) failed:')
  for (const log of result2.logs) {
    console.error(log)
  }
  process.exit(1)
}

const bundleSize = (await stat(resolve(slimDir, 'claude.js'))).size
console.log(`Built: dist/slim/claude.js (${formatSize(bundleSize)})`)

// Create convenience launcher scripts
const batContent = `@echo off\r\nbun "%~dp0claude.js" %*\r\n`
const shContent = `#!/bin/sh\nexec bun "$(dirname "$0")/claude.js" "$@"\n`
await Bun.write(resolve(slimDir, 'claude.cmd'), batContent)
await Bun.write(resolve(slimDir, 'claude.sh'), shContent)

// --- Summary ---
console.log(`\n=== Build complete ===`)
console.log(
  `  dist/${exeName}              ${formatSize(fullSize)} (standalone, includes Bun runtime)`,
)
console.log(
  `  dist/slim/claude.js             ${formatSize(bundleSize)} (app bundle, requires bun on PATH)`,
)
console.log(
  `  dist/slim/claude.cmd         launcher for Windows (bun claude.js %*)`,
)
console.log(
  `  dist/slim/claude.sh          launcher for Unix (bun claude.js "$@")`,
)
console.log(
  `  Savings: ${formatSize(fullSize - bundleSize)} (${((1 - bundleSize / fullSize) * 100).toFixed(0)}% smaller without runtime)`,
)
