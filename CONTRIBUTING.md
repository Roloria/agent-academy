# 🤝 贡献指南

感谢你考虑为 Agent Academy 做出贡献！🎉

## 💡 我们欢迎的贡献

### 📝 内容贡献
- 新增 / 改进 **GitHub 项目卡片**
- 添加 **论文摘要与解读**
- 翻译为其他语言（英文、日文、韩文…）
- 增加 **动手实验**（Lab 01-05）
- 完善 **资源中心**（课程、书籍、社区、Newsletter）
- 修复 **错误信息 / 拼写 / 不准确内容**

### 🛠 工程贡献
- 改进 **页面设计 / 响应式布局**
- 新增 **交互功能**（搜索、过滤、暗色/亮色切换）
- 优化 **性能 / 加载速度**
- 添加 **国际化**（i18n）
- 修复 **Bug**

### 📚 文档贡献
- 改进 **README / DEPLOY.md**
- 补充 **代码示例 / 注释**
- 翻译 **文档**

---

## 🚀 快速开始

```bash
# 1. Fork 仓库
# 2. 克隆你的 fork
git clone https://github.com/YOUR_USERNAME/agent-academy.git
cd agent-academy

# 3. 创建新分支
git checkout -b feat/your-contribution

# 4. 启动本地预览
python3 -m http.server 8000
# 打开 http://localhost:8000

# 5. 修改并提交
git add .
git commit -m "📝 描述你的修改"

# 6. 推送到你的 fork
git push origin feat/your-contribution

# 7. 创建 Pull Request
```

---

## 📋 贡献流程

1. **大改动前先开 Issue** —— 多人协作时避免方向分歧
2. **保持修改聚焦** —— 一个 PR 一个清晰的改动
3. **遵循现有风格** —— 看几页现有页面就懂
4. **测试你的修改** —— 至少在 Chrome / Safari 验证显示正常
5. **更新文档** —— 如果改变了用户行为

---

## 🎨 代码风格指南

### HTML
- 使用语义化标签 `<nav>`, `<main>`, `<article>`, `<section>`
- 标题层级清晰 `<h1>` → `<h2>` → `<h3>`
- 图片加 `alt` 属性
- 类名使用连字符: `feature-card`

### CSS
- 使用现有 CSS 变量 (颜色、间距、字体大小)
- 移动优先，使用 `clamp()` 流式排版
- 复用组件样式，避免重复

### JavaScript
- 纯原生 JS，无框架
- 使用 `data-*` 属性作为 hooks
- 与 `js/main.js` 中已建立的模式一致

---

## 📋 PR 检查清单

提交 PR 前请确认:

- [ ] 本地预览无错误
- [ ] 修改在桌面 + 移动端显示正常
- [ ] 链接可点击且路径正确
- [ ] 没有破坏现有的 Tab / 搜索 / 过滤功能
- [ ] 在 CHANGELOG 或 commit message 中说明了改动
- [ ] 没有大文件 (.png, .pdf) 被提交

---

## 🌟 第一次贡献?

找找标有 `good first issue` 或 `help wanted` 的 issue —— 这些是新人友好的入口。

---

## 💬 有问题?

- 在 [Discussions](https://github.com/Roloria/agent-academy/discussions) 提问
- 在相关 Issue 下回复
- 邮箱联系：见 GitHub 个人资料

---

**再次感谢你的贡献！🚀**
