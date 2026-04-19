#!/usr/bin/env bash
# prelaunch-sweep.sh — run ALL go/no-go checks in one shot.
#
# This is the "am I allowed to launch today?" script. It runs:
#   1. Secret scan                (no live API keys, no internal IPs)
#   2. Governance invariants      (link-check, team-manifest schema)
#   3. Workforce drift            (WORKFORCE.md vs templates/teams/*.json)
#   4. Registry freshness         (regenerate, ensure no diff)
#   5. Aggregator determinism     (oh-my-sin.json rebuilds byte-identical)
#   6. HF Spaces probe            (G7 / HF-1)
#   7. Web surface probe          (G1–G4)
#   8. Live launch-status script  (all 10 gates)
#
# Use before every launch-week morning standup. Fail-fast unless --continue.
#
# Usage:
#   bash scripts/prelaunch-sweep.sh                # fail-fast, pretty
#   bash scripts/prelaunch-sweep.sh --continue     # run all steps, report at end
#   bash scripts/prelaunch-sweep.sh --ci           # non-interactive, no TTY colours
#   bash scripts/prelaunch-sweep.sh --skip-remote  # no network probes (HF + web)
#
# Exit code 0 if all green. 1 if any gate fails. 2 on usage error.

set -o pipefail

CONTINUE=0
CI=0
SKIP_REMOTE=0
for arg in "$@"; do
  case "$arg" in
    --continue)             CONTINUE=1 ;;
    --ci)                   CI=1 ;;
    --skip-remote|--offline) SKIP_REMOTE=1 ;;
    -h|--help)              sed -n '2,19p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "unknown flag: $arg" >&2; exit 2 ;;
  esac
done

if [[ "$CI" -eq 0 && -t 1 ]]; then
  C_OK=$'\033[32m'; C_ERR=$'\033[31m'; C_WARN=$'\033[33m'; C_B=$'\033[1m'; C_R=$'\033[0m'
else
  C_OK=""; C_ERR=""; C_WARN=""; C_B=""; C_R=""
fi

cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

declare -a FAILED=()
STEP_NUM=0

step() {
  local title="$1"; shift
  STEP_NUM=$((STEP_NUM+1))
  printf '\n%b[step %d] %s%b\n' "$C_B" "$STEP_NUM" "$title" "$C_R"
  local start end elapsed
  start=$(date +%s)
  if "$@"; then
    end=$(date +%s); elapsed=$((end-start))
    printf '  %bPASS%b (%ss)\n' "$C_OK" "$C_R" "$elapsed"
    return 0
  else
    end=$(date +%s); elapsed=$((end-start))
    printf '  %bFAIL%b (%ss)\n' "$C_ERR" "$C_R" "$elapsed"
    FAILED+=("$title")
    if [[ "$CONTINUE" -eq 0 ]]; then
      print_summary
      exit 1
    fi
    return 1
  fi
}

check_secret_scan() {
  bash scripts/scan-secrets.sh
}

check_link_validator() {
  node scripts/validate-links.js
}

check_manifest_validator() {
  node scripts/validate-team-manifests.js
}

check_workforce_drift() {
  node scripts/check-workforce.js --quiet
}

check_registry_fresh() {
  # Regenerate registry and check diff is empty. Non-fatal if gh CLI is missing.
  if ! command -v gh >/dev/null 2>&1; then
    printf '  %bskip%b: gh CLI not available — registry freshness cannot be checked locally\n' "$C_WARN" "$C_R"
    return 0
  fi
  local before after
  before=$(git status --porcelain -- registry/ || true)
  node scripts/generate-master-index.js >/dev/null
  node scripts/audit-repos.js >/dev/null
  after=$(git status --porcelain -- registry/ || true)
  if [[ "$before" != "$after" ]]; then
    printf '  %bregistry drifted%b — commit the changes:\n' "$C_WARN" "$C_R"
    git --no-pager diff --stat -- registry/
    return 1
  fi
  return 0
}

check_aggregator_deterministic() {
  # Rebuild oh-my-sin.json, strip volatile generated_at, diff vs committed.
  node scripts/build-oh-my-sin.js >/dev/null
  if git diff --quiet -- templates/oh-my-sin.json; then
    return 0
  fi
  # Allow only the generated_at field to change — anything else means drift.
  local drift
  drift=$(git --no-pager diff --unified=0 -- templates/oh-my-sin.json \
    | grep -E '^[-+]' \
    | grep -vE '^(---|\+\+\+|[-+]\s*"generated_at":)' || true)
  if [[ -z "$drift" ]]; then
    git checkout -- templates/oh-my-sin.json
    return 0
  fi
  printf '  %baggregator drift detected%b — commit the regenerated file:\n' "$C_WARN" "$C_R"
  git --no-pager diff -- templates/oh-my-sin.json | head -50
  return 1
}

check_hf_spaces() {
  if [[ "$SKIP_REMOTE" -eq 1 ]]; then
    printf '  %bskip%b: --skip-remote set\n' "$C_WARN" "$C_R"
    return 0
  fi
  bash scripts/check-hf-spaces.sh --quiet
}

check_web_surfaces() {
  if [[ "$SKIP_REMOTE" -eq 1 ]]; then
    printf '  %bskip%b: --skip-remote set\n' "$C_WARN" "$C_R"
    return 0
  fi
  bash scripts/check-web-surfaces.sh
}

check_launch_status() {
  if ! command -v gh >/dev/null 2>&1; then
    printf '  %bskip%b: gh CLI not available — launch-status cannot verify canonical repos\n' "$C_WARN" "$C_R"
    return 0
  fi
  node scripts/launch-status.js
}

print_summary() {
  printf '\n%b========= prelaunch-sweep summary =========%b\n' "$C_B" "$C_R"
  if [[ ${#FAILED[@]} -eq 0 ]]; then
    printf '%ball gates green%b\n\n' "$C_OK" "$C_R"
  else
    printf '%b%d gate(s) failed%b:\n' "$C_ERR" "${#FAILED[@]}" "$C_R"
    for f in "${FAILED[@]}"; do printf '  - %s\n' "$f"; done
    printf '\nFix each failure before merging launch-critical PRs.\n\n'
  fi
}

step "security: scan-secrets (regex catalogue)"   check_secret_scan
step "governance: markdown internal links"        check_link_validator
step "governance: team manifests vs schema"       check_manifest_validator
step "governance: workforce drift"                check_workforce_drift
step "registry: MASTER_INDEX + SCAFFOLD_AUDIT"    check_registry_fresh
step "aggregator: oh-my-sin.json deterministic"   check_aggregator_deterministic
step "G7 / HF-1: HuggingFace Spaces"              check_hf_spaces
step "G1-G4: public web surfaces"                 check_web_surfaces
step "live: scripts/launch-status.js"             check_launch_status

print_summary
exit $(( ${#FAILED[@]} == 0 ? 0 : 1 ))
