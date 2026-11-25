import type { ComponentType } from "react";

export const NAMESPACE = "compaction-spine";
export const PACKAGE_NAME = "dsh-compact-cat";
export const TAB_ID = "compact-cat";

/** 宿主生命周期句柄：可调用，也可调用 dispose()。 */
export interface Disposable {
  (): void;
  dispose?(): void;
}

export interface ClientContext {
  locale: {
    register(namespace: string, dictionaries: Record<string, Record<string, string>>): unknown;
  };
  slots: {
    inject(name: string, register: () => Disposable): Disposable;
    register(
      options: { name: string; key: string; locale?: string },
      component: ComponentType,
    ): Disposable;
  };
  sidebarRightTabs?: { register(definition: unknown): Disposable };
  inject(services: string[], callback: (context: ClientContext) => Disposable): Disposable;
  effect(callback: () => void | Disposable, label?: string): unknown;
}

/** 侧栏内容骨架。后续在这里接入检查记录、切点与原文按需读取。 */
export function Inspector() {
  return null;
}

export const name = PACKAGE_NAME;
export const inject = ["slots", "locale"];

export function apply(ctx: ClientContext): void {
  ctx.effect(
    () =>
      ctx.slots.inject("sidebar.right.pane.tab", () =>
        ctx.slots.register(
          { name: "sidebar.right.pane.tab", key: TAB_ID, locale: NAMESPACE },
          Inspector,
        ),
      ),
    "compact-cat: sidebar",
  );
}
