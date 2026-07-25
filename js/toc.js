/* ============================================================
   Agent Academy - 通用 TOC 系统
   自动检测标题、滚动联动、平滑跳转、进度条
   ============================================================ */

(function () {
  'use strict';

  class TableOfContents {
    /**
     * @param {Object} opts
     * @param {HTMLElement} opts.container - TOC 容器元素
     * @param {string} [opts.headingSelector='h2, h3, .toc-heading'] - 要收集的标题
     * @param {string} [opts.title='本页内容'] - TOC 标题
     * @param {string} [opts.scope] - 在哪个范围内搜索标题 (默认 document)
     * @param {number} [opts.smoothOffset=80] - 滚动后顶部偏移
     */
    constructor(opts = {}) {
      this.container = opts.container;
      this.headingSelector = opts.headingSelector || 'h2, h3';
      this.title = opts.title || '📑 本页内容';
      this.scope = opts.scope ? document.querySelector(opts.scope) : document;
      this.smoothOffset = opts.smoothOffset || 80;
      this.headings = [];
      this.links = [];
      this.activeId = null;
      this._observer = null;
    }

    /** 启动:检测标题,渲染 TOC,绑定行为 */
    init() {
      if (!this.container) return false;
      this.headings = Array.from(this.scope.querySelectorAll(this.headingSelector))
        .filter(h => !h.closest('[data-toc-skip]')) // 允许局部跳过
        .filter(h => this._isVisible(h));

      if (this.headings.length < 2) {
        this.container.style.display = 'none';
        return false;
      }

      this._ensureIds();
      this._render();
      this._setupScrollSpy();
      this._setupClick();
      this._setupReadingProgress();
      return true;
    }

    /** 给没有 id 的标题自动生成稳定 id */
    _ensureIds() {
      const used = new Set();
      this.headings.forEach((h, i) => {
        if (!h.id) {
          h.id = this._slugify(h.textContent + ' ' + (i + 1));
        }
        // 防冲突
        let id = h.id;
        let n = 2;
        while (used.has(id)) id = h.id + '-' + (n++);
        used.add(id);
        h.id = id;
      });
    }

    /** 渲染 TOC 列表 */
    _render() {
      const wrap = document.createElement('div');
      wrap.className = 'toc-wrap';

      const header = document.createElement('div');
      header.className = 'toc-header';
      header.innerHTML = `<span class="toc-header-text">${this._escape(this.title)}</span><span class="toc-progress">0%</span>`;
      wrap.appendChild(header);

      const progressBar = document.createElement('div');
      progressBar.className = 'toc-progress-bar';
      wrap.appendChild(progressBar);

      const nav = document.createElement('nav');
      nav.className = 'toc-nav';
      const ul = document.createElement('ul');
      ul.className = 'toc-list';

      this.headings.forEach(h => {
        const li = document.createElement('li');
        li.className = 'toc-item toc-' + h.tagName.toLowerCase();
        const a = document.createElement('a');
        a.href = '#' + h.id;
        a.textContent = this._cleanText(h.textContent);
        a.dataset.targetId = h.id;
        li.appendChild(a);
        ul.appendChild(li);
      });

      nav.appendChild(ul);
      wrap.appendChild(nav);
      this.container.appendChild(wrap);
      this.links = Array.from(this.container.querySelectorAll('a'));
      this.progressEl = this.container.querySelector('.toc-progress');
      this.progressBarEl = this.container.querySelector('.toc-progress-bar');
    }

    /** 滚动监听:高亮当前 section 并更新进度 */
    _setupScrollSpy() {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this._setActive(entry.target.id);
          }
        });
      }, {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0
      });

      this.headings.forEach(h => observer.observe(h));

      // 备份:监听滚动位置(避免 IntersectionObserver 不太灵敏)
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            this._updateActiveByScroll();
            this._updateProgress();
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });

      // 初次更新
      this._updateActiveByScroll();
      this._updateProgress();
    }

    _setActive(id) {
      if (this.activeId === id) return;
      this.activeId = id;
      this.links.forEach(a => {
        const isActive = a.dataset.targetId === id;
        a.classList.toggle('active', isActive);
        if (isActive) {
          // 把活跃项滚动到 TOC 视野内
          const rect = a.getBoundingClientRect();
          const tocRect = this.container.getBoundingClientRect();
          if (rect.top < tocRect.top || rect.bottom > tocRect.bottom) {
            a.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      });
    }

    _updateActiveByScroll() {
      const fromTop = this.smoothOffset + 20;
      let current = this.headings[0];
      for (const h of this.headings) {
        const r = h.getBoundingClientRect();
        if (r.top <= fromTop) current = h;
        else break;
      }
      if (current) this._setActive(current.id);
    }

    _updateProgress() {
      if (!this.progressEl || !this.progressBarEl) return;
      const doc = document.documentElement;
      const total = (doc.scrollHeight - window.innerHeight) || 1;
      const scrolled = Math.min(Math.max(window.scrollY / total, 0), 1);
      const pct = Math.round(scrolled * 100);
      this.progressEl.textContent = pct + '%';
      this.progressBarEl.style.width = pct + '%';
    }

    /** 点击平滑跳转 */
    _setupClick() {
      this.links.forEach(a => {
        a.addEventListener('click', e => {
          e.preventDefault();
          const id = a.dataset.targetId;
          const target = document.getElementById(id);
          if (!target) return;
          const top = target.getBoundingClientRect().top + window.scrollY - this.smoothOffset;
          window.scrollTo({ top, behavior: 'smooth' });
          history.replaceState(null, '', '#' + id);
          this._setActive(id);
        });
      });
    }

    /** 顶部进度条 */
    _setupReadingProgress() {
      // 已包含在 _setupScrollSpy 中
    }

    _isVisible(h) {
      // 跳过被隐藏的、以及在 hero 区中的
      if (h.offsetParent === null && getComputedStyle(h).display === 'none') return false;
      const rect = h.getBoundingClientRect();
      if (rect.height === 0) return false;
      // 跳过视口外的(尚未生成的)
      return true;
    }

    _cleanText(text) {
      return (text || '').trim().replace(/\s+/g, ' ').slice(0, 70);
    }

    _escape(s) {
      return String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      }[c]));
    }

    _slugify(text) {
      // 中英混合,简化为短 hash
      let s = (text || '').trim().toLowerCase();
      // 保留中文 + 字母 + 数字,转空格为横线
      s = s.replace(/[\s/\\#?,!@#$%^&*()_+=\[\]{}|]/g, '-');
      s = s.replace(/-+/g, '-').replace(/^-+|-+$/g, '');
      s = s.slice(0, 40);
      // 加随机后缀防止冲突
      return s + '-' + Math.random().toString(36).slice(2, 6);
    }
  }

  window.TableOfContents = TableOfContents;

  // 自动初始化:页面有 <aside id="toc"> 时自动启动
  document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('[data-toc], #toc, .toc-container');
    containers.forEach(container => {
      // 配置
      const opts = {
        container,
        title: container.dataset.tocTitle || container.dataset.tocTitle || '📑 本页内容',
        scope: container.dataset.tocScope || null,
        headingSelector: container.dataset.tocHeadings || 'h2, h3',
      };
      const toc = new TableOfContents(opts);
      toc.init();
      container.tocInstance = toc;
    });
  });

})();
