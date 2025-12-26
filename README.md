# Macintosh Portfolio 1984

一个 1980 年代早期 Apple Macintosh 风格的响应式个人主页。

## 特性

- 🖥️ 桌面端：完整 Macintosh 桌面体验（菜单栏、可拖拽窗口、桌面图标）
- 📱 移动端：Tab 导航的单窗口分页界面
- ⚙️ JSON 配置文件：编辑 config.json 即可更新所有内容
- 🎨 1-bit 黑白设计：纯复古风格，无渐变和玻璃效果
- ⌨️ 键盘快捷键：Esc 关闭窗口，Tab 切换窗口

## 快速开始

### 方法 1: 本地测试（推荐）

由于浏览器安全限制，需要通过 HTTP 服务器访问（不能用 file://）：

```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

然后访问：http://localhost:8000

### 方法 2: 直接打开（功能受限）

直接双击 `index.html` 也可以打开，但会看到配置加载错误提示，显示的是默认内容。

## 配置说明

所有内容都在 `config.json` 中配置：

```json
{
  "site": {
    "title": "My Macintosh",
    "menuLogo": "My Macintosh",
    "menuItems": ["File", "Edit", "View", "Special", ""]
  },
  "profile": {
    "name": "Your Name",
    "avatar": "👤",
    "bio": "个人简介",
    "background": "背景介绍",
    "skills": ["JavaScript", "Python", "React"]
  },
  "projects": [
    {
      "title": "项目名称",
      "icon": "🎨",
      "description": "项目描述",
      "year": "2024",
      "link": "https://..."
    }
  ]
}
```

### 配置项说明

| 字段 | 说明 |
|------|------|
| `site` | 网站基本信息（标题、菜单栏） |
| `profile` | 个人资料（头像、简介、技能） |
| `projects` | 项目列表 |
| `writings` | 文章列表 |
| `notes` | 便签（支持文本和列表两种类型） |
| `contact` | 联系方式（社交媒体、表单开关） |
| `links` | 友情链接（分组） |
| `desktop` | 桌面图标和默认打开窗口 |

## 部署

上传到任意静态托管服务：

- **GitHub Pages**: 推送到仓库，在 Settings 中启用 Pages
- **Netlify**: 拖拽文件夹到 netlify.com
- **Vercel**: 连接 GitHub 仓库或拖拽部署
- **Cloudflare Pages**: 连接 Git 仓库

只需要上传：
- `index.html`
- `config.json`

## 自定义样式

如果需要修改样式，编辑 `<style>` 标签中的 CSS 变量：

```css
:root {
    --color-black: #000000;
    --color-white: #ffffff;
    --font-size-md: 12px;
    --border-width-thick: 4px;
    /* ... 更多变量 */
}
```

## 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `Esc` | 关闭当前窗口 |
| `Tab` | 切换到下一个窗口（仅桌面端） |
| `Cmd/Ctrl + W` | 关闭当前窗口 |

## 文件结构

```
.
├── index.html      # 主页面（包含所有样式和脚本）
├── config.json     # 配置文件（编辑这个更新内容）
└── README.md       # 说明文档
```

## 浏览器兼容性

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- 移动浏览器: ✅

## 常见问题

### Q: 为什么直接打开 HTML 看不到内容？
A: 浏览器的安全策略限制了 `file://` 协议的 fetch 请求。请使用 HTTP 服务器。

### Q: 如何添加更多项目？
A: 在 `config.json` 的 `projects` 数组中添加新对象即可。

### Q: 如何禁用联系表单？
A: 设置 `"formEnabled": false`

### Q: 如何修改默认打开的窗口？
A: 修改 `desktop.defaultOpenWindow` 为对应的窗口 ID（如 `"projects-window"`）

## License

MIT

---

Made with ❤️ in 2024
