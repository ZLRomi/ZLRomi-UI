# ZLRomi-UI
ZLRomi-UI设计风格：芒辰的个人 UI 设计系统。

## 看什么

纯静态展示站（零构建，Cloudflare Pages 可直接托管），打开 `index.html` 即看：

| 区块 | 内容 |
|---|---|
| 01 颜色 | 16 个语义 token，点击色卡复制 HEX |
| 02 字体 | 系统黑体栈 + `clamp()` 流式字号五档 |
| 03 形状 | 圆角六档 / 4pt 间距 / 阴影 e1–e4 |
| 04 按钮 | 主要 / 次要 / 描边 / 危险 + 小尺寸 + 禁用 |
| 05 标签与卡片 | 四种 chip + 三张示例卡 |
| 06 表单 | 输入框 / 复选 / 单选 / 弹簧开关 |
| 07 动效 | ease-out / spring / slow 三种曲线试玩 |

## 基石

- `css/tokens.css` — 全部 `--zui-*` 变量：品牌种子色霓紫 `#4C46D1`，明暗两套
- `css/components.css` — 布局与组件样式
- `js/main.js` — 主题持久化、色卡复制、滚动显现、滚动间谍

明暗切换用 `data-theme`，偏好存 `localStorage`，跟随系统（未手动选时）。
`prefers-reduced-motion` 下动效全部静止。

## 本地预览

```powershell
python -u -m http.server 8000 --bind 0.0.0.0 --directory .
```

## 许可

MIT © 2026 Romi
