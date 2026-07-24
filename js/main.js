/* ============================================================
   Agent Academy - 主要交互脚本
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. 移动端导航切换
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // 2. 当前页高亮 (基于路径)
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // 3. 滚动渐入动画
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.anim-on-scroll').forEach(el => observer.observe(el));

  // 4. Tab 切换
  document.querySelectorAll('[data-tab-group]').forEach(group => {
    const tabs = group.querySelectorAll('.tab');
    const panels = group.querySelectorAll('.tab-panel');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        group.querySelector(`#${target}`)?.classList.add('active');
      });
    });
  });

  // 5. 过滤按钮
  document.querySelectorAll('[data-filter-group]').forEach(group => {
    const pills = group.querySelectorAll('.filter-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        const target = pill.dataset.filter;
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const targetContainer = document.querySelector(pill.dataset.target);
        if (!targetContainer) return;
        const items = targetContainer.querySelectorAll('[data-tags]');
        items.forEach(item => {
          const tags = item.dataset.tags.split(' ');
          if (target === 'all' || tags.includes(target)) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  });

  // 6. 搜索过滤
  document.querySelectorAll('[data-search]').forEach(input => {
    input.addEventListener('input', e => {
      const query = e.target.value.toLowerCase().trim();
      const target = document.querySelector(input.dataset.target);
      if (!target) return;
      const items = target.querySelectorAll('[data-name]');
      items.forEach(item => {
        const text = item.dataset.name.toLowerCase();
        const desc = (item.dataset.desc || '').toLowerCase();
        if (!query || text.includes(query) || desc.includes(query)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 7. 学习清单勾选
  document.querySelectorAll('.checklist li').forEach(li => {
    li.addEventListener('click', () => li.classList.toggle('done'));
  });

  // 8. 平滑滚动
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // 9. 复制代码按钮
  document.querySelectorAll('.code-block').forEach(block => {
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = '复制';
    btn.style.cssText = 'padding:6px 12px;font-size:0.78rem;background:transparent;border:1px solid var(--border);border-radius:6px;color:var(--text-2);cursor:pointer;';
    btn.addEventListener('click', () => {
      const code = block.querySelector('pre code')?.textContent || block.querySelector('pre')?.textContent || '';
      navigator.clipboard.writeText(code).then(() => {
        btn.textContent = '✓ 已复制';
        setTimeout(() => btn.textContent = '复制', 1800);
      });
    });
    block.querySelector('.code-header')?.appendChild(btn);
  });

  // 10. 进度条动画
  document.querySelectorAll('.progress-fill[data-progress]').forEach(el => {
    const target = parseInt(el.dataset.progress, 10);
    setTimeout(() => { el.style.width = target + '%'; el.style.transition = 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)'; }, 200);
  });
});
