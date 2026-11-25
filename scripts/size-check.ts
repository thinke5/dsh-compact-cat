/** 源文件行数守卫：单文件硬上限 400 行。 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const LIMIT = 400;
const files: string[] = [];

function walk(dir: string): void {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.tsx?$/.test(name)) files.push(path);
  }
}

walk("src");
const over = files
  .map((path) => ({ path, lines: readFileSync(path, "utf8").split("\n").length }))
  .filter((file) => file.lines > LIMIT);

if (over.length) {
  for (const file of over) console.error(file.path + ": " + file.lines + " 行，超过 " + LIMIT + " 行上限");
  process.exit(1);
}
console.log("size-check：" + files.length + " 个文件均在 " + LIMIT + " 行以内");
