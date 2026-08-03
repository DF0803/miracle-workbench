/* ==========================================================
   每日学习：CATTI 三级/二级/一级（笔译 + 口译）+ 经济学人精读
   交互采用「单一事件委托」：所有点击统一在 #studyBody 上处理，
   按 data-mod / data-lv / data-part / data-act 等属性分发，
   避免每次 render 重复绑定导致监听累积或绑定时序问题。
   ========================================================== */
(function (M) {
  'use strict';
  const $ = M.$, $$ = M.$$;
  let mod = 'catti', lv = 'l2', part = 'trans', ecoId = null, vocabSalt = 0;
  const PART_LABEL = { trans: '笔译', interp: '口译', exam: '考试信息' };

  /* ---------------- 打卡统计 ---------------- */
  function streak() {
    const c = M.db().study.checkins || {};
    let n = 0, d = new Date();
    if (!c[M.today(d)]) d.setDate(d.getDate() - 1);
    while (c[M.today(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function todayTasks() { return (M.db().study.tasks || {})[M.today()] || {}; }
  function taskDone() { return CATTI.dailyTasks.filter(t => todayTasks()[t.id]).length; }

  function syncHero() {
    const s = $('#studyStreak'), t = $('#studyToday');
    if (s) s.textContent = streak() + ' 天';
    if (t) t.textContent = taskDone() + ' / ' + CATTI.dailyTasks.length;
  }

  /* ---------------- CATTI ---------------- */
  function level() { return CATTI.levels.find(x => x.id === lv) || CATTI.levels[1]; }

  function vocabHTML() {
    const L = level();
    const list = M.dailyPickN(L.vocab, 8, lv + '-v' + vocabSalt);
    return `<div class="card" style="margin-bottom:14px">
      <h3 class="card-h"><span class="dot"></span>今日热词 · ${L.name}
        <span class="more">
          <button class="btn btn-sm btn-ghost" data-act="vocmore">换一组</button>
          <button class="btn btn-sm btn-ghost" data-act="vocall">全部 ${L.vocab.length} 词</button>
        </span></h3>
      <div class="grid g4" id="vocGrid">${list.map(v => cardHTML(v)).join('')}</div>
      <p class="note" style="margin:12px 0 0">💡 点击卡片翻面。建议先看中文默写英文，再反向自查。</p>
    </div>`;
  }
  function cardHTML(v) {
    return `<div class="flash"><div class="flash-in">
      <div class="flash-f"><b>${M.esc(v.en)}</b><small>${M.esc(v.tag)} · 点击查看释义</small></div>
      <div class="flash-b"><b>${M.esc(v.cn)}</b><small>${M.esc(v.en)}</small></div>
    </div></div>`;
  }

  function transHTML() {
    const L = level();
    const list = M.dailyPickN(L.trans, 4, lv + '-t' + vocabSalt);
    return `<div class="card" style="margin-bottom:14px">
      <h3 class="card-h"><span class="dot"></span>✍️ 笔译精练 · ${L.name}实务
        <span class="more"><button class="btn btn-sm btn-ghost" data-act="transmore">换一组</button></span></h3>
      ${list.map((s, i) => `
        <div class="sent" data-i="${i}">
          <div style="display:flex;gap:8px;align-items:center;margin-bottom:6px">
            <span class="tag" style="background:${s.dir === 'E-C' ? 'rgba(31,111,235,.14);color:#1f6feb' : s.dir === 'C-E' ? 'rgba(228,0,43,.12);color:#e4002b' : 'rgba(0,151,107,.14);color:#00976b'}">${s.dir === 'E-C' ? '英译汉' : s.dir === 'C-E' ? '汉译英' : '审定稿'}</span>
            <span class="pill">第 ${i + 1} 题</span>
          </div>
          <div class="src">${M.esc(s.src).replace(/\n/g, '<br>')}</div>
          <button class="btn btn-sm btn-ghost toggle">查看参考译文与解析</button>
          <div class="ans"><b>参考译文：</b>${M.esc(s.ref).replace(/\n/g, '<br>')}
            <div class="note">🔎 <b>解析：</b>${M.esc(s.note)}</div></div>
        </div>`).join('')}
    </div>`;
  }

  function interpHTML() {
    const L = level();
    const list = M.dailyPickN(L.interp, 4, lv + '-i' + vocabSalt);
    return `<div class="card" style="margin-bottom:14px">
      <h3 class="card-h"><span class="dot"></span>🎧 口译训练 · ${L.name}
        <span class="more"><button class="btn btn-sm btn-ghost" data-act="interpmore">换一组</button></span></h3>
      ${list.map((s, i) => `
        <div class="sent" data-i="${i}">
          <div style="display:flex;gap:8px;align-items:center;margin-bottom:6px">
            <span class="tag" style="background:rgba(123,92,255,.14);color:#7b5cff">${M.esc(s.type)}</span>
            <button class="btn btn-sm btn-ghost speak" data-say="${M.esc(s.src)}">🔊 朗读</button>
          </div>
          <div class="src">${M.esc(s.src)}</div>
          <button class="btn btn-sm btn-ghost toggle">查看参考译文</button>
          <div class="ans"><b>参考：</b>${M.esc(s.ref)}
            <div class="note">🎧 <b>要点：</b>${M.esc(s.note)}</div></div>
        </div>`).join('')}
      <p class="note" style="margin:10px 0 0">🎯 训练顺序建议：听 → 记笔记 → 复述 → 对照 → 录音回听。</p>
    </div>`;
  }

  function examHTML() {
    const L = level();
    return `<div class="card">
      <h3 class="card-h"><span class="dot"></span>${M.esc(L.title)} · 考试构成</h3>
      <p class="note" style="margin-top:0">${M.esc(L.desc)}</p>
      <div class="tb-wrap"><table><thead><tr><th style="width:190px">科目</th><th>形式与要求</th></tr></thead><tbody>
        ${L.exam.map(e => `<tr><td><b>${M.esc(e.k)}</b></td><td>${M.esc(e.v)}</td></tr>`).join('')}
      </tbody></table></div>
      <p class="note" style="margin-bottom:0">📌 <b>合格标准：</b>${M.esc(L.pass)}</p>
      <h3 class="card-h" style="margin-top:18px"><span class="dot"></span>备考要点</h3>
      ${L.tips.map(t => `<div class="chk" style="cursor:default"><span class="chk-box" style="background:var(--accent);border-color:var(--accent)">✓</span><span class="chk-t">${M.esc(t)}</span></div>`).join('')}
    </div>`;
  }

  function cattiHTML() {
    const L = level();
    // 切换笔译/口译时，把对应内容置顶，确保「点一下立刻能看到变化」
    const partBody = part === 'exam' ? examHTML()
      : (part === 'trans' ? transHTML() : interpHTML());
    return `<div class="toolbar" style="margin-bottom:12px">
      <div class="tabs" id="lvTabs">
        ${CATTI.levels.map(l => `<button class="tab ${l.id === lv ? 'is-active' : ''}" data-lv="${l.id}">${l.name}</button>`).join('')}
      </div>
      <div class="tabs" id="partTabs">
        <button class="tab ${part === 'trans' ? 'is-active' : ''}" data-part="trans">✍️ 笔译</button>
        <button class="tab ${part === 'interp' ? 'is-active' : ''}" data-part="interp">🎧 口译</button>
        <button class="tab ${part === 'exam' ? 'is-active' : ''}" data-part="exam">📋 考试信息</button>
      </div>
    </div>
    <div class="catti-crumb">📚 当前 <b>${L.name}</b> · <b>${PART_LABEL[part]}</b>${part !== 'exam' ? ' · 内容已与等级联动' : ''}</div>
    ${partBody}
    ${part !== 'exam' ? vocabHTML() : ''}`;
  }

  /* ---------------- 经济学人 ---------------- */
  function ecoHTML() {
    const art = ECONOMIST.find(a => a.id === ecoId) || M.dailyPick(ECONOMIST, 'eco');
    ecoId = art.id;
    const read = M.db().study.ecoRead || {};
    const words = art.paras.reduce((s, p) => s + p.en.split(/\s+/).length, 0);
    return `<div class="grid g-side">
      <div class="card">
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px">
          <span class="tag" style="background:#e4002b;color:#fff">The Economist</span>
          <span class="pill">${M.esc(art.section)}</span>
          <span class="pill">${words} words · 约 ${Math.max(3, Math.round(words / 90))} 分钟</span>
          ${read[art.id] ? '<span class="pill" style="background:rgba(0,151,107,.14);color:#00976b;border-color:transparent">✓ 已精读</span>' : ''}
        </div>
        <h2 style="margin:0 0 2px;font-size:21px;font-family:Georgia,serif">${M.esc(art.title)}</h2>
        <p style="margin:0 0 14px;color:var(--muted);font-size:13px">${M.esc(art.cn_title)}</p>
        <div class="form-act" style="margin:0 0 14px">
          <button class="btn btn-sm" data-act="ecoall">显示/隐藏全部译文</button>
          <button class="btn btn-sm btn-ghost" data-act="ecosay">🔊 朗读全文</button>
          <button class="btn btn-sm btn-ghost" data-act="ecostop">⏹ 停止</button>
          <button class="btn btn-sm btn-ghost" data-act="econew">🎲 换一篇</button>
          <button class="btn btn-sm btn-ghost" data-act="ecoread">${read[art.id] ? '取消已读' : '标记已精读'}</button>
        </div>
        <div class="eco-art" id="ecoArt">
          ${art.paras.map((p, i) => `<div class="eco-p" data-i="${i}">
            <div class="eco-en">${M.esc(p.en)}</div>
            <div class="eco-cn">${M.esc(p.cn)}</div></div>`).join('')}
        </div>
        <p class="note">💡 点击任意段落可单独显示／隐藏中文译文，建议先自译再对照。</p>
      </div>
      <div>
        <div class="card" style="margin-bottom:14px">
          <h3 class="card-h"><span class="dot"></span>核心词汇 ${art.vocab.length}</h3>
          <div class="voc">${art.vocab.map(v => `<div class="voc-i"><b>${M.esc(v.w)}</b>${M.esc(v.d)}</div>`).join('')}</div>
        </div>
        <div class="card" style="margin-bottom:14px">
          <h3 class="card-h"><span class="dot"></span>句法与译法笔记</h3>
          ${art.notes.map((n, i) => `<p class="note" style="margin:0 0 10px"><b>${i + 1}.</b> ${M.esc(n)}</p>`).join('')}
        </div>
        <div class="card">
          <h3 class="card-h"><span class="dot"></span>篇目索引</h3>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            ${ECONOMIST.map((a, i) => `<button class="btn btn-sm ${a.id === art.id ? '' : 'btn-ghost'}" data-eco="${a.id}" title="${M.esc(a.title)}" style="min-width:34px;padding:4px 8px">${read[a.id] ? '✓' : i + 1}</button>`).join('')}
          </div>
          <p class="note" style="margin-bottom:0">共 ${ECONOMIST.length} 篇，每日按日期自动轮换一篇；✓ 表示已精读。</p>
        </div>
      </div>
    </div>`;
  }

  /* ---------------- 备考计划 ---------------- */
  function planHTML() {
    const db = M.db(), t = todayTasks(), c = db.study.checkins || {};
    const exam = db.settings.examDate || '';
    let left = '';
    if (exam) { const d = M.daysBetween(M.today(), exam); left = d >= 0 ? d + ' 天' : '已过期'; }
    const cells = [];
    for (let i = 55; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const k = M.today(d);
      cells.push(`<div title="${k}${c[k] ? ' 已打卡' : ''}" style="width:100%;aspect-ratio:1;border-radius:4px;background:${c[k] ? 'var(--c-study)' : 'var(--surface-2)'};border:1px solid var(--line);opacity:${c[k] ? 1 : .7}"></div>`);
    }
    const total = Object.keys(c).length;
    return `<div class="grid g-side">
      <div class="card">
        <h3 class="card-h"><span class="dot"></span>今日任务 · ${M.today()} ${M.weekday(M.today())}</h3>
        ${CATTI.dailyTasks.map(x => `<div class="chk ${t[x.id] ? 'done' : ''}" data-task="${x.id}">
          <span class="chk-box">${t[x.id] ? '✓' : ''}</span>
          <span class="chk-t">${M.esc(x.text)}</span>
          <span class="pill">${x.min} 分钟</span></div>`).join('')}
        <div class="form-act">
          <button class="btn" data-act="plancheck">${c[M.today()] ? '✓ 今日已打卡' : '完成今日打卡'}</button>
          <button class="btn btn-ghost" data-act="planreset">重置今日任务</button>
        </div>
      </div>
      <div>
        <div class="grid g2" style="margin-bottom:14px">
          <div class="stat" style="--sc:var(--c-study)"><div class="k">连续打卡</div><div class="v">${streak()}</div><div class="s">天</div></div>
          <div class="stat" style="--sc:var(--gold)"><div class="k">累计打卡</div><div class="v">${total}</div><div class="s">天</div></div>
        </div>
        <div class="card" style="margin-bottom:14px">
          <h3 class="card-h"><span class="dot"></span>考试倒计时</h3>
          <div class="field"><label>目标考试日期</label><input class="input" type="date" id="examDate" value="${exam}" data-act="examdate"></div>
          <div style="text-align:center;padding:14px 0 4px">
            <div style="font-size:32px;font-weight:800;color:var(--c-study)">${left || '—'}</div>
            <div class="note">${exam ? '距离 ' + exam : '设置日期后显示倒计时'}</div>
          </div>
        </div>
        <div class="card">
          <h3 class="card-h"><span class="dot"></span>最近 8 周打卡</h3>
          <div style="display:grid;grid-template-columns:repeat(14,1fr);gap:4px">${cells.join('')}</div>
        </div>
      </div>
    </div>`;
  }

  /* ---------------- 朗读 ---------------- */
  function say(text) {
    if (!('speechSynthesis' in window)) { M.toast('当前浏览器不支持朗读', 'warn'); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = /[\u4e00-\u9fa5]/.test(text) ? 'zh-CN' : 'en-US';
    u.rate = .95; speechSynthesis.speak(u);
  }

  /* ---------------- 渲染 ---------------- */
  function render() {
    const box = $('#studyBody'); if (!box) return;
    box.innerHTML = mod === 'catti' ? cattiHTML() : mod === 'eco' ? ecoHTML() : planHTML();
    syncHero();
  }

  /* ---------------- 统一事件委托 ---------------- */
  function onClick(e) {
    const modT = e.target.closest('[data-mod]'); if (modT) { mod = modT.dataset.mod; render(); return; }
    const lvT = e.target.closest('[data-lv]'); if (lvT) { lv = lvT.dataset.lv; render(); return; }
    const ptT = e.target.closest('[data-part]'); if (ptT) { part = ptT.dataset.part; render(); return; }
    const ecoT = e.target.closest('[data-eco]'); if (ecoT) { ecoId = ecoT.dataset.eco; render(); return; }
    const act = e.target.closest('[data-act]'); if (act) { handleAct(act.dataset.act, act); return; }
    const fl = e.target.closest('.flash'); if (fl) { fl.classList.toggle('flip'); return; }
    const sp = e.target.closest('.speak'); if (sp) { say(sp.dataset.say); return; }
    const tg = e.target.closest('.toggle'); if (tg) { const s = tg.closest('.sent'); if (s) s.classList.toggle('show'); return; }
    const ep = e.target.closest('.eco-p'); if (ep) { ep.classList.toggle('show'); return; }
    const tk = e.target.closest('[data-task]'); if (tk) { toggleTask(tk.dataset.task); return; }
  }

  function onDateChange(e) {
    const el = e.target.closest('[data-act="examdate"]'); if (!el) return;
    M.db().settings.examDate = el.value; M.save(); render();
  }

  function handleAct(act, el) {
    if (act === 'vocmore' || act === 'transmore' || act === 'interpmore') { vocabSalt++; render(); return; }
    if (act === 'vocall') {
      const L = level();
      M.modal(L.name + ' · 全部热词（' + L.vocab.length + '）',
        '<div class="tb-wrap"><table><thead><tr><th>English</th><th>中文</th><th>类别</th></tr></thead><tbody>' +
        L.vocab.map(v => `<tr><td>${M.esc(v.en)}</td><td>${M.esc(v.cn)}</td><td><span class="pill">${M.esc(v.tag)}</span></td></tr>`).join('') +
        '</tbody></table></div>');
      return;
    }
    if (act === 'ecoall') {
      const ps = $$('.eco-p'), any = ps.some(p => !p.classList.contains('show'));
      ps.forEach(p => p.classList.toggle('show', any)); return;
    }
    if (act === 'ecosay') {
      const art = ECONOMIST.find(a => a.id === ecoId); if (art) say(art.paras.map(p => p.en).join(' ')); return;
    }
    if (act === 'ecostop') { if (window.speechSynthesis) speechSynthesis.cancel(); return; }
    if (act === 'econew') {
      let n; do { n = ECONOMIST[Math.floor(Math.random() * ECONOMIST.length)]; } while (n.id === ecoId && ECONOMIST.length > 1);
      ecoId = n.id; render(); return;
    }
    if (act === 'ecoread') {
      const db = M.db(); db.study.ecoRead = db.study.ecoRead || {};
      if (db.study.ecoRead[ecoId]) delete db.study.ecoRead[ecoId]; else db.study.ecoRead[ecoId] = M.today();
      M.save(); render(); M.toast('已更新精读记录', 'ok'); return;
    }
    if (act === 'plancheck') { doCheck(); return; }
    if (act === 'planreset') { const db = M.db(); if (db.study.tasks) delete db.study.tasks[M.today()]; M.save(); render(); return; }
  }

  function toggleTask(id) {
    const db = M.db(), d = M.today();
    db.study.tasks = db.study.tasks || {}; db.study.tasks[d] = db.study.tasks[d] || {};
    db.study.tasks[d][id] = !db.study.tasks[d][id];
    M.save(); render();
  }

  function doCheck() {
    const db = M.db(), d = M.today();
    db.study.checkins = db.study.checkins || {};
    if (db.study.checkins[d]) { M.toast('今天已经打过卡啦', 'warn'); return; }
    db.study.checkins[d] = 1; M.save();
    M.toast('打卡成功！连续 ' + streak() + ' 天 🎉', 'ok');
    render();
  }

  M.study = {
    init() {
      const box = $('#studyBody');
      if (box) { box.addEventListener('click', onClick); box.addEventListener('change', onDateChange); }
      // 外层 CATTI / 经济学人 / 备考计划 三个大 tab（在静态 HTML 里）
      $$('#studyTabs .tab').forEach(b => b.onclick = () => {
        $$('#studyTabs .tab').forEach(x => x.classList.remove('is-active'));
        b.classList.add('is-active'); mod = b.dataset.mod; render();
      });
      $('#studyCheck').onclick = doCheck;
      M.on('data', syncHero);
      render();
    },
    render, syncHero
  };
})(window.MW);
