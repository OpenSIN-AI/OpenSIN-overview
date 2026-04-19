#!/usr/bin/env node
// check-workforce.js — fail if WORKFORCE.md drifts from the manifest data.
//
// Recomputes the per-team and total worker counts from templates/teams/*.json
// and asserts that WORKFORCE.md matches. Single source of truth = the manifests.
//
// Usage:
//   node scripts/check-workforce.js          # human-readable summary, exit 1 on drift
//   node scripts/check-workforce.js --json   # JSON output, exit 1 on drift
//   node scripts/check-workforce.js --quiet  # silent unless drift, exit 1 on drift
//
// Why this exists: a previous version of WORKFORCE.md claimed 149 workers and
// inflated almost every per-team count. The drift was invisible because nothing
// recomputed it. This script makes that class of bug shallow.

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const TEAMS_DIR = path.join(ROOT, 'templates/teams');
const WORKFORCE_MD = path.join(ROOT, 'WORKFORCE.md');

const args = new Set(process.argv.slice(2));
const asJson = args.has('--json');
const quiet = args.has('--quiet');

function loadManifests() {
  const out = [];
  for (const f of fs.readdirSync(TEAMS_DIR).filter((x) => x.endsWith('.json')).sort()) {
    const raw = fs.readFileSync(path.join(TEAMS_DIR, f), 'utf8');
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      throw new Error(`invalid JSON in templates/teams/${f}: ${e.message}`);
    }
    const agents = parsed.agents || parsed.workers || [];
    out.push({
      file: f,
      id: parsed.id || f.replace(/\.json$/, ''),
      name: parsed.name || parsed.id,
      count: agents.length,
    });
  }
  return out;
}

function parseClaimedTotalFromMd(md) {
  // Look for "**Total** | **<n>** |" in the per-team table.
  const m = md.match(/\*\*Total\*\*\s*\|\s*\*\*(\d+)\*\*/);
  return m ? Number(m[1]) : null;
}

function parseClaimedHeaderTotal(md) {
  // Look for "89 registered agent workers" or similar in the doc header.
  const m = md.match(/(\d+)\s+registered\s+(?:agent\s+)?workers?/i);
  return m ? Number(m[1]) : null;
}

function main() {
  const teams = loadManifests();
  const realTotal = teams.reduce((s, t) => s + t.count, 0);

  let claimedTableTotal = null;
  let claimedHeaderTotal = null;
  if (fs.existsSync(WORKFORCE_MD)) {
    const md = fs.readFileSync(WORKFORCE_MD, 'utf8');
    claimedTableTotal = parseClaimedTotalFromMd(md);
    claimedHeaderTotal = parseClaimedHeaderTotal(md);
  }

  const drift = [];
  if (claimedTableTotal !== null && claimedTableTotal !== realTotal) {
    drift.push(
      `WORKFORCE.md per-team table claims total=${claimedTableTotal}, real=${realTotal}`,
    );
  }
  if (claimedHeaderTotal !== null && claimedHeaderTotal !== realTotal) {
    drift.push(
      `WORKFORCE.md header claims "${claimedHeaderTotal} registered workers", real=${realTotal}`,
    );
  }

  const result = {
    teams,
    real_total: realTotal,
    claimed_table_total: claimedTableTotal,
    claimed_header_total: claimedHeaderTotal,
    drift,
    ok: drift.length === 0,
  };

  if (asJson) {
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  } else if (!quiet || !result.ok) {
    if (!quiet) {
      console.log('Team manifests → workers:');
      for (const t of teams) {
        console.log(`  ${t.id.padEnd(28)} ${String(t.count).padStart(3)}`);
      }
      console.log(`  ${'TOTAL'.padEnd(28)} ${String(realTotal).padStart(3)}`);
      console.log('');
    }
    if (drift.length === 0) {
      if (!quiet) console.log('OK — WORKFORCE.md matches the manifests.');
    } else {
      console.error('DRIFT detected:');
      for (const d of drift) console.error(`  - ${d}`);
      console.error('');
      console.error('Fix WORKFORCE.md so its counts match the manifests, OR update the manifests.');
      console.error('Do NOT silence this check.');
    }
  }

  process.exit(result.ok ? 0 : 1);
}

main();
