#!/usr/bin/env bash
# Install proposed workflows into .github/workflows/
#
# Why this script exists: the GitHub App token used by the v0 bot does not have
# the `workflows` scope, so it cannot push files into `.github/workflows/`.
# These files are therefore staged here and must be installed by a human with
# repo admin / workflows permission.
#
# Run from the repository root:
#   bash governance/workflows-proposed/install.sh
#
# Then review the diff, commit, and push:
#   git add .github/workflows/
#   git commit -m "chore(ci): install governance workflows from proposal"
#   git push
set -euo pipefail

cd "$(dirname "$0")/../.."

mkdir -p .github/workflows

for f in governance/workflows-proposed/*.yml; do
  name=$(basename "$f")
  # Skip any template-like files if they land here accidentally
  case "$name" in
    install.sh|README.md) continue ;;
  esac
  target=".github/workflows/$name"
  if [ -e "$target" ]; then
    echo "skip (already installed): $target"
  else
    cp "$f" "$target"
    echo "installed: $target"
  fi
done

echo
echo "Next steps:"
echo "  1. Review the diff:   git diff --stat .github/workflows/"
echo "  2. Commit:            git add .github/workflows/ && git commit -m 'chore(ci): install governance workflows'"
echo "  3. Push:              git push"
echo "  4. Verify on GitHub:  Actions tab shows the 6 new workflows."
