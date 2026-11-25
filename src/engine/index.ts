import { hostConfig } from "../config/index.js";
import { STOCK_ENGINE } from "../host/adapter.js";

async function loadStock(): Promise<any> {
  return import(STOCK_ENGINE);
}

const { default: BasicCompactionEngine } = await loadStock();

/**
 * 压缩猫引擎。骨架阶段直接继承宿主原版压缩引擎，不改变任何压缩行为。
 * 后续策略、切片与备份能力都从这里叠加。
 */
export default class CompactCatEngine extends BasicCompactionEngine {
  constructor(ctx: any, config: any) {
    super(ctx, hostConfig(config));
  }
}
