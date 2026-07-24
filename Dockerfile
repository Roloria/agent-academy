# ============================================================
# Agent Academy - Production Dockerfile
# 多阶段构建：构建阶段编译资源，运行阶段提供最小镜像
# ============================================================

# === 阶段 1：构建（可选 - 用于未来如果加入构建工具） ===
FROM node:20-alpine AS builder
WORKDIR /app
# 当前是纯静态站点，构建阶段保留扩展性
COPY . .

# === 阶段 2：生产镜像 - Nginx Alpine ===
FROM nginx:1.27-alpine AS production

# 元数据
LABEL maintainer="Agent Academy"
LABEL version="1.0.0"
LABEL description="AI Agent 学习平台 · 静态网站"

# 安装 curl 用于健康检查
RUN apk add --no-cache curl

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 复制网站文件
COPY --chown=nginx:nginx index.html /usr/share/nginx/html/
COPY --chown=nginx:nginx knowledge.html /usr/share/nginx/html/
COPY --chown=nginx:nginx path.html /usr/share/nginx/html/
COPY --chown=nginx:nginx projects.html /usr/share/nginx/html/
COPY --chown=nginx:nginx workshop.html /usr/share/nginx/html/
COPY --chown=nginx:nginx blueprint.html /usr/share/nginx/html/
COPY --chown=nginx:nginx resources.html /usr/share/nginx/html/
COPY --chown=nginx:nginx README.md /usr/share/nginx/html/
COPY --chown=nginx:nginx css /usr/share/nginx/html/css
COPY --chown=nginx:nginx js /usr/share/nginx/html/js

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1

# 暴露端口
EXPOSE 80 443

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
