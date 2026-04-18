# OpenSIN-overview Boundary Role Rules

## One-line rule
`OpenSIN-overview` maps ownership. It does not replace owning repos.

## If the change...
- clarifies who owns what -> `OpenSIN-overview`
- changes runtime behavior -> `OpenSIN`
- changes official docs body -> `OpenSIN-documentation`
- changes OpenCode config canon -> `upgraded-opencode-stack`
- changes product implementation -> product repo
- changes control-plane implementation -> control-plane repo

## Red flags
- overview starts carrying detailed implementation canon
- overview restates large docs sections already owned elsewhere
- overview describes product or control-plane behavior more authoritatively than the owning repo
