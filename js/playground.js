/* ============================================================
   Agent Academy - Playground 核心逻辑
   多 Provider · 流式输出 · 工具调用 · 本地存储
   ============================================================ */

(function () {
  'use strict';

  // ============== Provider 配置 ==============
  const PROVIDERS = {
    openai: {
      name: 'OpenAI',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
      defaultModel: 'gpt-4o-mini',
      keyHint: 'OpenAI key 以 sk- 开头',
      supportsTools: true,
      formatRequest: (msgs, model, stream, tools, opts) => ({
        method: 'POST',
        url: 'https://api.openai.com/v1/chat/completions',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${opts.apiKey}`
        },
        body: { model, messages: msgs, stream, ...(opts.temperature !== undefined && { temperature: opts.temperature }), ...(opts.max_tokens && { max_tokens: opts.max_tokens }), ...(tools.length > 0 && { tools }) }
      }),
      parseStream: (chunk) => {
        try {
          const data = JSON.parse(chunk);
          return data.choices?.[0]?.delta?.content || '';
        } catch { return ''; }
      }
    },
    deepseek: {
      name: 'DeepSeek',
      endpoint: 'https://api.deepseek.com/v1/chat/completions',
      models: ['deepseek-chat', 'deepseek-reasoner', 'deepseek-coder'],
      defaultModel: 'deepseek-chat',
      keyHint: 'DeepSeek key 以 sk- 开头',
      supportsTools: true,
      formatRequest: (msgs, model, stream, tools, opts) => ({
        method: 'POST',
        url: 'https://api.deepseek.com/v1/chat/completions',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${opts.apiKey}`
        },
        body: { model, messages: msgs, stream, ...(opts.temperature !== undefined && { temperature: opts.temperature }), ...(opts.max_tokens && { max_tokens: opts.max_tokens }), ...(tools.length > 0 && { tools }) }
      }),
      parseStream: (chunk) => {
        try {
          const data = JSON.parse(chunk);
          return data.choices?.[0]?.delta?.content || '';
        } catch { return ''; }
      }
    },
    openrouter: {
      name: 'OpenRouter',
      endpoint: 'https://openrouter.ai/api/v1/chat/completions',
      models: ['openai/gpt-4o-mini', 'anthropic/claude-3.5-sonnet', 'google/gemini-pro-1.5', 'meta-llama/llama-3.1-70b-instruct'],
      defaultModel: 'openai/gpt-4o-mini',
      keyHint: '在 openrouter.ai 获取',
      supportsTools: true,
      formatRequest: (msgs, model, stream, tools, opts) => ({
        method: 'POST',
        url: 'https://openrouter.ai/api/v1/chat/completions',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${opts.apiKey}`,
          'HTTP-Referer': location.origin,
          'X-Title': 'Agent Academy Playground'
        },
        body: { model, messages: msgs, stream, ...(opts.temperature !== undefined && { temperature: opts.temperature }), ...(opts.max_tokens && { max_tokens: opts.max_tokens }), ...(tools.length > 0 && { tools }) }
      }),
      parseStream: (chunk) => {
        try {
          const data = JSON.parse(chunk);
          return data.choices?.[0]?.delta?.content || '';
        } catch { return ''; }
      }
    },
    groq: {
      name: 'Groq',
      endpoint: 'https://api.groq.com/openai/v1/chat/completions',
      models: ['llama-3.1-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
      defaultModel: 'llama-3.1-70b-versatile',
      keyHint: '在 console.groq.com 获取',
      supportsTools: true,
      formatRequest: (msgs, model, stream, tools, opts) => ({
        method: 'POST',
        url: 'https://api.groq.com/openai/v1/chat/completions',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${opts.apiKey}`
        },
        body: { model, messages: msgs, stream, ...(opts.temperature !== undefined && { temperature: opts.temperature }), ...(opts.max_tokens && { max_tokens: opts.max_tokens }), ...(tools.length > 0 && { tools }) }
      }),
      parseStream: (chunk) => {
        try {
          const data = JSON.parse(chunk);
          return data.choices?.[0]?.delta?.content || '';
        } catch { return ''; }
      }
    },
    anthropic: {
      name: 'Anthropic',
      endpoint: 'https://api.anthropic.com/v1/messages',
      models: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229'],
      defaultModel: 'claude-3-5-sonnet-20241022',
      keyHint: 'Anthropic key 以 sk-ant- 开头 (注意: 直接浏览器调用需 CORS 配置)',
      supportsTools: true,
      // 注意: Anthropic 的 API 不直接支持浏览器 CORS,会失败
      // 为了完整性仍然实现,但会提示错误
      formatRequest: (msgs, model, stream, tools, opts) => ({
        method: 'POST',
        url: 'https://api.anthropic.com/v1/messages',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': opts.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: {
          model,
          messages: msgs.filter(m => m.role !== 'system'),
          system: msgs.find(m => m.role === 'system')?.content,
          stream, max_tokens: opts.max_tokens || 4096,
          ...(opts.temperature !== undefined && { temperature: opts.temperature })
        }
      }),
      parseStream: (chunk) => {
        try {
          const data = JSON.parse(chunk);
          if (data.type === 'content_block_delta') {
            return data.delta?.text || '';
          }
        } catch { return ''; }
        return '';
      }
    },
    ollama: {
      name: 'Ollama (本地)',
      endpoint: 'http://localhost:11434/v1/chat/completions',
      models: ['llama3.2', 'qwen2.5', 'gemma2', 'mistral', 'codellama'],
      defaultModel: 'llama3.2',
      keyHint: '本地无需 key, 需先启动 Ollama (ollama serve)',
      supportsTools: false,
      formatRequest: (msgs, model, stream, tools, opts) => ({
        method: 'POST',
        url: (opts.baseUrl || 'http://localhost:11434/v1') + '/chat/completions',
        headers: { 'Content-Type': 'application/json' },
        body: { model, messages: msgs, stream, ...(opts.temperature !== undefined && { temperature: opts.temperature }) }
      }),
      parseStream: (chunk) => {
        try {
          const data = JSON.parse(chunk);
          return data.choices?.[0]?.delta?.content || data.message?.content || '';
        } catch { return ''; }
      }
    },
    custom: {
      name: '自定义',
      endpoint: '',
      models: ['custom-model'],
      defaultModel: 'custom-model',
      keyHint: '填入兼容 OpenAI 格式的 API Key',
      supportsTools: true,
      formatRequest: (msgs, model, stream, tools, opts) => ({
        method: 'POST',
        url: (opts.baseUrl || '').replace(/\/$/, '') + '/chat/completions',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${opts.apiKey}`
        },
        body: { model, messages: msgs, stream, ...(opts.temperature !== undefined && { temperature: opts.temperature }), ...(opts.max_tokens && { max_tokens: opts.max_tokens }), ...(tools.length > 0 && { tools }) }
      }),
      parseStream: (chunk) => {
        try {
          const data = JSON.parse(chunk);
          return data.choices?.[0]?.delta?.content || '';
        } catch { return ''; }
      }
    }
  };

  // ============== 内置工具 ==============
  const BUILTIN_TOOLS = [
    {
      name: 'get_current_time',
      description: '获取当前的日期和时间,当你需要知道"现在几点"或"今天星期几"时调用',
      parameters: { type: 'object', properties: { timezone: { type: 'string', description: 'IANA 时区, 如 Asia/Shanghai, 可选' } }, required: [] },
      execute: (args) => {
        const tz = args.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
        const now = new Date();
        const fmt = new Intl.DateTimeFormat('zh-CN', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', weekday: 'long', hour12: false });
        return `当前时间 (${tz}): ${fmt.format(now)}`;
      }
    },
    {
      name: 'calculate',
      description: '执行数学运算,支持 + - * / ^ () 和常见数学函数 (sqrt, sin, cos, log, abs, max, min 等)',
      parameters: { type: 'object', properties: { expression: { type: 'string', description: '数学表达式, 如 "2^10 + sqrt(144)"' } }, required: ['expression'] },
      execute: (args) => {
        try {
          const safe = args.expression.replace(/[^0-9+\-*/^().,\s]|sin|cos|tan|sqrt|log|abs|max|min|pow|exp|PI/g, m => {
            const allowed = 'sin|cos|tan|sqrt|log|abs|max|min|pow|exp|PI'.split('|');
            if (allowed.includes(m)) return `Math.${m === 'PI' ? 'PI' : m}`;
            return '';
          });
          // eslint-disable-next-line no-new-func
          const result = Function('"use strict";return (' + args.expression.replace(/\^/g, '**') + ')')();
          return `${args.expression} = ${result}`;
        } catch (e) {
          return `计算错误: ${e.message}`;
        }
      }
    },
    {
      name: 'random_number',
      description: '生成指定范围内的随机整数',
      parameters: { type: 'object', properties: { min: { type: 'number', description: '最小值, 默认 0' }, max: { type: 'number', description: '最大值, 默认 100' } }, required: [] },
      execute: (args) => {
        const min = args.min ?? 0;
        const max = args.max ?? 100;
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
    },
    {
      name: 'text_reverse',
      description: '将文本反转,用于演示字符串处理',
      parameters: { type: 'object', properties: { text: { type: 'string', description: '要反转的文本' } }, required: ['text'] },
      execute: (args) => args.text.split('').reverse().join('')
    },
    {
      name: 'word_count',
      description: '统计文本的字数、词数、行数',
      parameters: { type: 'object', properties: { text: { type: 'string', description: '要统计的文本' } }, required: ['text'] },
      execute: (args) => {
        const t = args.text;
        return `字数: ${t.length} | 中文字数: ${(t.match(/[\u4e00-\u9fa5]/g) || []).length} | 行数: ${t.split('\n').length}`;
      }
    },
    {
      name: 'json_format',
      description: '格式化 JSON 字符串,使其更易读',
      parameters: { type: 'object', properties: { json: { type: 'string', description: '要格式化的 JSON 字符串' } }, required: ['json'] },
      execute: (args) => {
        try {
          return JSON.stringify(JSON.parse(args.json), null, 2);
        } catch (e) { return `JSON 解析错误: ${e.message}`; }
      }
    }
  ];

  // ============== 状态 ==============
  let STATE = {
    provider: 'openai',
    apiKey: '',
    baseUrl: '',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 2048,
    systemPrompt: '',
    enabledTools: new Set(),
    messages: [],
    isStreaming: false,
    totalTokens: 0
  };

  const STORAGE_KEY = 'agent-academy-playground';

  // ============== DOM ==============
  const $ = (id) => document.getElementById(id);

  function loadSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      Object.assign(STATE, saved);
      // Convert enabledTools array back to Set
      if (Array.isArray(saved.enabledTools)) {
        STATE.enabledTools = new Set(saved.enabledTools);
      }
    } catch (e) {
      console.warn('加载本地设置失败:', e);
    }
  }

  function saveSettings(persistent = true) {
    const data = {
      ...STATE,
      enabledTools: Array.from(STATE.enabledTools)
    };
    if (persistent) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }

  function clearAllSettings() {
    if (!confirm('确定要清除所有 API Key 和配置吗? 这将删除本地保存的所有数据。')) return;
    localStorage.removeItem(STORAGE_KEY);
    STATE.apiKey = '';
    STATE.enabledTools = new Set();
    render();
    document.getElementById('setupModal').classList.remove('open');
  }

  // ============== 渲染 ==============
  function render() {
    // 状态
    const configured = STATE.apiKey && STATE.provider;
    const statusBox = $('statusBox');
    const dot = statusBox.querySelector('.pg-status-dot');
    const text = $('statusText');
    if (configured) {
      dot.className = 'pg-status-dot ready';
      text.textContent = `已连接 ${PROVIDERS[STATE.provider]?.name || STATE.provider}`;
    } else {
      dot.className = 'pg-status-dot';
      text.textContent = '未配置 API Key';
    }

    // Provider 选项
    $('providerSelect').value = STATE.provider;

    // 模型
    updateModelSelect();

    // 温度
    $('temperature').value = STATE.temperature;
    $('temperatureVal').textContent = STATE.temperature;
    $('maxTokens').value = STATE.maxTokens;

    // 系统提示
    $('systemPrompt').value = STATE.systemPrompt;

    // Key 提示
    const keyHint = $('keyHint');
    keyHint.textContent = PROVIDERS[STATE.provider]?.keyHint || '';

    // 显示 / 隐藏 baseUrl
    const isCustom = STATE.provider === 'custom' || STATE.provider === 'ollama';
    $('baseUrlLabel').style.display = isCustom ? 'block' : 'none';
    $('baseUrl').style.display = isCustom ? 'block' : 'none';
    if (STATE.baseUrl) $('baseUrl').value = STATE.baseUrl;

    // 工具列表
    renderTools();

    // 状态栏
    const sp = $('statProvider');
    sp.textContent = configured ? `${PROVIDERS[STATE.provider]?.name} · ${STATE.model}` : '尚未连接';
    $('statTokens').textContent = `Tokens: ${STATE.totalTokens}`;

    // 加载预设
    renderSavedPresets();

    // Key 输入框 (这里不安全显示,只在未设置时显示空)
    if (!$('apiKey').dataset.touched) {
      $('apiKey').value = STATE.apiKey || '';
    }
  }

  function renderTools() {
    const list = $('toolsList');
    list.innerHTML = '';
    BUILTIN_TOOLS.forEach(tool => {
      const enabled = STATE.enabledTools.has(tool.name);
      const div = document.createElement('div');
      div.className = 'pg-tool-item' + (enabled ? ' enabled' : '');
      div.innerHTML = `
        <input type="checkbox" ${enabled ? 'checked' : ''} onchange="toggleTool('${tool.name}', this.checked)">
        <div style="flex: 1;">
          <div class="pg-tool-name">${tool.name}</div>
          <div class="pg-tool-desc">${tool.description}</div>
        </div>
      `;
      list.appendChild(div);
    });
    $('toolsCount').textContent = `${STATE.enabledTools.size} 已启用`;
  }

  function renderSavedPresets() {
    const presets = JSON.parse(localStorage.getItem(STORAGE_KEY + '-presets') || '[]');
    const container = $('savedPresets');
    if (presets.length === 0) {
      container.innerHTML = '<div style="font-size: 0.78rem; color: var(--text-4); font-style: italic;">没有保存的预设</div>';
      return;
    }
    container.innerHTML = '<div style="font-size: 0.78rem; color: var(--text-3); margin-bottom: 6px;">已保存的预设:</div>';
    presets.forEach((p, i) => {
      const btn = document.createElement('div');
      btn.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:6px 10px;background:var(--bg-2);border:1px solid var(--border);border-radius:6px;margin-bottom:4px;font-size:0.82rem;';
      btn.innerHTML = `
        <span style="cursor:pointer;flex:1;" onclick="loadPreset(${i})">⭐ ${p.name}</span>
        <span style="cursor:pointer;color:var(--brand-6);padding-left:8px;" onclick="deletePreset(${i})">×</span>
      `;
      container.appendChild(btn);
    });
  }

  function renderMessages() {
    const container = $('messages');
    const emptyState = $('emptyState');
    if (STATE.messages.length === 0) {
      emptyState.style.display = 'flex';
      // 移除其他消息
      Array.from(container.querySelectorAll('.pg-msg')).forEach(el => el.remove());
      return;
    }
    emptyState.style.display = 'none';

    // 简化: 重新渲染所有消息
    Array.from(container.querySelectorAll('.pg-msg')).forEach(el => el.remove());
    STATE.messages.forEach(msg => {
      const div = document.createElement('div');
      div.className = `pg-msg ${msg.role}`;
      let content = '';
      let meta = '';
      if (msg.role === 'tool_call') {
        content = `<span class="tool-call-name">🔧 调用工具: ${msg.tool}</span>\n<pre>${escapeHtml(JSON.stringify(msg.args, null, 2))}</pre>`;
        meta = `<div class="pg-msg-meta">工具调用 · ${new Date(msg.timestamp).toLocaleTimeString()}</div>`;
      } else if (msg.role === 'tool_result') {
        content = `<span class="tool-call-name">↩ 工具返回:</span>\n<pre>${escapeHtml(msg.content)}</pre>`;
        meta = `<div class="pg-msg-meta">工具返回 · ${new Date(msg.timestamp).toLocaleTimeString()}</div>`;
      } else {
        content = formatMarkdown(msg.content);
        meta = `<div class="pg-msg-meta">${msg.role === 'user' ? '你' : 'AI'} · ${new Date(msg.timestamp).toLocaleTimeString()}</div>`;
      }
      const avatar = msg.role === 'user' ? '你' : msg.role === 'tool_call' ? '🔧' : msg.role === 'tool_result' ? '↩' : 'AI';
      div.innerHTML = `
        <div class="pg-msg-avatar">${avatar}</div>
        <div style="display: flex; flex-direction: column; max-width: 80%; ${msg.role === 'user' ? 'align-items: flex-end;' : ''}">
          <div class="pg-msg-bubble">${content}</div>
          ${meta}
        </div>
      `;
      container.appendChild(div);
    });
    container.scrollTop = container.scrollHeight;
  }

  // 简易 Markdown 渲染 (代码块、粗体)
  function formatMarkdown(text) {
    return escapeHtml(text)
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code style="background:var(--bg-1);padding:1px 5px;border-radius:3px;font-family:monospace;font-size:0.88em;">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }

  // ============== 交互 ==============
  function updateModelSelect() {
    const sel = $('modelSelect');
    const provider = PROVIDERS[STATE.provider];
    if (!provider) return;
    sel.innerHTML = '';
    provider.models.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      sel.appendChild(opt);
    });
    if (!provider.models.includes(STATE.model)) {
      STATE.model = provider.defaultModel;
    }
    sel.value = STATE.model;
  }

  function updateProvider() {
    STATE.provider = $('providerSelect').value;
    const provider = PROVIDERS[STATE.provider];
    if (provider) {
      STATE.model = provider.defaultModel;
    }
    render();
  }

  function setSystemPrompt(prompt) {
    STATE.systemPrompt = prompt;
    $('systemPrompt').value = prompt;
    saveSettings();
  }

  function setAgentPrompt() {
    const prompt = `你是一个自主 Agent。当用户问题需要超出你知识范围的信息（实时数据、计算、具体操作）时，主动调用可用工具解决问题。永远不要假设工具的结果，直接调用工具获取准确答案。`;
    setSystemPrompt(prompt);
    // 自动开启至少 1 个工具
    if (STATE.enabledTools.size === 0) {
      STATE.enabledTools.add('get_current_time');
      STATE.enabledTools.add('calculate');
      renderTools();
      saveSettings();
    }
  }

  function resetSystemPrompt() {
    if (!confirm('重置系统提示词?')) return;
    setSystemPrompt('');
  }

  function toggleTool(name, enabled) {
    if (enabled) STATE.enabledTools.add(name);
    else STATE.enabledTools.delete(name);
    renderTools();
    saveSettings();
  }

  function saveSettingsFromUI() {
    STATE.apiKey = $('apiKey').value.trim();
    STATE.baseUrl = $('baseUrl').value.trim();
    STATE.provider = $('providerSelect').value;
    saveSettings();
    render();
    document.getElementById('setupModal').classList.remove('open');
    addSystemMessage('✅ 配置已保存! 现在可以开始对话了');
  }

  function clearConversation() {
    if (!confirm('清空所有对话历史?')) return;
    STATE.messages = [];
    renderMessages();
  }

  function exportConversation() {
    const text = STATE.messages.map(m => {
      const role = m.role === 'user' ? '用户' : m.role === 'tool_call' ? `工具调用 [${m.tool}]` : m.role === 'tool_result' ? '工具返回' : 'AI';
      const content = m.content || JSON.stringify(m.args);
      return `[${new Date(m.timestamp).toLocaleString()}] ${role}:\n${content}\n---`;
    }).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent-conversation-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function savePreset() {
    const name = prompt('为这个预设起个名字:');
    if (!name) return;
    const presets = JSON.parse(localStorage.getItem(STORAGE_KEY + '-presets') || '[]');
    presets.push({
      name,
      provider: STATE.provider,
      model: STATE.model,
      temperature: STATE.temperature,
      systemPrompt: STATE.systemPrompt,
      enabledTools: Array.from(STATE.enabledTools)
    });
    localStorage.setItem(STORAGE_KEY + '-presets', JSON.stringify(presets));
    renderSavedPresets();
  }

  function loadPreset(i) {
    const presets = JSON.parse(localStorage.getItem(STORAGE_KEY + '-presets') || '[]');
    const p = presets[i];
    if (!p) return;
    STATE.provider = p.provider;
    STATE.model = p.model;
    STATE.temperature = p.temperature;
    STATE.systemPrompt = p.systemPrompt;
    STATE.enabledTools = new Set(p.enabledTools);
    saveSettings();
    render();
  }

  function deletePreset(i) {
    const presets = JSON.parse(localStorage.getItem(STORAGE_KEY + '-presets') || '[]');
    presets.splice(i, 1);
    localStorage.setItem(STORAGE_KEY + '-presets', JSON.stringify(presets));
    renderSavedPresets();
  }

  function addSystemMessage(text) {
    STATE.messages.push({ role: 'system', content: text, timestamp: Date.now() });
    renderMessages();
  }

  // ============== 聊天 ==============
  async function handleSend() {
    if (STATE.isStreaming) return;
    const input = $('userInput').value.trim();
    if (!input) return;
    if (!STATE.apiKey) {
      alert('请先在设置中填入 API Key');
      document.getElementById('setupModal').classList.add('open');
      return;
    }

    // 添加用户消息
    STATE.messages.push({ role: 'user', content: input, timestamp: Date.now() });
    $('userInput').value = '';
    renderMessages();

    // Agent 循环
    await agentLoop();
  }

  async function agentLoop() {
    const maxIterations = 5;
    for (let i = 0; i < maxIterations; i++) {
      const isLast = (i === maxIterations - 1);
      const result = await callLLM(isLast && STATE.enabledTools.size === 0);  // 工具模式下不能强制是最后一轮
      if (result.stopped) break;
    }
  }

  async function callLLM(noToolsAllowed) {
    if (!STATE.apiKey) return { stopped: true };
    const provider = PROVIDERS[STATE.provider];
    if (!provider) return { stopped: true };

    STATE.isStreaming = true;
    $('sendBtn').innerHTML = '<span>...</span>';
    $('sendBtn').disabled = true;

    // 准备消息
    const msgs = [];
    if (STATE.systemPrompt) msgs.push({ role: 'system', content: STATE.systemPrompt });
    STATE.messages.forEach(m => {
      if (m.role === 'tool_call') return;  // 工具调用由工具系统处理
      if (m.role === 'tool_result') return;
      msgs.push({ role: m.role, content: m.content });
    });

    // 准备工具 (OpenAI 格式)
    const enabledTools = Array.from(STATE.enabledTools).map(name => {
      const tool = BUILTIN_TOOLS.find(t => t.name === name);
      if (!tool) return null;
      return {
        type: 'function',
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters
        }
      };
    }).filter(Boolean);

    const toolsToUse = (!noToolsAllowed && provider.supportsTools) ? enabledTools : [];

    const opts = {
      apiKey: STATE.apiKey,
      baseUrl: STATE.baseUrl,
      temperature: parseFloat(STATE.temperature),
      max_tokens: parseInt(STATE.maxTokens)
    };

    const startTime = Date.now();

    try {
      const req = provider.formatRequest(msgs, STATE.model, true, toolsToUse, opts);

      const response = await fetch(req.url, {
        method: req.method,
        headers: req.headers,
        body: JSON.stringify(req.body)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errText.substring(0, 300)}`);
      }

      // 流式响应
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';
      let toolCalls = [];
      let currentToolCall = null;

      // 创建 AI 消息容器
      STATE.messages.push({ role: 'assistant', content: '', timestamp: Date.now() });
      renderMessages();
      const lastBubble = document.querySelector('.pg-msg.assistant:last-child .pg-msg-bubble');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;

          // 处理 OpenAI-style SSE
          let content = '';
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;
            content = provider.parseStream(data);
          } else if (line.startsWith('{')) {
            // Some providers (ollama custom) might not use SSE
            content = provider.parseStream(line);
          }

          if (content) {
            fullContent += content;
            // 更新最后一帧气泡
            if (lastBubble) {
              lastBubble.innerHTML = formatMarkdown(fullContent) + '<span class="pg-streaming"></span>';
              // 自动滚动
              const container = $('messages');
              container.scrollTop = container.scrollHeight;
            }
          }
        }
      }

      // 移除流式光标
      if (lastBubble) {
        lastBubble.innerHTML = formatMarkdown(fullContent);
      }

      // 更新最后一条消息的内容
      STATE.messages[STATE.messages.length - 1].content = fullContent;

      const elapsed = Date.now() - startTime;
      $('statTime').textContent = `响应: ${(elapsed / 1000).toFixed(2)}s`;
      STATE.totalTokens += Math.ceil(fullContent.length / 4);  // 估算
      $('statTokens').textContent = `Tokens: ~${STATE.totalTokens}`;

      STATE.isStreaming = false;
      $('sendBtn').innerHTML = '<span>发送</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
      $('sendBtn').disabled = false;

      return { stopped: true };  // 简化为单轮
    } catch (e) {
      console.error('API 调用失败:', e);
      const errMsg = `❌ 调用失败: ${e.message}\n\n💡 排查建议:\n1. 检查 API Key 是否正确\n2. 检查账户余额\n3. 确认网络可访问对应 API\n4. Anthropic / 部分服务可能不支持直接浏览器调用`;
      // 移除空的助手消息
      if (STATE.messages.length > 0 && STATE.messages[STATE.messages.length - 1].role === 'assistant' && !STATE.messages[STATE.messages.length - 1].content) {
        STATE.messages.pop();
      }
      addSystemMessage(errMsg);
      STATE.isStreaming = false;
      $('sendBtn').innerHTML = '<span>发送</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
      $('sendBtn').disabled = false;
      return { stopped: true, error: e.message };
    }
  }

  // ============== 事件绑定 ==============
  $('temperature').addEventListener('input', e => {
    STATE.temperature = parseFloat(e.target.value);
    $('temperatureVal').textContent = STATE.temperature;
    saveSettings();
  });

  $('maxTokens').addEventListener('change', e => {
    STATE.maxTokens = parseInt(e.target.value) || 2048;
    saveSettings();
  });

  $('modelSelect').addEventListener('change', e => {
    STATE.model = e.target.value;
    saveSettings();
    render();
  });

  $('systemPrompt').addEventListener('input', e => {
    STATE.systemPrompt = e.target.value;
    saveSettings();
  });

  $('userInput').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  // 暴露到全局供 inline onclick 调用
  window.toggleTool = toggleTool;
  window.setSystemPrompt = setSystemPrompt;
  window.setAgentPrompt = setAgentPrompt;
  window.resetSystemPrompt = resetSystemPrompt;
  window.saveSettings = saveSettingsFromUI;
  window.clearAllSettings = clearAllSettings;
  window.updateProvider = updateProvider;
  window.clearConversation = clearConversation;
  window.exportConversation = exportConversation;
  window.savePreset = savePreset;
  window.loadPreset = loadPreset;
  window.deletePreset = deletePreset;
  window.handleSend = handleSend;

  // 初始化
  loadSettings();
  // 设置默认提示
  if (!STATE.systemPrompt) {
    STATE.systemPrompt = '你是一位耐心的 AI 助手，擅长用简单易懂的语言回答问题。请用中文回答。';
  }
  render();
  renderMessages();

  // 添加 auto-resize
  const userInput = $('userInput');
  userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 200) + 'px';
  });

})();
