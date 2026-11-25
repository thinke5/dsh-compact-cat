/**
 * 所有上游 DSH 依赖都收敛在这里，其它文件不出现 DSH 包名。
 * 上游版本变化时只需要改这一个文件。
 */
export const STOCK_ENGINE = "@deepseek-ai/dsh-compaction-basic";

export const loadCompactionBasic = (): Promise<any> => import("@deepseek-ai/dsh-compaction-basic");

/** 官方设置界面读的是 schemastery schema，构造器同样从这里取。 */
export const loadSchema = (): Promise<any> => import("@deepseek-ai/schemastery");
