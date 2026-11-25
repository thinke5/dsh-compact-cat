const NOT_TAKEOVER = "spine: 压缩猫未接管，改用原版压缩。";

/**
 * 薄入口：必须先于引擎求值，引擎加载失败也不能把这里抛掉。
 * 配置解析放在这里完成，引擎只接收已经剥离插件键的宿主配置。
 */
import { loadCompactionBasic, loadSchema } from "./adapter.js";
import { configSchema, hostConfig, pluginConfig } from "../config/index.js";

let Engine: any = null;
let Stock: any = null;
let Schema: any = null;
let loadError: Error | null = null;

try {
  const engine = await import("../engine/index.js");
  Engine = engine.default;
} catch (error) {
  loadError = toError(error);
}

try {
  const stock = await loadCompactionBasic();
  Stock = stock.default;
} catch (error) {
  loadError ??= toError(error);
}

try {
  const schema = await loadSchema();
  Schema = configSchema(schema.default, Stock?.Config);
} catch {
  Schema = null;
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

export default class CompactCatEntry {
  static inject = ["llm", "tokenMeter", "sessions"];
  static Config = Schema ?? Stock?.Config ?? Engine?.Config;

  constructor(ctx: any, config: any) {
    const settings = pluginConfig(config);
    const reason = loadError?.message ?? "engine missing";
    if (!Engine) {
      ctx.logger?.warn?.(NOT_TAKEOVER + reason);
      if (!Stock) throw new Error(NOT_TAKEOVER + reason);
      return new Stock(ctx, hostConfig(config));
    }
    try {
      return new Engine(ctx, hostConfig(config), settings);
    } catch (error) {
      const message = toError(error).message;
      ctx.logger?.warn?.(NOT_TAKEOVER + message);
      if (!Stock) throw new Error(NOT_TAKEOVER + message);
      return new Stock(ctx, hostConfig(config));
    }
  }
}
