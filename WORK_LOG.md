# 实施记录

## 2026-11-25 骨架重置

用户判断现有实现不可用，要求清空全部逻辑、只保留基础骨架、移除所有功能。

- 清空：旧实现（144 个受跟踪源文件、88 个测试文件、docs/tool-processing.md）与全部 21 条旧提交及其 stash 已删除，仓库从全新根提交重新开始。
- 删除：`src/`、`tests/` 与 `scripts/` 下的浏览器/回归/链接脚本全部移除；保留 `scripts/size-check.ts`。
- 新骨架：
  - `src/host/adapter.ts`：上游 DSH 依赖唯一收敛点（`STOCK_ENGINE`、`loadCompactionBasic`、`loadSchema`）。
  - `src/host/entry.ts`：薄入口，解析插件配置并剥离插件键；引擎缺失或构造失败时回退原版压缩。
  - `src/host/gate.ts`：预设接管闸门骨架，只记录 `takeoverPresets`，不重写预设。
  - `src/engine/index.ts`：引擎骨架，直接继承 `BasicCompactionEngine`，无自定义压缩行为。
  - `src/config/`：`PLUGIN_DEFAULTS`、`PLUGIN_KEYS`、`hostConfig`、`pluginConfig`、`configSchema`。
  - `src/client/index.tsx`：客户端占位侧栏（渲染空组件）与最小生命周期类型。
  - `src/cli.ts`：命令行骨架。
- 文档：删除 `THIRD_PARTY_NOTICES.md`（骨架不含第三方代码副本，第三方声明无实际内容）；`package.json` 的 `files` 同步移除该条目，README 致谢段改为只指向 LICENSE。
- 构建配置：`vite.config.ts` 只保留宿主 index/engine/gate/cli 与客户端两个入口，移除 plan/storage 入口与浏览器测试分支；`package.json` 的 exports 同步移除 `./plan`、`./shadow-search`，并移除不再使用的 Playwright 依赖。

## 2026-11-25 清理本地文件

- 删除 `.ref/`（456 MB 参考克隆与调研笔记）、`.tmp/`（64 MB 调研脚本、旧会话探针、旧 tgz）、`.cache/`（57 MB 本地 pnpm store 与 npm cache）、`.pnpm-store/`（243 MB 旧 store 残留）。四项均在 `.gitignore` 中，删除不影响版本库。
- 删除后 `git status --ignored` 只剩 `lib/`（构建产物）与 `node_modules/`。
- 下一次 `pnpm install` 会重新生成 `.cache/` 下的本地缓存。

## 本次门禁

| 项目 | 结果 |
| --- | --- |
| `tsc --noEmit` | 通过 |
| `vp lint` | 14 文件，0 警告 0 错误 |
| `vp test` | 1 文件 3 项通过（配置默认值、插件键剥离、schemastery 值对象读取） |
| `vp pack` | 宿主 16 文件 / 17.70 kB，客户端构建成功 |
| `tsx scripts/size-check.ts` | 11 个源文件均在 400 行以内 |

门禁通过 `./node_modules/.bin/vp`、`./node_modules/.bin/tsc`、`./node_modules/.bin/tsx` 逐项执行。

测试 API 必须从 `vite-plus/test` 导入（本仓库未直接安装 `vitest`）。

已知问题（与本次改动无关）：`pnpm check` 这类多脚本串联会触发 pnpm 的依赖状态自检，非 TTY 下报 `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`（lockfile 与 node_modules 已失步）。单独执行各脚本可正常工作。

## 2026-11-25 git 历史重置

- 做法：以当前工作树重建孤立根提交 `chore: 重置为最小骨架（清空旧实现与全部历史）`，删除旧 `main` 与 stash，`reflog expire --expire=now` 加 `git gc --prune=now` 清除不可达对象；移除 `origin` 远程，避免远端旧历史在当前克隆中残留。已恢复 `origin` 并用 `git push --force origin main` 覆盖远端（`1b44310...84b9da7`），`git ls-remote` 只剩新历史。
- 结果：`git log --all` 只剩 1 个根提交，共 30 个受跟踪文件；旧提交哈希 `1b44310`、`a4dac5d` 已不可寻址；`.git` 体积 148 KB。
