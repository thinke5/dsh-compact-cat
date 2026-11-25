# 实施记录

只记录长期有效的结论：架构决策与理由、踩过的坑、门禁结果。逐日流水与已过时的过程记录不写在这里。

## 架构

- 骨架阶段不做任何自定义压缩：引擎直接继承宿主 `@deepseek-ai/dsh-compaction-basic`，压缩行为与宿主原版一致；引擎缺失或构造失败时回退原版压缩。
- 上游依赖只允许出现在 `src/host/adapter.ts`（`STOCK_ENGINE`、`loadCompactionBasic`、`loadSchema`）；`src/host/entry.ts` 只做配置解析与装配，其余模块不得直接 import `@deepseek-ai/*`。
- 插件自有配置键（`takeoverPresets`、`inspectorEnabled`）集中在 `src/config`，进入引擎前由 `hostConfig` 剥离，宿主引擎不会看到未知键。
- 客户端只注册一个占位侧栏 tab；宿主在运行时通过 `__ModuleLoader__` 提供 React 18.3.1 与 `dsh-client-ui-primitives`，插件产物不得内联第二份 React。
- `package.json` 脚本必须写 `vp <cmd>`，不能写 `vpr <cmd>`：`vpr` 等价于 `vp run`（`node_modules/vite-plus/dist/bin.js:1887` 按 argv0 补 `run`），而 `vp run <name>` 执行的就是 `package.json` 里的同名脚本，脚本内再写 `vpr <name>` 构成自我引用；task runner 检测到后直接跳过并以 0 退出，导致 `pnpm test` / `pnpm lint` 假绿。`vp <cmd>` 触发的那条 "you are running as a built-in command" 提示无害，可以忽略。
- 不设单文件行数上限：原先的 400 行守卫（`scripts/size-check.ts` + `pnpm check:size`）已移除。理由是横向树形视图这类组件天然需要较多渲染分支，用行数硬切只会逼出无意义的拆文件；模块边界按职责划分，不按体积划分。
- 2026-11-25 曾清空全部旧实现（含 21 条提交）并从单一根提交重建历史；旧实现已不存在，无需在本文档中保留其细节。

## 环境

- 测试 API 必须从 `vite-plus/test` 导入：仓库未直接安装 `vitest`，`"vitest"` 与 `"vp/test"` 都无法解析。
- 日常验证走 npm scripts（`pnpm test` / `pnpm lint` / `pnpm build` / `pnpm check`），不要把 `vp` / `vpr` / `./node_modules/.bin/*` 当成日常入口写进文档或汇报。
- 非 TTY 下 `pnpm check` / `pnpm exec` / `pnpm test <file>` 会触发 pnpm 的依赖状态自检，报 `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`（lockfile 与 node_modules 失步）。这是唯一的退化场景：此时逐项执行 `./node_modules/.bin/{vp,tsc,tsx}`，并在结论里说明原因。
- `.npmrc` 把 store 与 cache 指向仓库内的 `.cache/`，删掉后下一次 `pnpm install` 会重建。

## 门禁

最近一次实测（2026-11-25）：

| 项目     | 命令             | 结果                   |
| -------- | ---------------- | ---------------------- |
| 类型     | `pnpm typecheck` | 通过                   |
| 静态检查 | `pnpm lint`      | 14 文件，0 警告 0 错误 |
| 测试     | `pnpm test`      | 2 文件 5 项通过        |
| 构建     | `pnpm build`     | 宿主 + 客户端构建成功  |
