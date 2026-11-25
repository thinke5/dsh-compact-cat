import { readFileSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";

const icon = readFileSync(new URL("../icon.svg", import.meta.url), "utf8");

describe("猫咪图标", () => {
  it("保留方形画布并提供可读名称", () => {
    expect(icon).toContain('viewBox="0 0 64 64"');
    expect(icon).toContain('role="img"');
    expect(icon).toMatch(/<title>[^<]+<[/]title>/);
  });

  it("保持独立静态资源，不加载外部内容或脚本", () => {
    expect(icon).not.toMatch(/<script|<foreignObject|<image|<use|href=|url\(|\son\w+=/i);
  });
});
