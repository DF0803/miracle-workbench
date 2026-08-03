/* ==========================================================
   每日热搜：微博 / 知乎 / 抖音 / 头条 / 百度  · 每小时自动更新
   ========================================================== */
(function (M) {
  'use strict';
  const $ = M.$;

  const PLATS = [
    { id: 'weibo', name: '微博热搜', icon: '微', color: '#e6162d', url: 'https://60s.viki.moe/v2/weibo' },
    { id: 'zhihu', name: '知乎热榜', icon: '知', color: '#0066ff', url: 'https://60s.viki.moe/v2/zhihu' },
    { id: 'douyin', name: '抖音热点', icon: '抖', color: '#111827', url: 'https://60s.viki.moe/v2/douyin' },
    { id: 'toutiao', name: '头条热榜', icon: '头', color: '#f04142', url: 'https://60s.viki.moe/v2/toutiao' },
    { id: 'baidu', name: '百度热搜', icon: '百', color: '#2932e1', url: 'https://60s.viki.moe/v2/baidu/realtime' },
    { id: 'xhs', name: '小红书', icon: '红', color: '#ff2741',
      proxy: true,
      urls: [
        'https://api.vvhan.com/api/hotlist/xiaohongshu',
        'https://tenapi.cn/v2/xiaohongshu',
        'https://api.oioweb.cn/api/v1/xiaohongshu/hot'
      ] }
  ];
  const CACHE = 'miracle.hot.v1';
  const HOUR = 3600 * 1000;
  const PROXY = 'https://api.allorigins.win/raw?url=';

  let state = { data: {}, ts: 0, tab: 'all', kw: '', loading: false };

  function normalize(id, list) {
    if (!Array.isArray(list)) return [];
    return list.slice(0, 50).map((it, i) => {
      let hot = '';
      if (id === 'zhihu') hot = (it.hot_value_desc || '').replace(/\s/g, '');
      else if (id === 'baidu') hot = M.fmtHot(it.score);
      else hot = M.fmtHot(it.hot_value);
      return {
        rank: i + 1,
        title: String(it.title || '').trim(),
        hot: hot,
        desc: String(it.desc || it.detail || '').slice(0, 60),
        link: it.link || it.url || ''
      };
    }).filter(x => x.title);
  }

  async function fetchOne(p) {
    if (p.proxy) return await fetchXhs(p);
    const res = await fetch(p.url + '?t=' + Math.floor(Date.now() / 60000), { cache: 'no-store' });
    const j = await res.json();
    if (!j || j.code !== 200 || !j.data) throw new Error('接口返回异常');
    return normalize(p.id, j.data);
  }

  /* 小红书：经 CORS 代理桥接多个上游，任一可用即返回（上游不稳时优雅降级） */
  function extractList(j) {
    if (Array.isArray(j)) return j;
    if (Array.isArray(j.data)) return j.data;
    if (j.data && Array.isArray(j.data.list)) return j.data.list;
    if (j.data && Array.isArray(j.data.data)) return j.data.data;
    if (Array.isArray(j.list)) return j.list;
    return [];
  }
  function normalizeXhs(it) {
    const title = it.title || it.word || it.name || it.query || it.hotword || '';
    const hot = it.hot || it.hot_value || it.heat || it.score || it.hotScore || '';
    const link = it.url || it.link || it.href || '';
    const desc = it.desc || it.description || it.content || it.summary || '';
    return { title: String(title).trim(), hot: M.fmtHot(hot), desc: String(desc).slice(0, 60), link: String(link) };
  }
  async function fetchXhs(p) {
    let lastErr;
    for (const u of p.urls) {
      try {
        const r = await fetch(PROXY + encodeURIComponent(u) + '&t=' + Date.now(), { cache: 'no-store' });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const txt = await r.text();
        let j; try { j = JSON.parse(txt); } catch (e) { throw new Error('非 JSON 响应'); }
        const list = extractList(j);
        if (!list.length) throw new Error('空数据');
        const arr = list.slice(0, 50).map(normalizeXhs).filter(x => x.title);
        if (!arr.length) throw new Error('无有效条目');
        return arr;
      } catch (e) { lastErr = e; }
    }
    throw lastErr || new Error('全部数据源失败');
  }

  async function refresh(force) {
    if (state.loading) return;
    if (!force && state.ts && Date.now() - state.ts < HOUR) { render(); return; }
    state.loading = true; render();
    const results = await Promise.allSettled(PLATS.map(fetchOne));
    let ok = 0;
    results.forEach((r, i) => {
      const id = PLATS[i].id;
      if (r.status === 'fulfilled' && r.value.length) { state.data[id] = r.value; ok++; }
      else if (!state.data[id]) state.data[id] = null;
    });
    state.ts = Date.now(); state.loading = false;
    try { localStorage.setItem(CACHE, JSON.stringify({ ts: state.ts, data: state.data })); } catch (e) { }
    render();
    if (force) M.toast(ok ? ('已更新 ' + ok + ' / 6 个平台') : '全部平台获取失败，请检查网络', ok ? 'ok' : 'err');
  }

  function hl(text, kw) {
    const t = M.esc(text);
    if (!kw) return t;
    try { return t.replace(new RegExp('(' + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<em>$1</em>'); }
    catch (e) { return t; }
  }

  function itemHTML(it, kw) {
    const cls = it.rank === 1 ? 'top' : it.rank === 2 ? 'top2' : it.rank === 3 ? 'top3' : '';
    return `<li class="hot-li ${cls}" data-link="${M.esc(it.link)}" title="${M.esc(it.desc || it.title)}">
      <span class="hot-rk">${it.rank}</span>
      <span class="hot-t">${hl(it.title, kw)}</span>
      <span class="hot-v">${M.esc(it.hot)}</span></li>`;
  }

  function listOf(id) {
    const arr = state.data[id] || [];
    if (!state.kw) return arr;
    const k = state.kw.toLowerCase();
    return arr.filter(x => x.title.toLowerCase().includes(k));
  }

  function platCard(p, limit) {
    const arr = listOf(p.id);
    let inner;
    if (state.loading && !state.data[p.id]) inner = Array(8).fill('<div class="skeleton"></div>').join('');
    else if (!state.data[p.id]) inner = `<div class="empty"><span class="e-ico">📡</span>获取失败<br><button class="btn btn-sm btn-ghost" style="margin-top:8px" data-retry="1">重试</button></div>`;
    else if (!arr.length) inner = `<div class="empty" style="padding:24px"><span class="e-ico">🔍</span>没有匹配的条目</div>`;
    else inner = '<ul class="plat-list">' + arr.slice(0, limit || 50).map(it => itemHTML(it, state.kw)).join('') + '</ul>';
    return `<div class="plat" data-plat="${p.id}">
      <div class="plat-h" style="background:linear-gradient(120deg,${p.color},${shade(p.color)})">
        <span class="p-ico">${p.icon}</span>${p.name}
        <span class="p-n">${(state.data[p.id] || []).length} 条</span>
      </div>${inner}</div>`;
  }

  function shade(hex) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.min(255, (n >> 16) + 46), g = Math.min(255, ((n >> 8) & 255) + 34), b = Math.min(255, (n & 255) + 60);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  function render() {
    const box = $('#hotBody'); if (!box) return;
    box.innerHTML = '<div class="hot-grid">' + PLATS.map(p => platCard(p, 20)).join('') + '</div>';
    const up = $('#hotUpdated');
    if (up) up.textContent = state.ts ? new Date(state.ts).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) : '--:--';
    tick();
  }

  function tick() {
    const el = $('#hotCountdown'); if (!el) return;
    const auto = $('#hotAuto');
    if (!state.ts) { el.textContent = (auto && !auto.checked) ? '已关闭' : '--:--'; return; }
    // 自动更新关闭时，不存在「下次自动」，直接提示已关闭
    if (auto && !auto.checked) { el.textContent = '已关闭'; return; }
    // 剩余时间钳制在 [0, HOUR]：避免系统时钟回拨/跨时区导致 Date.now()<state.ts 时显示 110:00 等异常值
    let left = HOUR - (Date.now() - state.ts);
    left = Math.max(0, Math.min(HOUR, left));
    const m = Math.floor(left / 60000), s = Math.floor(left % 60000 / 1000);
    el.textContent = M.pad2(m) + ':' + M.pad2(s);
  }

  function bind() {
    const box = $('#hotBody');
    box.addEventListener('click', e => {
      const rt = e.target.closest('[data-retry]');
      if (rt) { refresh(true); return; }
      const li = e.target.closest('.hot-li');
      if (li && li.dataset.link) window.open(li.dataset.link, '_blank', 'noopener');
    });
    $('#hotRefresh').onclick = () => refresh(true);
    $('#hotSearch').addEventListener('input', M.debounce(e => { state.kw = e.target.value.trim(); render(); }, 220));
    const auto = $('#hotAuto');
    auto.checked = localStorage.getItem('miracle.hot.auto') !== '0';
    auto.onchange = () => {
      localStorage.setItem('miracle.hot.auto', auto.checked ? '1' : '0');
      M.toast(auto.checked ? '已开启每小时自动更新' : '已关闭自动更新', auto.checked ? 'ok' : 'warn');
    };
  }

  M.hot = {
    init() {
      try {
        const c = JSON.parse(localStorage.getItem(CACHE) || 'null');
        if (c && c.data) { state.data = c.data; state.ts = c.ts || 0; }
      } catch (e) { }
      bind(); render();
      refresh(false);
      setInterval(() => {
        tick();
        const auto = $('#hotAuto');
        if (auto && auto.checked && Date.now() - state.ts >= HOUR) refresh(true);
      }, 1000);
      document.addEventListener('visibilitychange', () => {
        const auto = $('#hotAuto');
        if (!document.hidden && auto && auto.checked && Date.now() - state.ts >= HOUR) refresh(true);
      });
    },
    refresh
  };
})(window.MW);
