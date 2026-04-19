#!/usr/bin/env bash
# check-web-surfaces.sh — probes the 4 public launch surfaces:
#   Gate G1 — opensin.ai
#   Gate G2 — my.opensin.ai
#   Gate G3 — docs.opensin.ai
#   Gate G4 — chat.opensin.ai
#
# Checks: HTTP 200, TLS valid, HSTS header present, time-to-first-byte.
#
# Usage:
#   bash scripts/check-web-surfaces.sh
#   bash scripts/check-web-surfaces.sh --json
#
# Exit codes:
#   0 = all 4 surfaces 200 + TLS OK
#   1 = at least one surface is broken
#   2 = bad invocation
#
# Zero deps beyond curl + openssl.

set -o pipefail

SURFACES=(
  "opensin.ai|G1|OSS Marketing"
  "my.opensin.ai|G2|Paid + Marketplace"
  "docs.opensin.ai|G3|Docs"
  "chat.opensin.ai|G4|Authenticated App"
)

TIMEOUT="${WEB_TIMEOUT:-10}"
MODE="pretty"

for arg in "$@"; do
  case "$arg" in
    --json) MODE="json" ;;
    -h|--help) sed -n '2,19p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "unknown flag: $arg" >&2; exit 2 ;;
  esac
done

if [[ "$MODE" == "pretty" && -t 1 ]]; then
  C_OK=$'\033[32m'; C_WARN=$'\033[33m'; C_ERR=$'\033[31m'; C_DIM=$'\033[2m'; C_R=$'\033[0m'
else
  C_OK=""; C_WARN=""; C_ERR=""; C_DIM=""; C_R=""
fi

probe() {
  local host="$1"
  local url="https://${host}/"
  local out
  out=$(curl -o /dev/null -sS -w '%{http_code}|%{time_total}|%{time_starttransfer}' \
    --max-time "$TIMEOUT" -L "$url" 2>&1 || true)
  echo "$out"
}

has_hsts() {
  local host="$1"
  curl -sS -I --max-time "$TIMEOUT" "https://${host}/" 2>/dev/null \
    | grep -qi '^strict-transport-security:'
}

tls_days_left() {
  local host="$1"
  local end
  end=$(echo | openssl s_client -servername "$host" -connect "${host}:443" 2>/dev/null \
    | openssl x509 -noout -enddate 2>/dev/null \
    | sed -e 's/notAfter=//')
  [[ -z "$end" ]] && { echo "?"; return; }
  local end_s now_s
  # GNU date (Linux)
  end_s=$(date -u -d "$end" +%s 2>/dev/null || true)
  # BSD date fallback (macOS)
  [[ -z "$end_s" ]] && end_s=$(date -u -j -f "%b %e %H:%M:%S %Y %Z" "$end" +%s 2>/dev/null || true)
  [[ -z "$end_s" ]] && { echo "?"; return; }
  now_s=$(date -u +%s)
  echo $(( (end_s - now_s) / 86400 ))
}

results=()
fails=0

if [[ "$MODE" == "pretty" ]]; then
  printf '\nLaunch web surfaces (timeout=%ss)\n' "$TIMEOUT"
  printf -- '%.s-' {1..80}; printf '\n'
  printf '  %-22s %-4s  HTTP   TTFB   Total   HSTS  TLS-days  Role\n' "Host" "Gate"
  printf -- '%.s-' {1..80}; printf '\n'
fi

for row in "${SURFACES[@]}"; do
  IFS='|' read -r host gate role <<< "$row"
  result=$(probe "$host")
  code=$(echo "$result" | cut -d'|' -f1)
  total=$(echo "$result" | cut -d'|' -f2)
  ttfb=$(echo  "$result" | cut -d'|' -f3)
  hsts="no"; has_hsts "$host" && hsts="yes"
  days=$(tls_days_left "$host")

  state="ok"; colour="$C_OK"
  if [[ -z "$code" || "$code" == "000" || "$code" -ge 500 ]]; then
    state="down"; colour="$C_ERR"; fails=$((fails+1))
  elif [[ "$code" -ge 400 ]]; then
    state="4xx"; colour="$C_WARN"
  elif [[ "$hsts" != "yes" ]]; then
    state="no-hsts"; colour="$C_WARN"
  fi

  results+=("$(printf '{"host":"%s","gate":"%s","code":"%s","ttfb_s":"%s","total_s":"%s","hsts":"%s","tls_days_left":"%s","state":"%s"}' "$host" "$gate" "$code" "$ttfb" "$total" "$hsts" "$days" "$state")")

  if [[ "$MODE" == "pretty" ]]; then
    printf '  %b%-22s%b %-4s  %-4s   %-5s  %-5s   %-4s  %-8s  %s\n' \
      "$colour" "$host" "$C_R" "$gate" "$code" "$ttfb" "$total" "$hsts" "$days" "$role"
  fi
done

if [[ "$MODE" == "json" ]]; then
  printf '{"generated_at":"%s","fails":%d,"results":[' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$fails"
  first=1
  for r in "${results[@]}"; do
    if [[ $first -eq 1 ]]; then first=0; else printf ','; fi
    printf '%s' "$r"
  done
  printf ']}\n'
elif [[ "$MODE" == "pretty" ]]; then
  printf -- '%.s-' {1..80}; printf '\n'
  if [[ $fails -eq 0 ]]; then
    printf '%b%d/%d surfaces healthy%b\n\n' "$C_OK" "${#SURFACES[@]}" "${#SURFACES[@]}" "$C_R"
  else
    printf '%b%d/%d surfaces DOWN%b — see LAUNCH-CHECKLIST §0 Gates G1–G4\n\n' "$C_ERR" "$fails" "${#SURFACES[@]}" "$C_R"
  fi
fi

exit $(( fails == 0 ? 0 : 1 ))
