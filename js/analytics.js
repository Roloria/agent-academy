/* ============================================================
   Agent Academy - 可配置 Analytics 系统
   默认无追踪 · 任选其一启用 · 不会破坏站点
   ============================================================

   🚀 快速启用 (推荐: Plausible)

   1. 前往 https://plausible.io 注册 (开源项目免费)
   2. 添加站点: roloria.github.io/agent-academy
   3. 编辑本文件, 取消注释 Plausible 那一段
   4. 完成! Plausible 会自动开始追踪, 无需 Cookie 横幅

   📊 选项:
   - Plausible   = https://plausible.io  (隐私友好 / 推荐)
   - Umami       = https://umami.is       (开源 / 自托管)
   - GA4         = https://analytics.google.com (最强大, 但需要 Cookie 同意)
   - GoatCounter = https://www.goatcounter.com (对开源免费)
   ============================================================ */

(function () {
  'use strict';

  // 配置区 - 取消注释要启用的那个

  const ANALYTICS_CONFIG = {
    enabled: false,         // ← 改成 true 启用分析
    provider: 'plausible',  // 'plausible' | 'umami' | 'ga4' | 'goatcounter'
    domain: 'roloria.github.io/agent-academy',

    // 特定于提供商的配置
    plausible: {
      scriptSrc: 'https://plausible.io/js/script.js'
    },
    umami: {
      // 在 https://cloud.umami.is 获取你的 Website ID
      websiteId: 'YOUR-UMAMI-WEBSITE-ID',
      scriptSrc: 'https://cloud.umami.is/script.js'
    },
    ga4: {
      // 在 Google Analytics 获取你的 Measurement ID (G-XXXXXXX)
      measurementId: 'G-XXXXXXXXXX'
    },
    goatcounter: {
      // 注册 https://www.goatcounter.com 后,填入你的 code
      code: 'YOUR-GOATCOUNTER-CODE'
    }
  };

  // 暴露到 window 方便调试
  window.AGENT_ACADEMY_CONFIG = ANALYTICS_CONFIG;

  if (!ANALYTICS_CONFIG.enabled) {
    console.log('[Analytics] 已禁用. 编辑 js/analytics.js 启用.');
    return;
  }

  const provider = ANALYTICS_CONFIG.provider;
  const domain = ANALYTICS_CONFIG.domain;

  // --- Plausible ---
  if (provider === 'plausible') {
    const script = document.createElement('script');
    script.defer = true;
    script.dataset.domain = domain;
    script.src = ANALYTICS_CONFIG.plausible.scriptSrc;
    document.head.appendChild(script);
    console.log('[Analytics] Plausible enabled for:', domain);
  }

  // --- Umami ---
  if (provider === 'umami') {
    const script = document.createElement('script');
    script.defer = true;
    script.dataset.websiteId = ANALYTICS_CONFIG.umami.websiteId;
    script.src = ANALYTICS_CONFIG.umami.scriptSrc;
    document.head.appendChild(script);
    console.log('[Analytics] Umami enabled:', ANALYTICS_CONFIG.umami.websiteId);
  }

  // --- Google Analytics 4 ---
  if (provider === 'ga4') {
    const id = ANALYTICS_CONFIG.ga4.measurementId;
    if (id && id.startsWith('G-')) {
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${id}');
      `;
      document.head.appendChild(script2);
      console.log('[Analytics] GA4 enabled:', id);
    } else {
      console.warn('[Analytics] GA4 ID 未配置或格式错误');
    }
  }

  // --- GoatCounter ---
  if (provider === 'goatcounter') {
    const script = document.createElement('script');
    script.defer = true;
    script.dataset.goatcounter = `https://${ANALYTICS_CONFIG.goatcounter.code}.goatcounter.com/count`;
    script.src = '//gc.zgo.at/count.js';
    document.head.appendChild(script);
    console.log('[Analytics] GoatCounter enabled:', ANALYTICS_CONFIG.goatcounter.code);
  }

  // 通用: 自动追踪 SPA 路由变化
  let lastPath = location.pathname;
  const observer = new MutationObserver(() => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      console.log('[Analytics] Page view:', lastPath);
      // Plausible 会在 pushState 时自动追踪
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

})();
