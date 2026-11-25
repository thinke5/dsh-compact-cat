# Compact Cat engineering

- Source and tests are TypeScript. Use `pnpm test` (`vp test`), `pnpm lint` (`vp lint`, type-aware), `pnpm build` (`vp pack`, tsdown). Unified configuration lives in `vite.config.ts`.
- Preserve original Live Compact safety contracts: immutable cached prefix, most recent checkpoint floor, genuine user boundary, balanced tool pairs, verified raw backup before pruning or cutting, complete failure diagnostics, fail closed on disk/ACL errors before small cuts and pruning; stock official summary keeps its original best-effort backup behavior.
- Default settings preserve v1.1.12 behavior. New policy belongs in `src/config`; no per-process environment mutation for engine preferences.
- `spine-checkpoint` and shadow layout stay compatible. External plugins must not call the experimental session-record writer. Inspector metadata belongs in the existing protected decision sidecar; never interrupt adjacency between `compaction/summary` and the replacement message.
- Client uses host-provided React and UI primitives; never bundle a second host runtime. Use optional capability injection and lifecycle disposers for settings/sidebar/routes. Only fetch original text on demand; render it as text, not HTML.
- Prefer <350 lines per source module and hard ceiling 400 except documented generated embedded ACL scripts.
- First make behavior work with a failing test, then improve types/structure, then verify the built package. Separate concurrent writes by explicit task scopes.
- Do not start a replacement DSH server or restart the current-session host for verification. User profile edits or local install outside workspace require approval.
- Reference clones and intermediate files are ignored under .ref/.tmp, never distributed. Record decisions and actual gates in WORK_LOG.md.
- commit 、注释等说明文本优先使用简体中文
