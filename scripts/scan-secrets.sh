#!/usr/bin/env bash
# scan-secrets.sh — refuse to commit live secrets, API keys, or internal IPs.
#
# Usage:
#   bash scripts/scan-secrets.sh                # scan whole tracked tree, exit 1 on hit
#   bash scripts/scan-secrets.sh --staged       # scan only files staged for commit (pre-commit hook mode)
#   bash scripts/scan-secrets.sh --json         # machine-readable
#
# What we look for (regex catalogue):
#   * n8n API keys                       n8n_api_[a-f0-9]{30,}
#   * GitHub PATs                        ghp_[A-Za-z0-9]{30,}, gho_[A-Za-z0-9]{30,}, ghs_[A-Za-z0-9]{30,}
#   * GitHub fine-grained tokens         github_pat_[A-Za-z0-9_]{50,}
#   * HuggingFace tokens                 hf_[A-Za-z0-9]{30,}
#   * OpenAI keys                        sk-[A-Za-z0-9]{30,}
#   * Anthropic keys                     sk-ant-[A-Za-z0-9-]{30,}
#   * Stripe live secrets                sk_live_[A-Za-z0-9]{20,}
#   * Stripe restricted live             rk_live_[A-Za-z0-9]{20,}
#   * Google API keys                    AIza[0-9A-Za-z_-]{30,}
#   * AWS access keys                    AKIA[0-9A-Z]{16}
#   * Slack tokens                       xox[abprs]-[A-Za-z0-9-]{10,}
#   * Generic JWT-like                   eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}
#   * Internal OCI VM IP (any usage)     92\.5\.60\.87
#   * Internal Docker bridge             172\.18\.0\.1
#   * Private SSH commands               ssh ubuntu@(?!\$|<)            (literal user, not env-var)
#
# Allow-list (intentional public references):
#   * scripts/scan-secrets.sh           contains the patterns themselves
#   * SECURITY.md                       may quote example tokens for "what to look for"
#   * .husky/pre-commit                 references scan-secrets.sh by path
#   * CHANGELOG.md                      documents removed leaks (meta-bug: logging a
#                                       removal re-leaks the value). Exact-match.
#   * docs/REALITY-CHECK-*.md           audit trail; may reference historical tokens/IPs
#                                       that were since rotated. Prefix match.
#
# NOT allow-listed: docs/best-practices/ci-cd-n8n.md, docs/03_ops/inbound-intake.md,
# .pcpm/rules.md — these reference values by env-var name ONLY (no literals).

set -uo pipefail

MODE="all"
JSON=0
for arg in "$@"; do
  case "$arg" in
    --staged) MODE="staged" ;;
    --json)   JSON=1 ;;
    -h|--help)
      sed -n '2,32p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *)
      echo "unknown flag: $arg" >&2
      exit 2
      ;;
  esac
done

# Allow-listed paths (relative to repo root). Exact-match or glob via case.
ALLOWLIST=(
  "scripts/scan-secrets.sh"
  "SECURITY.md"
  ".husky/pre-commit"
  "CHANGELOG.md"
)

# Path prefixes: any file whose relative path starts with one of these is allowlisted.
# Used for versioned audit trails where old token/IP values intentionally appear.
ALLOWLIST_PREFIX=(
  "docs/REALITY-CHECK-"
)

is_allowlisted() {
  local f="$1"
  for a in "${ALLOWLIST[@]}"; do
    [[ "$f" == "$a" ]] && return 0
  done
  for p in "${ALLOWLIST_PREFIX[@]}"; do
    [[ "$f" == "$p"* ]] && return 0
  done
  return 1
}

# Collect file list
if [[ "$MODE" == "staged" ]]; then
  mapfile -t FILES < <(git diff --cached --name-only --diff-filter=ACMR | grep -vE '^(node_modules/|\.git/)' || true)
else
  mapfile -t FILES < <(git ls-files | grep -vE '^(node_modules/|\.git/)' || true)
fi

if [[ ${#FILES[@]} -eq 0 ]]; then
  if [[ $JSON -eq 1 ]]; then echo '{"hits":[],"ok":true}'; else echo "no files to scan"; fi
  exit 0
fi

# Single combined regex (PCRE via grep -P would be cleaner, but BSD grep on macOS
# doesn't support -P. ERE works for everything we need.)
PATTERNS=(
  'n8n_api_[a-f0-9]{30,}'
  'ghp_[A-Za-z0-9]{30,}'
  'gho_[A-Za-z0-9]{30,}'
  'ghs_[A-Za-z0-9]{30,}'
  'github_pat_[A-Za-z0-9_]{50,}'
  'hf_[A-Za-z0-9]{30,}'
  'sk-[A-Za-z0-9]{30,}'
  'sk-ant-[A-Za-z0-9-]{30,}'
  'sk_live_[A-Za-z0-9]{20,}'
  'rk_live_[A-Za-z0-9]{20,}'
  'AIza[0-9A-Za-z_-]{30,}'
  'AKIA[0-9A-Z]{16}'
  'xox[abprs]-[A-Za-z0-9-]{10,}'
  'eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}'
  '92\.5\.60\.87'
  '172\.18\.0\.1'
)
JOINED=$(IFS='|'; echo "${PATTERNS[*]}")

HITS_JSON='[]'
HIT_COUNT=0

for f in "${FILES[@]}"; do
  [[ -f "$f" ]] || continue
  is_allowlisted "$f" && continue
  # Skip binary
  if file --mime "$f" 2>/dev/null | grep -q 'charset=binary'; then continue; fi
  while IFS= read -r line; do
    [[ -z "$line" ]] && continue
    HIT_COUNT=$((HIT_COUNT + 1))
    lineno="${line%%:*}"
    text="${line#*:}"
    if [[ $JSON -eq 1 ]]; then
      HITS_JSON=$(printf '%s' "$HITS_JSON" | python3 -c "
import json,sys
arr=json.load(sys.stdin)
arr.append({'file':'$f','line':int('$lineno'),'match':'''$text'''.strip()[:160]})
print(json.dumps(arr))
")
    else
      printf '\033[31mLEAK\033[0m  %s:%s\n        %s\n' "$f" "$lineno" "$text"
    fi
  done < <(grep -nE "$JOINED" "$f" 2>/dev/null || true)
done

if [[ $JSON -eq 1 ]]; then
  printf '{"hits":%s,"ok":%s}\n' "$HITS_JSON" "$([ $HIT_COUNT -eq 0 ] && echo true || echo false)"
fi

if [[ $HIT_COUNT -eq 0 ]]; then
  [[ $JSON -eq 0 ]] && echo "scan-secrets: CLEAN — ${#FILES[@]} file(s) checked"
  exit 0
fi

if [[ $JSON -eq 0 ]]; then
  echo
  echo "scan-secrets: $HIT_COUNT potential leak(s) found." >&2
  echo "  - Rotate the secret immediately if it is real." >&2
  echo "  - Move the value to Infra-SIN-Dev-Setup (private) and reference it by env-var name." >&2
  echo "  - If this is a false positive, add the file path to the ALLOWLIST in scripts/scan-secrets.sh." >&2
fi
exit 1
