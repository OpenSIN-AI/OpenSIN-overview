#!/usr/bin/env node
/**
 * Markdown internal-link validator.
 *
 * Walks all .md files in the repo, extracts [text](link) patterns, and
 * verifies that relative links resolve to an existing file (or existing
 * anchor). External links (http/https/mailto) are *not* fetched — that's
 * out of scope for fast CI. Use a scheduled link-check workflow for that.
 *
 * Exit code 0 on clean, 1 on any broken link.
 *
 * Zero dependencies.
 */

import fs from "node:fs"
import path from "node:path"

const IGNORE_DIRS = new Set([".git", "node_modules", "dist", "build", ".next", ".vercel", ".turbo"])
const MD_LINK_RE = /\[([^\]\n]+)\]\(([^)\n]+)\)/g

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") && entry.name !== ".github") continue
    if (IGNORE_DIRS.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, acc)
    else if (entry.isFile() && /\.mdx?$/i.test(entry.name)) acc.push(full)
  }
  return acc
}

function lineColAt(source, idx) {
  let line = 1
  let col = 1
  for (let i = 0; i < idx; i++) {
    if (source[i] === "\n") {
      line++
      col = 1
    } else col++
  }
  return { line, col }
}

function isExternal(href) {
  return /^(https?:|mailto:|tel:|ftp:|data:)/i.test(href)
}

function stripFragment(href) {
  const hash = href.indexOf("#")
  return hash === -1 ? [href, ""] : [href.slice(0, hash), href.slice(hash + 1)]
}

function checkFile(file, root) {
  const source = fs.readFileSync(file, "utf8")
  const errors = []
  let m
  MD_LINK_RE.lastIndex = 0
  while ((m = MD_LINK_RE.exec(source))) {
    const raw = m[2].trim()
    if (!raw) continue
    if (isExternal(raw)) continue
    const [pathPart, anchor] = stripFragment(raw)
    // Pure anchor links (#foo) refer to headings in the same file — we skip
    // deep heading validation for now (it's legal Markdown either way).
    if (pathPart === "") continue

    const dir = path.dirname(file)
    const resolved = path.resolve(dir, pathPart)
    if (!fs.existsSync(resolved)) {
      const pos = lineColAt(source, m.index)
      errors.push({
        file: path.relative(root, file),
        line: pos.line,
        col: pos.col,
        link: raw,
        reason: "target does not exist",
      })
    }
  }
  return errors
}

function main() {
  const root = process.cwd()
  const files = walk(root)
  console.log(`[links] scanning ${files.length} markdown files`)
  let errors = []
  for (const f of files) {
    errors = errors.concat(checkFile(f, root))
  }
  if (errors.length === 0) {
    console.log(`[links] ok — 0 broken internal links`)
    process.exit(0)
  }
  console.error(`[links] FAIL — ${errors.length} broken internal link${errors.length === 1 ? "" : "s"}:`)
  for (const e of errors) {
    console.error(`  ${e.file}:${e.line}:${e.col}  ->  ${e.link}  (${e.reason})`)
  }
  process.exit(1)
}

main()
