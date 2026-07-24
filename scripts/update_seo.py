#!/usr/bin/env python3
"""
Agent Academy - 批量 SEO 优化脚本
为每个 HTML 页面注入专属的 meta 标签、Open Graph、Twitter Card、JSON-LD
"""

import os
import re
from pathlib import Path

ROOT = Path(__file__).parent.parent  # agent-academy/

# 页面专属 SEO 数据
PAGES = {
    'index.html': {
        'title': 'Agent Academy · 系统化学习 AI Agent 的完整旅程',
        'description': '从认知基础到独立搭建大型 Agent 项目的一站式学习平台。整合 GitHub 顶级开源项目、权威论文、实践教程与完整蓝图,5 阶段完整学习周期(12-17 周)。',
        'keywords': 'AI Agent, LLM, LangChain, LangGraph, CrewAI, AutoGen, RAG, 人工智能, 机器学习, 智能体, Agent 教程, Agent 学习',
        'og_title': '从认知到代码 · 系统化 AI Agent 学习平台',
        'section': '首页',
        'position': 1,
    },
    'knowledge.html': {
        'title': '知识体系 · Agent Academy',
        'description': '系统化建立 AI Agent 的认知框架:6 大核心概念(LLM/Prompt/Function Calling/推理/记忆/规划)、4 大范式(ReAct/Plan-Execute/多 Agent/LangGraph)、交互式知识图谱。',
        'keywords': 'AI Agent 知识图谱, LLM 原理, ReAct, Plan-and-Execute, 多 Agent 系统, AI 学习路线',
        'og_title': 'Agent 心智地图 · 6 大核心 + 4 大范式',
        'section': '知识体系',
        'position': 2,
    },
    'path.html': {
        'title': '学习路径 · Agent Academy',
        'description': '五阶段完整学习周期(12-17 周):从认知基础、技能工具栈、项目搭建,到评估优化、独立交付大型 Agent 项目。每一阶段有明确的输入、输出与检验标准。',
        'keywords': 'AI Agent 学习路径, 学习路线图, 5 阶段, Agent 工程师, AI 培训',
        'og_title': '5 阶段完整学习路径 · 12-17 周 Agent 工程师成长',
        'section': '学习路径',
        'position': 3,
    },
    'projects.html': {
        'title': '开源项目库 · Agent Academy',
        'description': '精选 120+ AI Agent 顶级 GitHub 项目:LangChain、LangGraph、CrewAI、AutoGen、LlamaIndex、DSPy、Smolagents、MemGPT、MetaGPT 等。含项目筛选、对比、选型矩阵。',
        'keywords': 'GitHub AI Agent, LangChain, LangGraph, CrewAI, AutoGen, LlamaIndex, 开源项目, Agent 框架',
        'og_title': '120+ 精选 AI Agent 开源项目',
        'section': '开源项目',
        'position': 4,
    },
    'workshop.html': {
        'title': '实战工坊 · Agent Academy',
        'description': '40+ AI Agent 动手实验:从最小 100 行 ReAct 循环到完整大型 Agent 项目。包含可运行的代码骨架、运行步骤、扩展挑战。覆盖 LangChain/LangGraph/CrewAI/AutoGen 实操。',
        'keywords': 'AI Agent 实战, 动手实验, ReAct 实现, LangChain 教程, LangGraph 教程, 代码示例',
        'og_title': '40+ 动手实验 · 从 100 行代码到完整项目',
        'section': '实战工坊',
        'position': 5,
    },
    'blueprint.html': {
        'title': 'Agent 蓝图 · Agent Academy',
        'description': '完整大型 Agent 项目蓝图:五层架构(UX/编排/Agent/工具/基础设施)、核心模块设计、目录结构、生产级 pyproject.toml 依赖、Docker/Nginx 部署方案。',
        'keywords': 'Agent 架构, 大型项目蓝图, Agent 部署, LangGraph 状态机, 多 Agent 系统设计',
        'og_title': '大型 Agent 项目蓝图 · 五层架构 + 模块设计',
        'section': 'Agent 蓝图',
        'position': 6,
    },
    'resources.html': {
        'title': '资源中心 · Agent Academy',
        'description': 'AI Agent 学习资源合集:25 篇必读论文(ReAct/Reflexion/MemGPT/GraphRAG)、6 大在线课程、6 本核心书目、10+ 高质量社区、6+ Newsletter。',
        'keywords': 'AI Agent 论文, ReAct 论文, MemGPT, 推荐课程, Agent 社区, AI Newsletter',
        'og_title': '25 篇论文 + 6 门课程 + 10 个社区',
        'section': '资源中心',
        'position': 7,
    },
}

BASE_URL = 'https://roloria.github.io/agent-academy/'
OG_IMAGE = 'https://roloria.github.io/agent-academy/og-image.png'
SITE_NAME = 'Agent Academy'
AUTHOR = 'Roloria'
TWITTER_HANDLE = '@roloria'


def build_seo_block(page_file, data):
    """生成 SEO meta 注入块"""
    url = BASE_URL + (page_file if page_file != 'index.html' else '')
    title = data['title']
    desc = data['description']
    keywords = data['keywords']
    og_title = data['og_title']
    section = data['section']
    position = data['position']

    # JSON-LD 结构化数据 - Course 类型 + BreadcrumbList
    website_ld = '''<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Agent Academy",
  "alternateName": "Agent Academy · AI Agent 学习平台",
  "url": "https://roloria.github.io/agent-academy/",
  "description": "系统化学习 AI Agent 的完整旅程 · 从认知到独立搭建大型 Agent 项目",
  "inLanguage": "zh-CN",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://roloria.github.io/agent-academy/projects.html?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
</script>'''

    course_ld = f'''<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "{title}",
  "description": "{desc}",
  "provider": {{
    "@type": "Organization",
    "name": "Agent Academy",
    "sameAs": "https://github.com/Roloria/agent-academy"
  }},
  "url": "{url}",
  "image": "{OG_IMAGE}",
  "inLanguage": "zh-CN",
  "isAccessibleForFree": true,
  "hasCourseInstance": {{
    "@type": "CourseInstance",
    "courseMode": "online",
    "courseWorkload": "P12W"
  }},
  "offers": {{
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }}
}}
</script>
<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {{"@type": "ListItem", "position": 1, "name": "首页", "item": "{BASE_URL}"}},
    {{"@type": "ListItem", "position": {position}, "name": "{section}", "item": "{url}"}}
  ]
}}
</script>'''

    seo_block = f'''<!-- ========== SEO & Social ========== -->
<meta name="description" content="{desc}" />
<meta name="keywords" content="{keywords}" />
<meta name="author" content="{AUTHOR}" />
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
<meta name="googlebot" content="index, follow" />
<meta name="theme-color" content="#7c5cff" />
<meta name="color-scheme" content="dark light" />
<meta name="application-name" content="{SITE_NAME}" />
<meta name="apple-mobile-web-app-title" content="{SITE_NAME}" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="format-detection" content="telephone=no" />
<meta name="mobile-web-app-capable" content="yes" />

<!-- 多语言 -->
<link rel="alternate" hreflang="zh-CN" href="{url}" />
<link rel="alternate" hreflang="x-default" href="{url}" />

<!-- 规范化 URL -->
<link rel="canonical" href="{url}" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:title" content="{og_title}" />
<meta property="og:description" content="{desc}" />
<meta property="og:url" content="{url}" />
<meta property="og:site_name" content="{SITE_NAME}" />
<meta property="og:image" content="{OG_IMAGE}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Agent Academy - 系统化学习 AI Agent" />
<meta property="og:image:type" content="image/png" />
<meta property="og:locale" content="zh_CN" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="{TWITTER_HANDLE}" />
<meta name="twitter:creator" content="{TWITTER_HANDLE}" />
<meta name="twitter:title" content="{og_title}" />
<meta name="twitter:description" content="{desc}" />
<meta name="twitter:image" content="{OG_IMAGE}" />
<meta name="twitter:image:alt" content="Agent Academy - 系统化学习 AI Agent" />

<!-- Favicon & PWA -->
<link rel="icon" type="image/svg+xml" href="favicon.svg" />
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png" />
<link rel="manifest" href="site.webmanifest" />

<!-- Sitemap & RSS -->
<link rel="sitemap" type="application/xml" href="sitemap.xml" />

<!-- 结构化数据 -->
{website_ld}
{course_ld}
<!-- ========== END SEO ========== -->

'''
    return seo_block


def build_body_block():
    """生成 body 底部的分析脚本"""
    return '''<!-- ========== Analytics ========== -->
<script src="js/analytics.js"></script>
<!-- ========== END Analytics ========== -->

</body>'''


def update_html(filename, data):
    """更新单个 HTML 文件"""
    path = ROOT / filename
    if not path.exists():
        print(f"   ⚠️  {filename} 不存在, 跳过")
        return False

    content = path.read_text(encoding='utf-8')

    # 幂等检查
    if '<!-- ========== SEO & Social ========== -->' in content:
        print(f"   ⏭️  {filename} 已有 SEO 标签, 跳过")
        return False

    seo_block = build_seo_block(filename, data)

    if '<link rel="stylesheet" href="css/main.css">' in content:
        content = content.replace(
            '<link rel="stylesheet" href="css/main.css">',
            seo_block + '<link rel="stylesheet" href="css/main.css">'
        )
    else:
        print(f"   ⚠️  {filename} 找不到 CSS 链接")
        return False

    body_block = build_body_block()
    content = content.replace('</body>', body_block)

    path.write_text(content, encoding='utf-8')
    return True


def main():
    print("=" * 60)
    print("🎨 Agent Academy · SEO & Analytics 批量更新")
    print("=" * 60)

    success_count = 0
    for filename, data in PAGES.items():
        print(f"\n   📄 {filename}")
        if update_html(filename, data):
            print(f"      ✅ SEO meta + analytics 注入成功")
            print(f"      → 标题: {data['title'][:50]}...")
            print(f"      → 关键词: {len(data['keywords'].split(','))} 个")
            success_count += 1

    print("\n" + "=" * 60)
    print(f"🎉 完成! 共更新 {success_count}/{len(PAGES)} 个页面")
    print("=" * 60)


if __name__ == '__main__':
    main()
