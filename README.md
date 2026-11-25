# DSH Compact Cat

DeepSeek Harness 原位上下文压缩插件。当前为**基础骨架**：保留可安装、可构建、可测试的工程结构与最小接入点，尚未实现任何自定义压缩逻辑。

> 骨架阶段插件直接继承宿主原版压缩引擎（`@deepseek-ai/dsh-compaction-basic`），压缩行为与宿主一致。不要和另一个接管 compaction 的插件同时启用。

## 现状

| 模块                   | 状态                                                             |
| ---------------------- | ---------------------------------------------------------------- |
| `src/host/entry.ts`    | 薄入口：解析配置、构造引擎；引擎加载失败时回退原版压缩           |
| `src/host/adapter.ts`  | 上游 DSH 依赖的唯一收敛点                                        |
| `src/host/gate.ts`     | 预设接管闸门骨架，仅记录开关，不重写预设                         |
| `src/engine/index.ts`  | 引擎骨架，直接继承原版压缩引擎                                   |
| `src/config/`          | 插件私有配置键（`takeoverPresets`、`inspectorEnabled`）与 schema |
| `src/client/index.tsx` | 客户端占位侧栏，渲染为空                                         |
| `src/cli.ts`           | 命令行骨架                                                       |
| `tests/`               | 配置解析的单元测试                                               |

## 开发

```sh
pnpm install
pnpm typecheck     # tsc --noEmit
pnpm test          # vp test
pnpm lint          # vp lint，含类型检查
pnpm build         # vp pack，生成宿主与客户端产物到 lib/
pnpm check         # lint + typecheck + test + build
```

不设单文件行数上限：按职责拆分模块即可，门禁不再校验文件体积。说明文本与提交信息使用简体中文。

## 致谢

压缩引擎继承自宿主原版；旧实现与设计参考了 Live Compact（MIT）及 DSH Context、Mnemon 的公开做法。许可见 [LICENSE](LICENSE)。
