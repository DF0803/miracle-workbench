/* ==========================================================
   首页 · 总览仪表盘：聚合各模块数据 + 模块速达
   ========================================================== */
(function (M) {
  'use strict';
  const $ = M.$;

  /* 学习连续打卡天数 */
  function studyStreak() {
    const c = (M.db().study.checkins) || {};
    let d = new Date();
    if (!c[M.today(d)]) d.setDate(d.getDate() - 1);   // 今天还没打卡则从昨天算
    let n = 0;
    while (c[M.today(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  function payOf(r) {
    if (r.comp !== 'pay') return 0;
    const s = M.db().settings;
    const rate = r.type === 'holiday' ? +s.rateHoliday : r.type === 'weekend' ? +s.rateWeekend : +s.rateWork;
    return (+r.hours || 0) * (+s.hourly || 0) * rate;
  }

  function hello() {
    const h = new Date().getHours();
    if (h < 5) return '夜深了，侦探';
    if (h < 11) return '早上好，侦探';
    if (h < 13) return '中午好，侦探';
    if (h < 18) return '下午好，侦探';
    if (h < 22) return '晚上好，侦探';
    return '夜深了，侦探';
  }

  const QUOTES = [
    '「真相永远只有一个。」', '「证据不会说谎，只有人会说谎。」',
    '「排除一切不可能的，剩下的即使再不可能，也是真相。」',
    '「推理是观察与逻辑的合奏。」', '「把今天的每一笔都记清楚，线索自然浮现。」'
  ];
  function quote() { return QUOTES[M.seedRand(M.today()) % QUOTES.length]; }

  function stats() {
    const db = M.db();
    // 学习
    const tt = M.today();
    const tasksToday = (db.study.tasks && db.study.tasks[tt]) || {};
    const studyDone = Object.keys(tasksToday).length + (db.study.ecoRead && db.study.ecoRead[tt] ? 1 : 0);
    const streak = studyStreak();
    // 加班
    const om = M.list('overtime').filter(r => M.month(r.date) === M.month());
    const otH = Math.round(om.reduce((a, r) => a + (+r.hours || 0), 0) * 10) / 10;
    const otP = om.reduce((a, r) => a + payOf(r), 0);
    // 羊毛
    const woolTotal = M.list('wool').filter(r => r.status === 'done').reduce((a, r) => a + (+r.income || 0), 0);
    // 记账
    const lm = M.list('ledger').filter(r => M.month(r.date) === M.month());
    const inM = lm.filter(r => r.type === 'in').reduce((a, r) => a + (+r.amount || 0), 0);
    const outM = lm.filter(r => r.type === 'out').reduce((a, r) => a + (+r.amount || 0), 0);
    const bal = Math.round((inM - outM) * 100) / 100;
    // 待办
    const tl = M.list('todos');
    const tPend = tl.filter(r => !r.done).length;
    const tOver = tl.filter(r => !r.done && r.due && r.due < tt).length;
    // 游戏
    const games = db.games || {};
    const played = (games.daily && games.daily[tt]) || 0;

    return { studyDone, streak, otH, otP, woolTotal, bal, inM, outM, tPend, tOver, played };
  }

  function render() {
    const box = $('#homeBody'); if (!box) return;
    const s = stats();
    const dt = new Date();
    const cn = M.today() + ' ' + ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][dt.getDay()]
      + ' ' + M.pad2(dt.getHours()) + ':' + M.pad2(dt.getMinutes());
    const h = $('#homeHello'); if (h) h.textContent = hello();
    const d = $('#homeDate'); if (d) d.textContent = cn + ' · 案件编号 #000 · 真相只有一个';
    const sy = $('#homeSync'); if (sy) sy.textContent = db().settings.syncKey ? '已同步' : '未同步';

    const cards = [
      { v: 'study', ico: '📖', sc: 'var(--c-study)', k: '学习打卡', v: s.streak + ' 天连击', s: '今日已完成 ' + s.studyDone + ' 项' },
      { v: 'overtime', ico: '🌙', sc: 'var(--c-ot)', k: '本月加班', v: M.num(s.otH) + ' h', s: '预估 ' + M.money(s.otP) },
      { v: 'wool', ico: '🐑', sc: 'var(--c-wool)', k: '羊毛累计', v: M.money(s.woolTotal), s: '已到账收益' },
      { v: 'ledger', ico: '🧾', sc: 'var(--c-ledger)', k: '本月结余', v: (s.bal >= 0 ? '+' : '−') + M.money(Math.abs(s.bal)), s: '收 ' + M.money(s.inM) + ' / 支 ' + M.money(s.outM), danger: s.bal < 0 },
      { v: 'todo', ico: '📌', sc: 'var(--c-todo)', k: '待办事项', v: s.tPend + ' 进行中', s: s.tOver ? ('⚠ ' + s.tOver + ' 项已逾期') : '暂无逾期', danger: s.tOver > 0 },
      { v: 'game', ico: '🎮', sc: 'var(--c-game)', k: '今日游戏', v: s.played + ' 局', s: '摸鱼也要动脑' }
    ];

    const mods = [
      { v: 'hot', ico: '🔥', name: '每日热搜', sub: '六平台舆情侦查', sc: 'var(--c-hot)' },
      { v: 'film', ico: '🎬', name: '影视推荐', sub: '剧集/电影/动漫', sc: 'var(--c-film)' },
      { v: 'study', ico: '📖', name: '每日学习', sub: 'CATTI · 经济学人', sc: 'var(--c-study)' },
      { v: 'overtime', ico: '🌙', name: '加班记录', sub: '工时与加班费', sc: 'var(--c-ot)' },
      { v: 'wool', ico: '🐑', name: '羊毛记录', sub: '收益到账追踪', sc: 'var(--c-wool)' },
      { v: 'ledger', ico: '🧾', name: '记账', sub: '收入支出台账', sc: 'var(--c-ledger)' },
      { v: 'todo', ico: '📌', name: '待办事项', sub: '侦探笔记本', sc: 'var(--c-todo)' },
      { v: 'game', ico: '🎮', name: '游戏', sub: '推箱子/数独/…', sc: 'var(--c-game)' }
    ];

    box.innerHTML = `
      <div class="grid g3" style="margin-bottom:14px">
        ${cards.map(c => `<div class="stat stat-btn" data-go="${c.v}" style="--sc:${c.sc}">
          <div class="k">${c.k}</div>
          <div class="v" ${c.danger ? 'style="color:var(--c-hot)"' : ''}>${c.v}</div>
          <div class="s">${c.s}</div>
        </div>`).join('')}
      </div>

      <div class="card" style="margin-bottom:14px">
        <h3 class="card-h"><span class="dot"></span>模块速达</h3>
        <div class="home-mods">
          ${mods.map(m => `<button class="home-mod" data-go="${m.v}" style="--mc:${m.sc}">
            <span class="hm-ico">${m.ico}</span>
            <span class="hm-t"><b>${m.name}</b><small>${m.sub}</small></span>
            <span class="hm-go">›</span>
          </button>`).join('')}
        </div>
      </div>

      <div class="home-quote">
        <span class="hq-bow">🎯</span>
        <p>${quote()}</p>
        <small>—— 工藤新一 · Miracle 每日寄语</small>
      </div>`;

    $$on(box, '[data-go]', el => el.onclick = () => M.setView(el.dataset.go));
  }

  function $$on(root, sel, fn) {
    M.$$(sel, root).forEach(fn);
  }
  function db() { return M.db(); }

  M.home = {
    init() {
      render();
      setInterval(() => { const c = $('#homeClock'); if (c) c.textContent = M.hhmm(); }, 1000);
      M.on('data', () => { const v = $('#view-home'); if (v && v.classList.contains('is-active')) render(); });
    },
    render
  };
})(window.MW);
