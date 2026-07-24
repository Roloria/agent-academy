#!/usr/bin/env bash
# ============================================================
# Agent Academy 一键部署脚本
# 用法: ./deploy.sh [github|docker|netlify|vercel]
# ============================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

PROJECT_NAME="Agent Academy"

print_header() {
  echo ""
  echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║   🚀 $PROJECT_NAME 部署助手                       ║${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
  echo ""
}

check_git() {
  if [ ! -d .git ]; then
    echo -e "${YELLOW}⚠️  未检测到 git 仓库，正在初始化...${NC}"
    git init
    git config user.email "deploy@agent-academy.local" 2>/dev/null || true
    git config user.name "Agent Academy Bot" 2>/dev/null || true
    echo -e "${GREEN}✅ Git 仓库已初始化${NC}"
  fi
}

deploy_github() {
  print_header
  echo -e "${GREEN}📦 GitHub Pages 部署流程${NC}"
  echo ""

  check_git

  # 检查是否已有远程仓库
  REMOTE=$(git remote get-url origin 2>/dev/null || echo "")

  if [ -z "$REMOTE" ]; then
    echo -e "${YELLOW}📝 第一步: 在 GitHub 创建仓库${NC}"
    echo "   访问 https://github.com/new 创建新仓库"
    echo "   仓库名建议: agent-academy"
    echo "   不要勾选 'Add a README', 'Add .gitignore', 'Choose a license'"
    echo ""
    read -p "📋 输入你的仓库地址 (https://github.com/用户名/仓库名.git): " REPO_URL

    if [ -z "$REPO_URL" ]; then
      echo -e "${RED}❌ 未提供仓库地址,退出${NC}"
      exit 1
    fi

    git remote add origin "$REPO_URL"
    echo -e "${GREEN}✅ 已添加远程仓库${NC}"
  fi

  # 切换到 main 分支
  git branch -M main 2>/dev/null || git checkout -b main

  # 添加并提交
  echo ""
  echo -e "${BLUE}📂 添加并提交文件...${NC}"
  git add .

  if git diff --cached --quiet; then
    echo -e "${YELLOW}没有变更需要提交${NC}"
  else
    git commit -m "🚀 Deploy: Agent Academy v1.0.0

✨ Features:
- 7 fully-designed pages (homepage, knowledge, path, projects, workshop, blueprint, resources)
- Modern responsive design with dark theme
- Interactive JavaScript (tabs, filters, search)
- Mermaid diagrams for knowledge graphs
- Production-ready deployment config

📚 Content Coverage:
- 5-phase learning cycle (12-17 weeks)
- 120+ curated GitHub projects
- 40+ hands-on experiments
- 25 must-read papers
- 6 courses + 6 books + 10+ communities
- Complete blueprint for large Agent projects"

    echo -e "${GREEN}✅ 已提交${NC}"
  fi

  # 推送
  echo ""
  echo -e "${BLUE}🚀 推送到 GitHub...${NC}"
  git push -u origin main

  echo ""
  echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║  ✅ 推送成功!                                     ║${NC}"
  echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
  echo ""
  echo -e "${YELLOW}📝 最后一步 - 启用 GitHub Pages:${NC}"
  echo "   1. 打开 https://github.com/$(basename $(git remote get-url origin) .git)/settings/pages"
  echo "   2. 在 'Build and deployment' 中:"
  echo "      - Source: 选择 'GitHub Actions'"
  echo "   3. 等待 30-60 秒,部署自动开始"
  echo ""
  echo -e "${BLUE}🌐 部署完成后访问:${NC}"
  USERNAME=$(git remote get-url origin | sed -E 's/.*github.com[:/]([^/]+)\/.*/\1/')
  REPONAME=$(basename $(git remote get-url origin) .git)
  echo -e "   ${GREEN}https://${USERNAME}.github.io/${REPONAME}/${NC}"
}

deploy_docker() {
  print_header
  echo -e "${GREEN}🐳 Docker 部署流程${NC}"
  echo ""

  # 检查 Docker
  if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ 未安装 Docker${NC}"
    echo "请先安装 Docker: https://www.docker.com/get-docker"
    exit 1
  fi

  echo -e "${BLUE}🔨 构建镜像...${NC}"
  docker build -t agent-academy:latest .

  echo -e "${BLUE}🚀 启动容器...${NC}"
  docker-compose up -d

  echo ""
  echo -e "${GREEN}✅ 部署完成!${NC}"
  echo -e "${BLUE}🌐 访问: http://localhost/${NC}"
  echo ""
  echo -e "${YELLOW}常用命令:${NC}"
  echo "  docker-compose logs -f     # 查看日志"
  echo "  docker-compose stop        # 停止"
  echo "  docker-compose restart     # 重启"
  echo "  docker-compose down        # 销毁"
}

deploy_netlify() {
  print_header
  echo -e "${GREEN}▲ Netlify 部署${NC}"
  echo ""
  echo -e "${YELLOW}方案 A: 拖拽部署 (最快)${NC}"
  echo "1. 访问 https://app.netlify.com/drop"
  echo "2. 直接将整个项目文件夹拖入页面"
  echo "3. 几秒钟后获得 URL: https://xxx.netlify.app"
  echo ""
  echo -e "${YELLOW}方案 B: GitHub 集成 (推荐)${NC}"
  echo "1. 将代码推送到 GitHub (运行 ./deploy.sh github)"
  echo "2. 访问 https://app.netlify.com"
  echo "3. 点击 'Add new site' -> 'Import existing project'"
  echo "4. 选择你的 GitHub 仓库"
  echo "5. 保持默认配置,点击 'Deploy site'"
}

deploy_vercel() {
  print_header
  echo -e "${GREEN}▲ Vercel 部署${NC}"
  echo ""
  echo -e "${YELLOW}方案 A: CLI 一键部署${NC}"
  if command -v vercel &> /dev/null; then
    vercel --prod
  else
    echo "安装 Vercel CLI: npm i -g vercel"
    echo "然后运行: vercel --prod"
  fi
  echo ""
  echo -e "${YELLOW}方案 B: GitHub 集成${NC}"
  echo "1. 推送到 GitHub"
  echo "2. 访问 https://vercel.com/new"
  echo "3. 导入仓库"
  echo "4. 保持默认配置,点击 'Deploy'"
}

show_help() {
  print_header
  echo -e "${BLUE}用法:${NC}"
  echo "  ./deploy.sh [目标]"
  echo ""
  echo -e "${BLUE}可用目标:${NC}"
  echo -e "  ${GREEN}github${NC}   部署到 GitHub Pages (推荐)"
  echo -e "  ${GREEN}docker${NC}   用 Docker 部署到自己的服务器"
  echo -e "  ${GREEN}netlify${NC}  部署到 Netlify"
  echo -e "  ${GREEN}vercel${NC}   部署到 Vercel"
  echo ""
  echo -e "${BLUE}示例:${NC}"
  echo "  ./deploy.sh github"
  echo ""
}

# 主流程
case "${1:-help}" in
  github|gh)
    deploy_github
    ;;
  docker)
    deploy_docker
    ;;
  netlify)
    deploy_netlify
    ;;
  vercel)
    deploy_vercel
    ;;
  help|--help|-h|*)
    show_help
    ;;
esac
