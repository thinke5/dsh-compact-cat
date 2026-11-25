#!/usr/bin/env node
/** 命令行骨架：后续提供本地诊断与维护入口。 */
const [command] = process.argv.slice(2);

if (!command) {
  console.log("dsh-compact-cat：暂无可用的命令。");
  process.exit(0);
}

console.error("未知命令：" + command);
process.exit(1);
