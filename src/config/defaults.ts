import type { PluginConfig } from "./types.js";

/** 插件默认值。这里是运行时与设置界面的唯一来源。 */
export const PLUGIN_DEFAULTS: Readonly<PluginConfig> = Object.freeze({
  takeoverPresets: true,
  inspectorEnabled: true,
});

/** 插件私有键；不得透传给宿主压缩引擎。 */
export const PLUGIN_KEYS = new Set(Object.keys(PLUGIN_DEFAULTS));
