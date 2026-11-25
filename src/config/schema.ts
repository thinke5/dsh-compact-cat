import { PLUGIN_DEFAULTS } from "./defaults.js";

/**
 * 官方设置界面按这份 schema 生成表单。
 * schema 工厂来自宿主安装的 schemastery，不打包第二份。
 */
export function configSchema(z: any, stockSchema?: any) {
  const stockFields = stockSchema?.dict ?? {};
  const inherited = Object.fromEntries(
    Object.entries(stockFields).map(([key, field]) => [key, z(field as any).volatile()]),
  );
  return z.object({
    ...inherited,
    takeoverPresets: z
      .boolean()
      .default(PLUGIN_DEFAULTS.takeoverPresets)
      .description("接管新加载的官方预设；关闭后交还宿主原版压缩。")
      .volatile(),
    inspectorEnabled: z
      .boolean()
      .default(PLUGIN_DEFAULTS.inspectorEnabled)
      .description("显示压缩检查侧栏；不影响压缩本身。")
      .volatile(),
  });
}
