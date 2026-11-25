import { PLUGIN_DEFAULTS, PLUGIN_KEYS } from "./defaults.js";
import type { ConfigSource, PluginConfig } from "./types.js";

/** 宿主配置可能是 schemastery 的值对象，读取时统一取值。 */
export function plain(value: unknown): unknown {
  if (value && typeof value === "object" && "get" in value && typeof value.get === "function") {
    const get = (value as { get: () => unknown }).get;
    return get.call(value);
  }
  return value;
}

/** 把插件键从宿主配置里剥离，其余字段原样交给宿主压缩引擎。 */
export function hostConfig(config: ConfigSource = {}): ConfigSource {
  const next: ConfigSource = {};
  for (const [key, value] of Object.entries(config ?? {})) {
    if (PLUGIN_KEYS.has(key)) continue;
    const current = plain(value);
    if (current != null) next[key] = current;
  }
  return next;
}

/** 读取插件自身设置；未配置时使用默认值。 */
export function pluginConfig(config: ConfigSource = {}): PluginConfig {
  return {
    takeoverPresets: flag(config?.takeoverPresets, PLUGIN_DEFAULTS.takeoverPresets),
    inspectorEnabled: flag(config?.inspectorEnabled, PLUGIN_DEFAULTS.inspectorEnabled),
  };
}

function flag(value: unknown, fallback: boolean): boolean {
  const current = plain(value);
  return typeof current === "boolean" ? current : fallback;
}
