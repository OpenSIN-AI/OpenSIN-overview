#!/usr/bin/env node
/**
 * Validate every templates/teams/*.json against schemas/team.schema.json.
 *
 * Zero dependencies on purpose: uses a tiny hand-rolled validator that
 * understands just the subset of JSON Schema 2020-12 this schema uses.
 *
 * Exit code 0 = all valid, 1 = at least one failure.
 */

import fs from "node:fs"
import path from "node:path"

const schema = JSON.parse(fs.readFileSync("schemas/team.schema.json", "utf8"))
const dir = "templates/teams"

function typeOf(v) {
  if (v === null) return "null"
  if (Array.isArray(v)) return "array"
  return typeof v
}

function validate(value, sub, pathStr, errs) {
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
      if (value && k in value) validate(value[k], propSchema, `${pathStr}.${k}`, errs)
    }
  } else if (sub.type === "array") {
    if (typeof sub.minItems === "number" && value.length < sub.minItems)
      errs.push(`${pathStr}: minItems ${sub.minItems}, got ${value.length}`)
    if (typeof sub.maxItems === "number" && value.length > sub.maxItems)
      errs.push(`${pathStr}: maxItems ${sub.maxItems}, got ${value.length}`)
    if (sub.items) value.forEach((item, i) => validate(item, sub.items, `${pathStr}[${i}]`, errs))
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

let total = 0
let failed = 0
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json"))) {
  total++
  const doc = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"))
  const errs = []
  validate(doc, schema, f, errs)
  if (errs.length) {
    failed++
    console.error(`\n[INVALID] ${f}`)
    errs.forEach((e) => console.error(`  - ${e}`))
  } else {
    console.log(`[ok] ${f}`)
  }
}
console.log(`\n${total} file(s), ${total - failed} valid, ${failed} invalid`)
process.exit(failed ? 1 : 0)
