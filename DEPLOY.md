# 🚀 部署指南

> Agent Academy 提供多种部署方式，从最简单的拖拽部署到完全自托管。

## 📑 部署方式一览

| 方式 | 难度 | 费用 | 速度 | 适用场景 |
|---|---|---|---|---|
| **GitHub Pages** | ⭐ 极简 | 免费 | 1 分钟 | 个人/开源项目 |
| **Netlify Drop** | ⭐ 极简 | 免费 | 30 秒 | 演示/快速上线 |
| **Vercel** | ⭐ 极简 | 免费 | 1 分钟 | 现代平台 |
| **Docker** | ⭐⭐ 简单 | 服务器成本 | 3 分钟 | 自托管/企业 |
| **手动 Nginx** | ⭐⭐⭐ 中等 | 服务器成本 | 10 分钟 | 完全控制 |

---

## 🟢 方案一：GitHub Pages（推荐）

### 前置条件
- 一个 GitHub 账号（[github.com](https://github.com)）
- 已在本地安装 git

### 一键部署

```bash
cd "agent-academy"
./deploy.sh github
```

脚本会自动：
1. ✅ 初始化 git 仓库（如需要）
2. ✅ 添加所有文件
3. ✅ 创建提交
4. ✅ 推送到 GitHub
5. ✅ 提示你在 GitHub UI 启用 Pages

### 手动部署步骤

#### 1. 创建 GitHub 仓库
访问 https://github.com/new
- Repository name: `agent-academy`（或任意喜欢的名字）
- 描述：AI Agent 系统化学习平台
- Public/Private：选 Public（GitHub Pages 免费）
- **不要**勾选 Add README / .gitignore / license

#### 2. 推送代码
```bash
cd "agent-academy"
git init
git branch -M main
git add .
git commit -m "🚀 Initial commit: Agent Academy v1.0.0"
git remote add origin https://github.com/你的用户名/agent-academy.git
git push -u origin main
```

#### 3. 启用 GitHub Pages
1. 进入仓库页面 https://github.com/你的用户名/agent-academy
2. 点 **Settings** → **Pages**
3. 在 **Build and deployment** 中：
   - Source: 选 **GitHub Actions**
4. 等待 30-60 秒，部署自动开始

#### 4. 访问你的网站
```
https://你的用户名.github.io/agent-academy/
```

### 自定义域名（可选）

1. 在仓库根目录创建 `CNAME` 文件，内容是你的域名：
   ```
   agent-academy.yourdomain.com
   ```

2. 在域名 DNS 添加 CNAME 记录指向：
   ```
   你的用户名.github.io
   ```

3. 在 GitHub Pages 设置中勾选 **Enforce HTTPS**

---

## 🟣 方案二：Netlify Drop（最快）

**适合**不需要 Git 集成、想要最快部署的演示场景。

1. 访问 https://app.netlify.com/drop
2. 注册账号（免费）
3. 将整个 `agent-academy` 文件夹**拖入**浏览器
4. 几秒钟后获得 URL：`https://xxx.netlify.app`

优点：零配置、HTTPS 自动、自带 CDN。

---

## 🔷 方案三：Vercel

### CLI 部署
```bash
npm i -g vercel
cd "agent-academy"
vercel --prod
```

### GitHub 集成
1. 推送到 GitHub
2. 访问 https://vercel.com/new
3. 导入你的仓库
4. 点击 Deploy

---

## 🐳 方案四：Docker 自托管

适合私有部署、企业内部、或自己有 VPS 的情况。

### 前置条件
- Linux 服务器（或任何支持 Docker 的环境）
- 已安装 Docker + Docker Compose

### 一键部署

```bash
cd "agent-academy"
docker-compose up -d
```

访问 `http://你的服务器IP/` 即可。

### 配置 HTTPS

1. 准备 SSL 证书（可用 Let's Encrypt）
2. 修改 `nginx.conf`，取消 443 监听注释
3. 在 `docker-compose.yml` 取消证书挂载注释
4. 重启：`docker-compose restart`

### 常用命令

```bash
docker-compose ps          # 查看状态
docker-compose logs -f     # 查看日志
docker-compose restart     # 重启
docker-compose down        # 停止
docker-compose up -d --build  # 重新构建并启动
```

---

## 🛠 方案五：手动 Nginx 部署

适合已有服务器、希望最大限度控制的环境。

### 1. 安装 Nginx
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install -y nginx

# CentOS
sudo yum install -y nginx
```

### 2. 上传网站文件
```bash
sudo mkdir -p /var/www/agent-academy
sudo cp -r * /var/www/agent-academy/
sudo chown -R www-data:www-data /var/www/agent-academy
```

### 3. 配置 Nginx
创建 `/etc/nginx/sites-available/agent-academy`：
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/agent-academy;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(css|js|jpg|png|svg|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css text/javascript application/javascript application/json;
}
```

### 4. 启用配置
```bash
sudo ln -s /etc/nginx/sites-available/agent-academy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔍 部署后验证清单

- [ ] 访问首页能看到 Hero 区段
- [ ] 导航栏 7 个链接都能跳转
- [ ] 知识页的 Mermaid 图谱渲染正常
- [ ] 项目页搜索 + 过滤可用
- [ ] 工坊页 Tab 切换正常
- [ ] 蓝图页能展开所有 Tab
- [ ] 资源页锚点跳转正常
- [ ] 移动端响应式正常
- [ ] 浏览器控制台无 404 错误

---

## 📊 性能优化建议

部署后建议做：

1. **启用 CDN**：Cloudflare 免费版即可
2. **启用 Gzip/Brotli**：已在 nginx.conf 配置
3. **启用 HTTP/2**：在 Nginx listen 443 ssl http2;
4. **定期更新**：通过 `git pull` 或重新部署
5. **监控**：建议接入 Plausible 或 Umami 分析

---

## 🆘 故障排查

### 部署后白屏
**原因**：CSS 路径错误
**解决**：确保是从根路径访问，而非 `file://`

### 404 Not Found
**原因**：服务器配置问题
**解决**：检查 `try_files` 配置

### Mermaid 图不显示
**原因**：CDN 阻塞
**解决**：下载 mermaid.min.js 到本地 `js/` 目录

### GitHub Pages 不更新
**原因**：Actions workflow 失败
**解决**：查看仓库的 Actions 标签页

---

## 📞 需要帮助？

如有问题：
1. 查看本仓库的 Issues
2. 在 Discussions 发起讨论
3. 提交 Issue 并附上部署日志

---

**选择最适合你的方案，开始部署吧！🚀**

