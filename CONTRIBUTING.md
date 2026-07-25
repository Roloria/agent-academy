# 🤝 贡献指南

感谢你考虑为 Agent Academy 做出贡献! 🎉

> **Agent Academy 不是一个人的项目 —— 它是一个由 AI Agent 学习者共同维护的知识库。**
> 只要你用过 Agent、读过论文、踩过坑,你都有可以分享的东西。

---

## 💡 我们最想看到的贡献方向

详细内容看 [README.md · 我们最欢迎的想法](README.md#-ideas-we-most-welcome) 一节,这里只列个清单:

### 📦 内容方向
- 🆕 新增项目卡片、论文摘要、新实验、新书/课程

### 💎 设计方向
- 🎨 视觉改进、更多语言翻译、移动端体验

### 🛠 工程方向
- 🏗 更好的架构图、Playground 新工具、性能优化

### 🎯 教育方向
- 📖 真实场景、更好的类比、学习路径调整

**💬 即使是 typo、错字、坏链接,也欢迎提!**

---

## 🚀 我能怎么贡献? (5 个级别)

| 级别 | 时间 | 我该做什么 |
|---|---|---|
| 🟢 第 1 级 | 0 分钟 | ⭐ Star / 分享 / 反馈 |
| 🟡 第 2 级 | 5-30 分钟 | 提想法 / 改 typo / 翻译片段 |
| 🟠 第 3 级 | 1-3 小时 | 新增项目卡 / 论文 / Lab |
| 🔴 第 4 级 | 半天+ | 整页翻译 / 录视频 / 写案例 |
| 🌟 第 5 级 | 持续 | 成为 Collaborator |

---

## 🚀 快速开始 (3 步)

### 步骤 1:Fork 仓库
点击右上角 **Fork**,这会在你的账号下创建一个副本。

### 步骤 2:本地修改
```bash
# 克隆你的 fork
git clone https://github.com/YOUR_USERNAME/agent-academy.git
cd agent-academy

# 创建一个分支
git checkout -b feat/your-contribution

# 修改、提交
git add .
git commit -m "📝 简短描述"
git push origin feat/your-contribution
```

### 步骤 3:开 PR
1. 在你的 fork 页面点 **Contribute** → **Open pull request**
2. 描述你改了什么、为什么改
3. 等 review 或合并

> 第一次贡献? 从 [good first issue](https://github.com/Roloria/agent-academy/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) 标签的 Issue 开始。

---

## 💡 提一个想法 (3 种方式任选)

### 方式 1: GitHub Discussions (推荐)
👉 [开新讨论 - 选择 💡 Ideas](https://github.com/Roloria/agent-academy/discussions/new?category=ideas)

适合: 想法比较大、需要讨论、想看看别人怎么看

### 方式 2: GitHub Issue
👉 [开 Issue - 选 "Feature Request" 模板](https://github.com/Roloria/agent-academy/issues/new/choose)

适合: 具体的功能需求、有明确边界

### 方式 3: 直接改
如果你已经知道怎么改,直接 fork → 改 → PR。

---

## 📋 贡献类型详解

### 📚 内容贡献
- 新增 GitHub 项目卡片 → 编辑 `projects.html`,加 `<div class="project-card">`
- 新增论文摘要 → 编辑 `resources.html`,加新 Tab 内容
- 新增 Lab → 编辑 `workshop.html`,加新 Lab 区块

### 🛠 工程贡献
- 改进视觉 → 编辑 `css/components.css`
- 改进交互 → 编辑 `js/main.js` 或 `js/playground.js`
- 新增功能 → 找蓝色 "good first issue" 标签的 Issue

### 🌐 翻译贡献
- 翻译某个页面 → 复制 `.html` 文件,翻译文本,提交 PR
- 如果是新语言,在 `deploy.yml` 添加该语言

---

## 🎯 7 个详细贡献方向

### 1️⃣ 新增 GitHub 项目卡片 (30 分钟)
在 `projects.html` 找到 `id="projects-list"`,复制粘贴:

```html
<div class="project-card" data-tags="yourtag" 
     data-name="ProjectName" 
     data-desc="keyword keyword keyword">
  <div class="project-head">
    <div class="project-icon" style="background: linear-gradient(...)">🆕</div>
    <div>
      <div class="project-name">Project Name</div>
      <div style="font-size: 0.82rem; color: var(--text-3);">org/repo</div>
    </div>
  </div>
  <p class="project-desc">项目简介(2-3 行)</p>
  <div class="project-meta">
    <span>⭐ 1k+</span>
    <span style="color: var(--brand-4);">● Active</span>
  </div>
  <div class="project-links">
    <a class="project-link" href="https://github.com/org/repo">→ GitHub</a>
  </div>
</div>
```

### 2️⃣ 新增论文 (15 分钟)
编辑 `resources.html`,在对应 Tab 下加:

```html
<div class="card">
  <div class="badge badge-purple" style="margin-bottom: 10px;">年份 · 主题</div>
  <h3>论文标题</h3>
  <p style="color: var(--text-2); font-size: 0.92rem; margin-bottom: 12px;">作者 · 单位</p>
  <p style="color: var(--text-2); font-size: 0.92rem;">1-2 句摘要</p>
  <div style="margin-top: 14px;"><a href="arXiv链接" class="project-link">arXiv →</a></div>
</div>
```

### 3️⃣ 新增 Lab 实验 (1-2 小时)
在 `workshop.html` 加新 Lab。参考现有 Lab 04 结构。

### 4️⃣ 修复错别字 (1 分钟)
直接编辑,提交 PR。

### 5️⃣ 翻译 (30 分钟)
复制某个 HTML,翻译所有中文,提交 PR。

### 6️⃣ Bug 报告 (5 分钟)
[开 Issue](https://github.com/Roloria/agent-academy/issues/new),描述:
- 复现步骤
- 期望行为
- 实际行为
- 截图 (如适用)

### 7️⃣ 想法和建议 (1 分钟)
[开 Discussion](https://github.com/Roloria/agent-academy/discussions/new?category=ideas),
写一句话说明想法即可。

---

## ✅ 提交前检查清单

- [ ] 我的修改通过了浏览器测试 (桌面 + 移动端)
- [ ] 没有引入新的错误或警告
- [ ] 修改在本地浏览器显示正常
- [ ] PR 标题清晰描述了改动 (例: "Add Computer Use lab to workshop")
- [ ] (可选) 在 PR 描述中说明你的改动解决什么问题

---

## 🌟 成为 Collaborator

贡献 5+ 个有质量 PR,或者持续贡献 1 个月以上,我们会邀请你成为 **Collaborator**:
- 直接 push 权限
- 贡献者墙有你的名字
- 与我们共同决定项目方向

---

## 📋 风格指南

### HTML
- 使用语义化标签
- 标题层级清晰 (h1 → h2 → h3)
- 类名用连字符 (如 `feature-card`)

### CSS
- 使用现有 CSS 变量 (`--brand-1`, `--bg-2` 等)
- 移动优先,响应式设计
- 避免 !important

### JavaScript
- 纯原生 JS (不用框架)
- 遵循 `js/main.js` 已有的模式

### 内容
- 中文使用简体中文
- 英文版本在 `en/` 目录
- 保持简洁有力,不啰嗦

---

## ❓ 有问题?

- 在 [Discussions](https://github.com/Roloria/agent-academy/discussions) 提问
- 在 Issue 下回复
- 参见 [README.md · 怎样贡献](README.md#-how-to-contribute--5-levels)

---

## 📜 许可

通过贡献,你同意你的贡献按 [MIT License](LICENSE) 授权。

**感谢你花时间贡献 —— 每一份贡献都让这个项目变得更好!** 💜

<sub>这份贡献指南模板改编自 [Contribute.md](https://github.com/contribute-md/contribute-md-template),基于 MIT 许可。</sub>
