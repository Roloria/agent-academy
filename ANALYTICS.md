# 📊 Analytics 配置指南

Agent Academy 内置了**可配置的分析系统**，默认是关闭状态。你可以任选 Plausible / Umami / GA4 / GoatCounter 中的一个启用。

## 📍 配置文件

所有分析配置集中在 **[`js/analytics.js`](js/analytics.js)** 一个文件中。

## 🚀 推荐方案：Plausible Analytics

[Plausible](https://plausible.io) 是面向开源项目和静态站点的隐私友好分析平台。**对开源项目免费**，无需 Cookie 横幅。

### 启用步骤

1. 访问 https://plausible.io 注册
2. 点击 **"Add your first site"**
3. 输入域名: `roloria.github.io/agent-academy`
4. 进入站点设置, 在 "**Visibility**" 中选择 "**Public**" (因为是 GitHub Pages)
5. 等待 DNS 检查 (10 秒左右)
6. 编辑 `js/analytics.js`, 找到 ANALYTICS_CONFIG 块:

```javascript
const ANALYTICS_CONFIG = {
  enabled: false,          // ← 改成 true
  provider: 'plausible',   // ← 已经是 plausible
  domain: 'roloria.github.io/agent-academy',

  plausible: {
    scriptSrc: 'https://plausible.io/js/script.js'
  },
  // ... 其他配置
};
```

7. 把 `enabled` 改成 `true`
8. 提交 + 推送 → 网站会自动部署, Plausible 立即开始记录

### 优点

- ✅ **隐私优先** —— 无 Cookie, 无需 GDPR/CCPA 横幅
- ✅ **极轻** —— 脚本仅 1KB
- ✅ **美观仪表盘** —— 简洁实用
- ✅ **准确归因** —— UTM / 来源 / 国家 / 设备
- ✅ **对 OSS 免费** —— 你不用花一分钱

---

## 🔄 其他备选方案

### Umami Cloud (免费)

[Umami](https://umami.is) 是开源的隐私友好分析。可以自托管, 或用 Umami Cloud 免费版。

```javascript
const ANALYTICS_CONFIG = {
  enabled: true,
  provider: 'umami',
  domain: 'roloria.github.io/agent-academy',
  umami: {
    websiteId: 'YOUR-UMAMI-WEBSITE-ID',  // ← 在 Cloud Umami 获取
    scriptSrc: 'https://cloud.umami.is/script.js'
  },
};
```

### Google Analytics 4

最强大但最重, 需要 Cookie 同意横幅:

```javascript
const ANALYTICS_CONFIG = {
  enabled: true,
  provider: 'ga4',
  domain: 'roloria.github.io/agent-academy',
  ga4: {
    measurementId: 'G-XXXXXXXXXX'  // ← 在 Google Analytics 获取
  },
};
```

⚠️ 提示: GA4 在欧盟需要 Cookie 同意横幅, 不符合隐私优先原则。

### GoatCounter (OSS 免费)

[GoatCounter](https://www.goatcounter.com) 对个人和非商业开源项目免费:

```javascript
const ANALYTICS_CONFIG = {
  enabled: true,
  provider: 'goatcounter',
  domain: 'roloria.github.io/agent-academy',
  goatcounter: {
    code: 'YOUR-GOATCOUNTER-CODE'  // ← 注册后获取
  },
};
```

---

## 🧪 启用后如何测试

1. 部署后, 在自己的网站和服务器 (curl) 上模拟访问
2. 在 Plausible / GA 仪表盘查看实时数据
3. 由于 Plausible / GA 通常有 5-10 分钟延迟, 可以在不同设备/IP 测试

## 📊 我们推荐

```
静态 + OSS      → Plausible (隐私友好 + 美观)
隐私最严        → Umami self-hosted
最强大功能      → GA4 (有 Cookie 同意要求)
完全免费        → GoatCounter
```

---

## 🚫 完全不想要分析?

保持 `enabled: false` 即可。脚本不会加载任何外部资源, 完全无副作用。

---

如果遇到问题, 在 [Issues](https://github.com/Roloria/agent-academy/issues) 提问!
