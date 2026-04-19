#!/usr/bin/env bash
# check-hf-spaces.sh — Gate G7 probe from LAUNCH-CHECKLIST.md § Tag 1 (HF-1).
#
# Probes the 6 A2A-SIN-Code-* HuggingFace Spaces that host the coding-fleet
# runtime. Any 5xx or connection failure means chat.opensin.ai cannot dispatch
# coding tasks → launch blocker.
#
# Usage:
#   bash scripts/check-hf-spaces.sh              # pretty output, exits 0/1
#   bash scripts/check-hf-spaces.sh --json       # machine-readable
#   bash scripts/check-hf-spaces.sh --quiet      # one line per space, minimal
#   HF_SPACES_TIMEOUT=20 bash scripts/check-hf-spaces.sh  # override timeout
#
# Exit codes:
#   0 = all 6 Spaces returned <500
#   1 = at least one Space is 5xx / dead
#   2 = bad invocation (unknown flag)
#
# Zero dependencies beyond curl. Works in CI, local dev, and the launch-week
# runbook (`docs/T-0-RUNBOOK.md`).

set -o pipefail

SPACES=(
  a2a-sin-code-plugin
  a2a-sin-code-command
  a2a-sin-code-tool
  a2a-sin-code-backend
  a2a-sin-code-fullstack
  a2a-sin-code-frontend
)

TIMEOUT="${HF_SPACES_TIMEOUT:-15}"
MODE="pretty"

for arg in "$@"; do
  case "$arg" in
    --json)  MODE="json" ;;
    --quiet) MODE="quiet" ;;
    -h|--help)
      sed -n '2,22p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *)
      echo "unknown flag: $arg" >&2
      exit 2
      ;;
  esac
done

# Colours only when stdout is a TTY and mode is pretty.
if [[ "$MODE" == "pretty" && -t 1 ]]; then
  C_OK=$'\033[32m'; C_WARN=$'\033[33m'; C_ERR=$'\033[31m'; C_DIM=$'\033[2m'; C_R=$'\033[0m'
else
  C_OK=""; C_WARN=""; C_ERR=""; C_DIM=""; C_R=""
fi

probe() {
  local space="$1"
  local url="https://opensin-ai-${space}.hf.space/"
  # --max-time includes DNS + TLS + total transfer
  local code
  code=$(curl -o /dev/null -s -w '%{http_code}' --max-time "$TIMEOUT" -L "$url" 2>/dev/null || echo "000")
  printf '%s\n' "$code"
}

results=()
fails=0

if [[ "$MODE" == "pretty" ]]; then
  printf '\nHuggingFace Spaces probe (timeout=%ss)\n' "$TIMEOUT"
  printf -- '%.s-' {1..60}; printf '\n'
fi

for s in "${SPACES[@]}"; do
  code=$(probe "$s")
  state="ok"
  colour="$C_OK"
  if [[ "$code" == "000" ]]; then
    state="dead"; colour="$C_ERR"; fails=$((fails+1))
  elif [[ "$code" -ge 500 ]]; then
    state="5xx"; colour="$C_ERR"; fails=$((fails+1))
  elif [[ "$code" -ge 400 ]]; then
    state="4xx"; colour="$C_WARN"
  fi
  results+=("$(printf '{"space":"%s","code":"%s","state":"%s"}' "$s" "$code" "$state")")
  case "$MODE" in
    json)  ;;
    quiet) printf '%s %s %s\n' "$s" "$code" "$state" ;;
    *)
      printf '  %b%-30s%b  HTTP %s  %s\n' "$colour" "$s" "$C_R" "$code" "$state"
      ;;
  esac
done

if [[ "$MODE" == "json" ]]; then
  # naive JSON array join — safe because values above are strings/numbers only
  printf '{"generated_at":"%s","timeout_s":%s,"fails":%d,"results":[' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$TIMEOUT" "$fails"
  first=1
  for r in "${results[@]}"; do
    if [[ $first -eq 1 ]]; then first=0; else printf ','; fi
    printf '%s' "$r"
  done
  printf ']}\n'
elif [[ "$MODE" == "pretty" ]]; then
  printf -- '%.s-' {1..60}; printf '\n'
  if [[ $fails -eq 0 ]]; then
    printf '%b%d/%d Spaces healthy%b\n\n' "$C_OK" "${#SPACES[@]}" "${#SPACES[@]}" "$C_R"
  else
    printf '%b%d/%d Spaces DEAD/5xx%b — see LAUNCH-CHECKLIST §Tag 1 HF-1\n' "$C_ERR" "$fails" "${#SPACES[@]}" "$C_R"
    printf '%b  → remediation: restart via HF API or enable templates/workflows/hf-keep-alive.yml%b\n\n' "$C_DIM" "$C_R"
  fi
fi

exit $(( fails == 0 ? 0 : 1 ))
