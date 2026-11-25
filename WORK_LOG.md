# 实施记录

只记录长期有效的结论：架构决策与理由、踩过的坑、门禁结果。逐日流水与已过时的过程记录不写在这里。

## 架构

- 骨架阶段不做任何自定义压缩：引擎直接继承宿主 `@deepseek-ai/dsh-compaction-basic`，压缩行为与宿主原版一致；引擎缺失或构造失败时回退原版压缩。
- 上游依赖只允许出现在 `src/host/adapter.ts`（`STOCK_ENGINE`、`loadCompactionBasic`、`loadSchema`）；`src/host/entry.ts` 只做配置解析与装配，其余模块不得直接 import `@deepseek-ai/*`。
- 插件自有配置键（`takeoverPresets`、`inspectorEnabled`）集中在 `src/config`，进入引擎前由 `hostConfig` 剥离，宿主引擎不会看到未知键。
- 客户端只注册一个占位侧栏 tab；宿主在运行时通过 `__ModuleLoader__` 提供 React 18.3.1 与 `dsh-client-ui-primitives`，插件产物不得内联第二份 React。
- 2026-11-25 曾清空全部旧实现（含 21 条提交）并从单一根提交重建历史；旧实现已不存在，无需在本文档中保留其细节。

## 环境

- 测试 API 必须从 `vite-plus/test` 导入：仓库未直接安装 `vitest`，`"vitest"` 与 `"vp/test"` 都无法解析。
- 非 TTY 下 `pnpm check` / `pnpm exec` / `pnpm test <file>` 会触发 pnpm 的依赖状态自检，报 `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`（lockfile 与 node_modules 失步）。逐项执行 `./node_modules/.bin/{vp,tsc,tsx}` 可正常工作。
- `.npmrc` 把 store 与 cache 指向仓库内的 `.cache/`，删掉后下一次 `pnpm install` 会重建。

## 门禁

最近一次实测（2026-11-25）：

| 项目 | 命令 | 结果 |
| --- | --- | --- |
| 类型 | `tsc --noEmit` | 通过 |
| 静态检查 | `vp lint` | 15 文件，0 警告 0 错误 |
| 测试 | `vp test` | 2 文件 5 项通过 |
| 构建 | `vp pack` | 宿主 + 客户端构建成功 |
| 体积 | `tsx scripts/size-check.ts` | 全部源文件 400 行以内 |
