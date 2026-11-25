/** 插件对宿主公开的配置表面。插件字段与宿主原版字段分开维护。 */
export interface ConfigSource {
  [key: string]: unknown;
}

/** 压缩猫自身的插件开关；默认全部保持宿主原版行为。 */
export interface PluginConfig {
  /** 是否接管官方预设；false 时完全交还宿主原版压缩。 */
  takeoverPresets: boolean;
  /** 是否显示压缩检查侧栏。 */
  inspectorEnabled: boolean;
}
