/* ==========================================================
   Miracle · core：工具 / 存储 / 云同步 / 图表 / UI 组件
   ========================================================== */
window.MW = window.MW || {};
(function (M) {
  'use strict';

  /* ---------------- 基础工具 ---------------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  M.$ = $; M.$$ = $$;

  M.uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  M.now = () => Date.now();
  M.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  M.pad2 = n => String(n).padStart(2, '0');
  M.today = (d) => { d = d || new Date(); return d.getFullYear() + '-' + M.pad2(d.getMonth() + 1) + '-' + M.pad2(d.getDate()); };
  M.month = (s) => String(s || M.today()).slice(0, 7);
  M.hhmm = (d) => { d = d || new Date(); return M.pad2(d.getHours()) + ':' + M.pad2(d.getMinutes()); };
  M.weekday = (s) => ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][new Date(s + 'T00:00:00').getDay()];
  M.isWeekend = (s) => { const g = new Date(s + 'T00:00:00').getDay(); return g === 0 || g === 6; };
  M.daysBetween = (a, b) => Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);

  M.fmtHot = n => {
    n = Number(n) || 0;
    if (n >= 100000000) return (n / 100000000).toFixed(1) + '亿';
    if (n >= 10000) return (n / 10000).toFixed(1) + '万';
    return n ? String(n) : '';
  };
  M.money = n => '¥' + (Math.round((Number(n) || 0) * 100) / 100).toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  M.num = n => (Math.round((Number(n) || 0) * 100) / 100).toLocaleString('zh-CN');

  M.debounce = (fn, ms) => { let t; return function () { clearTimeout(t); const a = arguments, s = this; t = setTimeout(() => fn.apply(s, a), ms); }; };

  /* 按日期确定性伪随机（保证「每日一篇」一天内稳定） */
  M.seedRand = (seedStr) => {
    let h = 2166136261;
    for (let i = 0; i < seedStr.length; i++) { h ^= seedStr.charCodeAt(i); h = Math.imul(h, 16777619); }
    return Math.abs(h);
  };
  M.dailyPick = (arr, salt) => arr[M.seedRand(M.today() + (salt || '')) % arr.length];
  M.dailyPickN = (arr, n, salt) => {
    const out = [], used = new Set(), len = arr.length;
    let seed = M.seedRand(M.today() + (salt || ''));
    for (let i = 0; i < Math.min(n, len); i++) {
      let k = (seed + i * 2654435761) % len;
      while (used.has(k)) k = (k + 1) % len;
      used.add(k); out.push(arr[k]);
    }
    return out;
  };

  /* ---------------- Base64（UTF-8 安全） ---------------- */
  function b64enc(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = '', CH = 0x8000;
    for (let i = 0; i < bytes.length; i += CH) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
    return btoa(bin);
  }
  function b64dec(b64) {
    const bin = atob(String(b64).trim());
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  /* ---------------- 数据层 ---------------- */
  const LS_KEY = 'miracle.db.v1';
  const DEFAULT = () => ({
    meta: { updatedAt: 0, device: M.uid() },
    settings: {
      syncKey: '', autoSync: true, theme: 'light',
      baseSalary: 8000, hourly: 46, rateWork: 1.5, rateWeekend: 2, rateHoliday: 3,
      social: 0, fund: 0, seniorityPerMonth: 0, performance: 0,
      allowances: [], extras: [],
      lastView: 'hot'
    },
    overtime: [], wool: [], todos: [], ledger: [], mortgage: [], film: [],
    mortgageCfg: { total: 0, rate: 0, years: 0, start: '', repriceMode: 'reprice_pay', rateAdj: [], prepay: null },
    study: { checkins: {}, tasks: {}, ecoRead: {} },
    games: { best: {}, plays: {}, difficulty: 'normal' }
  });

  let DB = DEFAULT();
  M.db = () => DB;

  function load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) DB = Object.assign(DEFAULT(), JSON.parse(raw));
      DB.settings = Object.assign(DEFAULT().settings, DB.settings || {});
      DB.study = Object.assign(DEFAULT().study, DB.study || {});
      DB.games = Object.assign(DEFAULT().games, DB.games || {});
      DB.mortgageCfg = Object.assign(DEFAULT().mortgageCfg, DB.mortgageCfg || {});
      if (!Array.isArray(DB.mortgageCfg.rateAdj)) DB.mortgageCfg.rateAdj = [];
      ['overtime', 'wool', 'todos', 'ledger', 'mortgage', 'film'].forEach(k => { if (!Array.isArray(DB[k])) DB[k] = []; });
      DB.mortgageCfg = Object.assign(DEFAULT().mortgageCfg, DB.mortgageCfg || {});
    } catch (e) { console.warn('load fail', e); DB = DEFAULT(); }
  }

  M.save = function (opts) {
    opts = opts || {};
    DB.meta.updatedAt = Date.now();
    try { localStorage.setItem(LS_KEY, JSON.stringify(DB)); }
    catch (e) { M.toast('本地存储已满，请清理部分记录', 'err'); }
    if (!opts.silent) M.emit('data');
    if (DB.settings.autoSync && DB.settings.syncKey) pushSoon();
  };

  /* 记录级增删改（带时间戳与墓碑，便于多端合并） */
  M.add = function (coll, obj) {
    obj.id = obj.id || M.uid(); obj._u = Date.now(); obj._d = 0;
    DB[coll].unshift(obj); M.save(); return obj;
  };
  M.update = function (coll, id, patch) {
    const it = DB[coll].find(x => x.id === id);
    if (!it) return null;
    Object.assign(it, patch, { _u: Date.now() });
    M.save(); return it;
  };
  M.remove = function (coll, id) {
    const it = DB[coll].find(x => x.id === id);
    if (it) { it._d = 1; it._u = Date.now(); M.save(); }
  };
  M.list = coll => (DB[coll] || []).filter(x => !x._d);

  /* ---------------- 事件总线 ---------------- */
  const bus = {};
  M.on = (k, fn) => { (bus[k] = bus[k] || []).push(fn); };
  M.emit = (k, p) => { (bus[k] || []).forEach(f => { try { f(p); } catch (e) { console.error(e); } }); };

  /* ---------------- 云同步（textdb.online，免注册） ---------------- */
  const SYNC_WRITE = 'https://textdb.online/update';
  const SYNC_READ = 'https://textdb.online/';

  M.genKey = () => 'miracle-' + Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 6);

  function payload() {
    return {
      v: 1, updatedAt: DB.meta.updatedAt, device: DB.meta.device,
      overtime: DB.overtime, wool: DB.wool, todos: DB.todos, ledger: DB.ledger, mortgage: DB.mortgage, mortgageCfg: DB.mortgageCfg,
      study: DB.study, games: DB.games,
      settings: { hourly: DB.settings.hourly, baseSalary: DB.settings.baseSalary, rateWork: DB.settings.rateWork, rateWeekend: DB.settings.rateWeekend, rateHoliday: DB.settings.rateHoliday, social: DB.settings.social, fund: DB.settings.fund, seniorityPerMonth: DB.settings.seniorityPerMonth, performance: DB.settings.performance, allowances: DB.settings.allowances, extras: DB.settings.extras }
    };
  }

  function mergeArr(local, remote) {
    const map = new Map();
    (local || []).forEach(x => x && x.id && map.set(x.id, x));
    (remote || []).forEach(x => {
      if (!x || !x.id) return;
      const cur = map.get(x.id);
      if (!cur || (x._u || 0) > (cur._u || 0)) map.set(x.id, x);
    });
    const cut = Date.now() - 30 * 86400000;
    return Array.from(map.values())
      .filter(x => !(x._d && (x._u || 0) < cut))
      .sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b._u || 0) - (a._u || 0));
  }

  function mergeRemote(r) {
    if (!r || typeof r !== 'object') return false;
    DB.overtime = mergeArr(DB.overtime, r.overtime);
    DB.wool = mergeArr(DB.wool, r.wool);
    DB.todos = mergeArr(DB.todos, r.todos);
    DB.ledger = mergeArr(DB.ledger, r.ledger);
    DB.mortgage = mergeArr(DB.mortgage, r.mortgage);
    if (r.mortgageCfg) Object.assign(DB.mortgageCfg, r.mortgageCfg);
    // 学习打卡：并集
    const s = r.study || {};
    DB.study.checkins = Object.assign({}, s.checkins || {}, DB.study.checkins || {});
    DB.study.ecoRead = Object.assign({}, s.ecoRead || {}, DB.study.ecoRead || {});
    const rt = s.tasks || {}, lt = DB.study.tasks || {};
    Object.keys(rt).forEach(d => { lt[d] = Object.assign({}, rt[d], lt[d] || {}); });
    DB.study.tasks = lt;
    // 游戏最高分：取大
    const rb = (r.games && r.games.best) || {};
    Object.keys(rb).forEach(k => {
      const minBetter = k.startsWith('sokoban_l') || k === 'sudoku';
      const better = minBetter
        ? Math.min(DB.games.best[k] == null ? Infinity : DB.games.best[k], rb[k])
        : Math.max(DB.games.best[k] || 0, rb[k]);
      DB.games.best[k] = isFinite(better) ? better : rb[k];
    });
    const rp = (r.games && r.games.plays) || {};
    Object.keys(rp).forEach(k => { DB.games.plays[k] = Math.max(DB.games.plays[k] || 0, rp[k]); });
    // 设置：远端更新更新则采用
    if ((r.updatedAt || 0) > (DB.meta.updatedAt || 0) && r.settings) Object.assign(DB.settings, r.settings);
    return true;
  }

  let pushTimer = null, syncing = false;
  function pushSoon() { clearTimeout(pushTimer); pushTimer = setTimeout(() => M.push(true), 2500); }

  M.push = async function (quiet) {
    const key = DB.settings.syncKey;
    if (!key) { if (!quiet) M.toast('请先设置同步码', 'warn'); return false; }
    setSyncState('上传中…');
    try {
      const body = new URLSearchParams();
      body.set('key', key);
      body.set('value', b64enc(JSON.stringify(payload())));
      const res = await fetch(SYNC_WRITE, { method: 'POST', body });
      const j = await res.json();
      if (j && j.status === 1) {
        DB.settings.lastSync = Date.now();
        localStorage.setItem(LS_KEY, JSON.stringify(DB));
        setSyncState('已同步 ' + M.hhmm());
        if (!quiet) M.toast('已上传到云端', 'ok');
        return true;
      }
      throw new Error((j && j.error) || '写入失败');
    } catch (e) {
      setSyncState('上传失败');
      if (!quiet) M.toast('上传失败：' + e.message, 'err');
      return false;
    }
  };

  M.pull = async function (quiet) {
    const key = DB.settings.syncKey;
    if (!key) { if (!quiet) M.toast('请先设置同步码', 'warn'); return false; }
    if (syncing) return false;
    syncing = true; setSyncState('下载中…');
    try {
      const res = await fetch(SYNC_READ + encodeURIComponent(key) + '?t=' + Date.now(), { cache: 'no-store' });
      const txt = (await res.text()).trim();
      if (!txt) { setSyncState('云端暂无数据'); if (!quiet) M.toast('云端还没有数据，先上传一次吧', 'warn'); return false; }
      const remote = JSON.parse(b64dec(txt));
      mergeRemote(remote);
      DB.meta.updatedAt = Math.max(DB.meta.updatedAt || 0, remote.updatedAt || 0);
      localStorage.setItem(LS_KEY, JSON.stringify(DB));
      setSyncState('已同步 ' + M.hhmm());
      M.emit('data');
      if (!quiet) M.toast('已从云端拉取并合并', 'ok');
      return true;
    } catch (e) {
      setSyncState('下载失败');
      if (!quiet) M.toast('下载失败：' + e.message, 'err');
      return false;
    } finally { syncing = false; }
  };

  M.syncNow = async function () { await M.pull(true); await M.push(true); M.toast('同步完成', 'ok'); };

  function setSyncState(t) {
    const a = $('#syncLabel'), b = $('#footSync');
    if (a) a.textContent = DB.settings.syncKey ? t : '同步';
    if (b) b.textContent = DB.settings.syncKey ? ('同步码 ' + DB.settings.syncKey + ' · ' + t) : '未开启同步';
  }
  M.setSyncState = setSyncState;

  /* ---------------- UI：Toast / Modal ---------------- */
  M.toast = function (msg, type) {
    const w = $('#toastWrap'); if (!w) return;
    const d = document.createElement('div');
    d.className = 'toast ' + (type || '');
    d.textContent = msg; w.appendChild(d);
    setTimeout(() => { d.style.transition = '.3s'; d.style.opacity = '0'; d.style.transform = 'translateY(-10px)'; }, 2100);
    setTimeout(() => d.remove(), 2500);
  };

  M.modal = function (title, html, onOpen) {
    $('#modalTitle').textContent = title;
    $('#modalBody').innerHTML = html;
    $('#modal').classList.add('show');
    const x = $('#modalClose'); if (x) x.onclick = M.closeModal;   // 右上角 ✕ 关闭（覆盖式绑定，不累积）
    if (onOpen) onOpen($('#modalBody'));
  };
  M.closeModal = () => $('#modal').classList.remove('show');

  // 一次性绑定：点击遮罩（弹窗外区域）关闭弹窗
  const _modalEl = $('#modal');
  if (_modalEl) {
    _modalEl.addEventListener('click', e => { if (e.target === _modalEl) M.closeModal(); });
  }

  M.confirm = function (text, onYes) {
    M.modal('请确认', '<p style="font-size:14px;margin:2px 0 18px">' + M.esc(text) + '</p>' +
      '<div class="form-act"><button class="btn btn-danger" id="cfYes">确定</button>' +
      '<button class="btn btn-ghost" id="cfNo">取消</button></div>', body => {
        $('#cfYes', body).onclick = () => { M.closeModal(); onYes(); };
        $('#cfNo', body).onclick = M.closeModal;
      });
  };

  /* ---------------- 图表（纯 SVG，无外部依赖） ---------------- */
  M.barChart = function (data, opt) {
    opt = opt || {};
    const W = 100, H = opt.height || 160, pad = 22;
    const max = Math.max(1, ...data.map(d => d.value));
    const n = Math.max(data.length, 1);
    const bw = (100 - pad) / n;
    const baseY = H - 40 + 12;            // 基线 y
    let bars = '', labels = '', grid = '';
    for (let g = 0; g <= 3; g++) {
      const y = 12 + (H - 40) * g / 3;
      grid += `<line x1="${pad - 4}" y1="${y}" x2="100" y2="${y}" stroke="currentColor" stroke-opacity=".10" stroke-width=".3" vector-effect="non-scaling-stroke"/>` +
        `<text x="${pad - 6}" y="${y + 2}" font-size="4" fill="currentColor" fill-opacity=".4" text-anchor="end">${M.num(Math.round(max * (3 - g) / 3))}</text>`;
    }
    grid += `<line x1="${pad - 4}" y1="${baseY}" x2="100" y2="${baseY}" stroke="currentColor" stroke-opacity=".28" stroke-width=".5" vector-effect="non-scaling-stroke"/>`;
    const dim = opt.highlight ? .6 : 1;
    data.forEach((d, i) => {
      const h = Math.max(1.5, (H - 52) * d.value / max);
      const x = pad + i * bw + bw * .18, w = bw * .64;
      const y = baseY - h + 12;
      const hl = opt.highlight && d.label === opt.highlight;
      const fill = d.color || 'var(--accent)';
      bars += `<rect class="bar" x="${x}" y="${y}" width="${w}" height="${h}" rx="1.4" fill="${fill}" fill-opacity="${hl ? 1 : dim}"><title>${M.esc(d.label)}: ${M.esc(String(d.value))} h</title></rect>`;
      if (hl) bars += `<circle cx="${x + w / 2}" cy="${y - 1.6}" r="1.1" fill="${fill}"><title>${M.esc(d.label)}</title></circle>`;
      if (d.value > 0) bars += `<text x="${x + w / 2}" y="${y - 3.4}" font-size="4.2" font-weight="${hl ? 700 : 400}" fill="currentColor" fill-opacity="${hl ? .92 : (dim ? .6 : .72)}" text-anchor="middle">${M.esc(d.top || String(d.value))}</text>`;
      labels += `<text x="${x + w / 2}" y="${H - 20}" font-size="${hl ? 4.4 : 4}" font-weight="${hl ? 700 : 400}" fill="currentColor" fill-opacity="${hl ? .92 : .6}" text-anchor="middle">${M.esc(d.label)}</text>`;
    });
    return `<svg class="chart" viewBox="0 0 ${W} ${H - 16}" preserveAspectRatio="none" style="height:${H - 16}px;color:var(--ink)">${grid}${bars}${labels}</svg>`;
  };

  M.donut = function (data) {
    const total = data.reduce((s, d) => s + d.value, 0) || 1;
    let a = -Math.PI / 2, paths = '';
    data.forEach(d => {
      const ang = d.value / total * Math.PI * 2, b = a + ang;
      const large = ang > Math.PI ? 1 : 0;
      const x1 = 50 + 38 * Math.cos(a), y1 = 50 + 38 * Math.sin(a);
      const x2 = 50 + 38 * Math.cos(b), y2 = 50 + 38 * Math.sin(b);
      if (d.value > 0) paths += `<path d="M ${x1} ${y1} A 38 38 0 ${large} 1 ${x2} ${y2}" fill="none" stroke="${d.color}" stroke-width="16"><title>${M.esc(d.label)} ${(d.value / total * 100).toFixed(1)}%</title></path>`;
      a = b;
    });
    return `<svg viewBox="0 0 100 100" style="width:100%;max-width:180px;margin:0 auto;display:block">${paths}
      <text x="50" y="48" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">${M.num(total)}</text>
      <text x="50" y="58" text-anchor="middle" font-size="6" fill="currentColor" fill-opacity=".55">合计</text></svg>`;
  };

  M.lineChart = function (data, opt) {
    opt = opt || {};
    const H = opt.height || 150, max = Math.max(1, ...data.map(d => d.value)), n = data.length;
    if (!n) return '';
    const px = i => 10 + i * (88 / Math.max(1, n - 1));
    const py = v => 12 + (H - 52) * (1 - v / max);
    let dstr = '', area = '', dots = '', labels = '';
    data.forEach((d, i) => {
      const x = px(i), y = py(d.value);
      dstr += (i ? ' L ' : 'M ') + x + ' ' + y;
      dots += `<circle cx="${x}" cy="${y}" r="1.5" fill="${opt.color || 'var(--accent)'}"><title>${M.esc(d.label)}: ${M.esc(String(d.value))}</title></circle>`;
      if (n <= 14 || i % 2 === 0) labels += `<text x="${x}" y="${H - 24}" font-size="3.6" text-anchor="middle" fill="currentColor" fill-opacity=".55">${M.esc(d.label)}</text>`;
    });
    area = dstr + ` L ${px(n - 1)} ${H - 40 + 12} L ${px(0)} ${H - 40 + 12} Z`;
    return `<svg class="chart" viewBox="0 0 100 ${H - 16}" preserveAspectRatio="none" style="height:${H - 16}px;color:var(--ink)">
      <path d="${area}" fill="${opt.color || 'var(--accent)'}" fill-opacity=".12"/>
      <path d="${dstr}" fill="none" stroke="${opt.color || 'var(--accent)'}" stroke-width=".8" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>
      ${dots}${labels}</svg>`;
  };

  /* ---------------- 初始化 ---------------- */
  load();
  M.b64enc = b64enc; M.b64dec = b64dec;
  M.LS_KEY = LS_KEY;
  M.exportJSON = () => JSON.stringify(payload(), null, 2);
  M.importJSON = (txt) => { const r = JSON.parse(txt); mergeRemote(r); M.save(); return true; };

  /* ---------------- PWA：注册 Service Worker ---------------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }

})(window.MW);
