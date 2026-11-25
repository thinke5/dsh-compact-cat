import { describe, expect, it } from "vite-plus/test";
import { PLUGIN_DEFAULTS } from "../../src/config/defaults.js";
import { hostConfig, pluginConfig } from "../../src/config/settings.js";

describe("插件配置", () => {
  it("未配置时使用默认值", () => {
    expect(pluginConfig({})).toEqual(PLUGIN_DEFAULTS);
  });

  it("剥离插件键后保留宿主字段", () => {
    const target = hostConfig({
      takeoverPresets: false,
      inspectorEnabled: false,
      thresholdRatio: 0.7,
    });
    expect(target).toEqual({ thresholdRatio: 0.7 });
  });

  it("读取 schemastery 值对象并拒绝非布尔开关", () => {
    expect(pluginConfig({ takeoverPresets: { get: () => false } }).takeoverPresets).toBe(false);
    expect(pluginConfig({ inspectorEnabled: "yes" }).inspectorEnabled).toBe(true);
    expect(hostConfig({ thresholdRatio: { get: () => 0.5 } }).thresholdRatio).toBe(0.5);
  });
});
