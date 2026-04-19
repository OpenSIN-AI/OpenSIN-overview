#!/usr/bin/env node
/**
 * Validate every templates/teams/*.json against schemas/team.schema.json.
 *
 * Zero dependencies on purpose: uses a tiny hand-rolled validator that
 * understands just the subset of JSON Schema 2020-12 this schema uses
 * (type, required, properties, additionalProperties, items, minItems,
 * maxItems, minLength, maxLength, pattern, enum, const, minimum, maximum).
 *
 * In addition to structural validation, enforces cross-file constraints
 * the schema alone cannot express:
 *   1. `id` matches the filename (Team-SIN-X.json → id must be "Team-SIN-X")
 *   2. Every `agents[*].id` refers to a live (non-archived) repo in
 *      OpenSIN-AI/. Uses `gh` CLI. Skipped gracefully if gh is unavailable.
 *
 * Exit code 0 = all valid, 1 = at least one failure.
 */

import fs from "node:fs"
import path from "node:path"
import { execSync } from "node:child_process"

const SCHEMA_PATH = path.join("schemas", "team.schema.json")
const TEAMS_DIR = path.join("templates", "teams")
const ORG = "OpenSIN-AI"

function typeOf(v) {
  if (v === null) return "null"
  if (Array.isArray(v)) return "array"
  return typeof v
}

function validateAgainst(value, sub, pathStr, errs) {
  if (!sub) return
  if (sub.type && typeOf(value) !== sub.type) {
    errs.push(`${pathStr}: expected ${sub.type}, got ${typeOf(value)}`)
    return
  }
  if (sub.type === "object") {
    for (const req of sub.required || []) {
      if (!(req in (value || {}))) errs.push(`${pathStr}: missing required "${req}"`)
    }
    if (sub.additionalProperties === false) {
      for (const k of Object.keys(value || {})) {
        if (!(k in (sub.properties || {}))) errs.push(`${pathStr}: unexpected property "${k}"`)
      }
    }
    for (const [k, propSchema] of Object.entries(sub.properties || {})) {
      if (value && k in value) validateAgainst(value[k], propSchema, `${pathStr}.${k}`, errs)
    }
  } else if (sub.type === "array") {
    if (typeof sub.minItems === "number" && value.length < sub.minItems)
      errs.push(`${pathStr}: minItems ${sub.minItems}, got ${value.length}`)
    if (typeof sub.maxItems === "number" && value.length > sub.maxItems)
      errs.push(`${pathStr}: maxItems ${sub.maxItems}, got ${value.length}`)
    if (sub.items) value.forEach((item, i) => validateAgainst(item, sub.items, `${pathStr}[${i}]`, errs))
  } else if (sub.type === "string") {
    if (typeof sub.minLength === "number" && value.length < sub.minLength)
      errs.push(`${pathStr}: minLength ${sub.minLength}, got ${value.length}`)
    if (typeof sub.maxLength === "number" && value.length > sub.maxLength)
      errs.push(`${pathStr}: maxLength ${sub.maxLength}, got ${value.length}`)
    if (sub.pattern && !new RegExp(sub.pattern).test(value))
      errs.push(`${pathStr}: does not match pattern ${sub.pattern}`)
    if (sub.enum && !sub.enum.includes(value))
      errs.push(`${pathStr}: "${value}" not in enum ${JSON.stringify(sub.enum)}`)
    if (sub.const !== undefined && value !== sub.const)
      errs.push(`${pathStr}: expected const "${sub.const}", got "${value}"`)
  } else if (sub.type === "number") {
    if (typeof sub.minimum === "number" && value < sub.minimum)
      errs.push(`${pathStr}: minimum ${sub.minimum}, got ${value}`)
    if (typeof sub.maximum === "number" && value > sub.maximum)
      errs.push(`${pathStr}: maximum ${sub.maximum}, got ${value}`)
  }
}

function loadRepoCatalog() {
  try {
    const raw = execSync(`gh repo list ${ORG} --limit 400 --json name,isArchived`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    })
    const all = JSON.parse(raw)
    return {
      available: true,
      known: new Set(all.map((r) => r.name)),
      archived: new Set(all.filter((r) => r.isArchived).map((r) => r.name)),
    }
  } catch (err) {
    return { available: false, reason: err.message, known: new Set(), archived: new Set() }
  }
}

function main() {
  if (!fs.existsSync(SCHEMA_PATH)) {
    console.error(`[manifests] FAIL — schema missing at ${SCHEMA_PATH}`)
    process.exit(1)
  }
  const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, "utf8"))
  if (!fs.existsSync(TEAMS_DIR)) {
    console.log("[manifests] no templates/teams/ directory — nothing to validate")
    process.exit(0)
  }

  const files = fs.readdirSync(TEAMS_DIR).filter((f) => f.endsWith(".json"))
  if (files.length === 0) {
    console.log("[manifests] no Team-SIN-*.json files found — nothing to validate")
    process.exit(0)
  }

  const repos = loadRepoCatalog()
  if (!repos.available) {
    console.warn(`[manifests] warn — gh CLI unavailable; skipping cross-repo checks (${repos.reason?.slice(0, 120) || "no reason"})`)
  }

  let failed = 0
  for (const f of files) {
    const fullPath = path.join(TEAMS_DIR, f)
    const errs = []
    let doc
    try {
      doc = JSON.parse(fs.readFileSync(fullPath, "utf8"))
    } catch (err) {
      failed++
      console.error(`\n[INVALID] ${f}: invalid JSON — ${err.message}`)
      continue
    }

    validateAgainst(doc, schema, f, errs)

    // Cross-check 1: id must match filename.
    const base = path.basename(f, ".json")
    if (doc.id && doc.id !== base) {
      errs.push(`${f}.id: "${doc.id}" does not match filename "${base}"`)
    }

    // Cross-check 2: every agent id refers to a known, non-archived repo.
    if (repos.available && Array.isArray(doc.agents)) {
      for (let i = 0; i < doc.agents.length; i++) {
        const a = doc.agents[i]
        if (!a?.id) continue
        if (!repos.known.has(a.id)) {
          errs.push(`${f}.agents[${i}].id: "${a.id}" does not exist in ${ORG}/`)
        } else if (repos.archived.has(a.id)) {
          errs.push(`${f}.agents[${i}].id: "${a.id}" is archived — remove from manifest or unarchive repo`)
        }
      }
    }

    if (errs.length) {
      failed++
      console.error(`\n[INVALID] ${f}`)
      errs.forEach((e) => console.error(`  - ${e}`))
    } else {
      console.log(`[ok] ${f}`)
    }
  }

  console.log(`\n${files.length} file(s), ${files.length - failed} valid, ${failed} invalid`)
  process.exit(failed ? 1 : 0)
}

main()
