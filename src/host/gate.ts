/**
 * 预设接管闸门骨架。
 * 当前只记录开关状态，不重写任何预设；接管逻辑后续在此实现。
 */
import { pluginConfig } from "../config/index.js";

/** Cordis 存储中压缩服务的隔离键。 */
export const COMPACTION_KEY = Symbol.for("cordis.isolate");

/** 读取当前作用域已注册的压缩服务。 */
export function compactionRecord(ctx: any): any {
  const key = ctx?.[COMPACTION_KEY]?.compaction;
  return key === undefined ? undefined : ctx?.reflect?.store?.[key];
}

export function installPresetGate(ctx: any, config: any = {}): void {
  const settings = pluginConfig(config);
  // 骨架：仅保留写入点，不接管预设。
  ctx.compactionGate = { enabled: settings.takeoverPresets };
}

export default class CompactCatGate {
  constructor(ctx: any, config: any) {
    installPresetGate(ctx, config);
  }
}
