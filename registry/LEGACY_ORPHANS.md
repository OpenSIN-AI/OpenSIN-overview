# 🗑️ Legacy & Technical Debt

These repositories violate the `[Type]-SIN-[Name]` mandate and exist in parallel universes. They are scheduled for migration or deletion.

### The "OpenSIN-Security-*" Anomaly
14 repositories (e.g., `OpenSIN-Security-Web`, `OpenSIN-Security-Cloud`) exist without a `Team-SIN-` or `A2A-SIN-` structure.
**Action:** Migrate to `A2A-SIN-CyberSec-*` and assign to `Team-SIN-CyberSec`.

### The "OpenSIN-Apple-*" Anomaly
12 repositories (e.g., `OpenSIN-Apple-Notes`, `OpenSIN-Apple-Mail`).
**Action:** Migrate to `A2A-SIN-Apple-*` and assign to `Team-SIN-Messaging` or a new `Team-SIN-Ecosystem`.

### The Parallel Clones
- `OpenSIN-BugBounty` (Conflict with `A2A-SIN-BugBounty`)
- `OpenSIN-Server` (Conflict with `A2A-SIN-Server`)
- `OpenSIN-Terminal` (Conflict with `A2A-SIN-Terminal`)
**Action:** Extract code into the `A2A-SIN-*` version and delete the `OpenSIN-*` variant.
