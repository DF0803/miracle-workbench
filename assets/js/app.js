/* ================= Miracle · 主应用 ================= */
(function (M) {
  'use strict';

  const PAGES = {
    home:     { t: '首页',     s: '案件编号 #000 · 今日推理简报' },
    hot:      { t: '每日热搜', s: '案件编号 #001 · 全网舆情侦查' },
    film:     { t: '影视推荐', s: '案件编号 #001b · 剧荒急救' },
    study:    { t: '每日学习', s: '案件编号 #002 · 译者修炼手册' },
    overtime: { t: '加班记录', s: '案件编号 #003 · 工时台账' },
    wool:     { t: '羊毛记录', s: '案件编号 #004 · 收益追踪' },
    ledger:   { t: '记账',     s: '案件编号 #004b · 收支台账' },
    todo:     { t: '待办事项', s: '案件编号 #005 · 侦探笔记本' },
    game:     { t: '游戏',     s: '案件编号 #006 · 头脑体操' }
  };

  /* ---------- 开场动画 ---------- */
  function hideBoot() {
    const b = M.$('#boot');
    if (b) setTimeout(() => b.classList.add('hide'), 650);
  }

  /* ---------- 主题 ---------- */
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    const ico = M.$('#themeIco'); if (ico) ico.textContent = t === 'dark' ? '☀️' : '🌗';
  }
  function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(cur);
    M.db().settings.theme = cur; M.save({ silent: true });
  }

  /* ---------- 导航切换 ---------- */
  function setView(name) {
    if (!PAGES[name]) name = 'home';
    M.$$('.nav-item').forEach(n => n.classList.toggle('is-active', n.dataset.view === name));
    M.$$('.tb-item').forEach(n => n.classList.toggle('is-active', n.dataset.view === name));
    M.$$('.view').forEach(v => v.classList.toggle('is-active', v.id === 'view-' + name));
    const p = PAGES[name];
    M.$('#pageTitle').textContent = p.t;
    M.$('#pageSub').textContent = p.s;
    if (name === 'game') M.enterGame(); else M.leaveGame();
    if (name === 'home') M.home.render();
    if (name === 'film') M.film.render();
    closeDrawer();
    M.db().settings.lastView = name; M.save({ silent: true });
  }
  M.setView = setView;

  /* ---------- 移动端抽屉 ---------- */
  function openDrawer() { M.$('#sidebar').classList.add('open'); M.$('#scrim').classList.add('show'); }
  function closeDrawer() { M.$('#sidebar').classList.remove('open'); M.$('#scrim').classList.remove('show'); }

  /* ---------- 时钟 ---------- */
  function tickClock() {
    const el = M.$('#clock'); if (el) el.textContent = M.hhmm(new Date());
  }

  /* ---------- 云同步弹窗 ---------- */
  function openSync() {
    const db = M.db();
    const key = db.settings.syncKey || '';
    const link = location.origin + location.pathname + '?sync=' + encodeURIComponent(key || 'YOUR_CODE');
    M.modal('☁️ 云端同步', `
      <p class="note">用同一个<strong>同步码</strong>登录手机与电脑，数据即可互通。同步码随机生成、无需注册。</p>
      <div class="sync-code">
        <input class="input" id="syncInput" placeholder="miracle-xxxxxxxx" value="${M.esc(key)}" style="flex:1">
        <button class="btn btn-sm btn-ghost" id="syncGen">生成</button>
      </div>
      <div class="qr-box">
        <img id="syncQR" alt="同步二维码" src="https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${encodeURIComponent(link)}">
        <p class="note" style="text-align:center;margin:8px 0 0">手机扫码可直接打开已关联的 App</p>
      </div>
      <div class="form-act">
        <button class="btn btn-sm" id="syncSave">保存并同步</button>
        <button class="btn btn-sm btn-ghost" id="syncPull">立即拉取</button>
        <button class="btn btn-sm btn-ghost" id="syncExport">导出备份</button>
        <button class="btn btn-sm btn-ghost" id="syncImport">导入</button>
      </div>
      <p class="note" id="syncTip">当前状态：${key ? '已设置同步码' : '未设置'}</p>
      <input type="file" id="syncFile" accept="application/json" style="display:none">
    `, body => {
      const input = M.$('#syncInput', body);
      const qr = M.$('#syncQR', body);
      const tip = M.$('#syncTip', body);
      function refreshQR() {
        const k = input.value.trim();
        const l = location.origin + location.pathname + '?sync=' + encodeURIComponent(k || 'YOUR_CODE');
        qr.src = 'https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=' + encodeURIComponent(l);
      }
      input.oninput = refreshQR;
      M.$('#syncGen', body).onclick = () => { input.value = M.genKey(); refreshQR(); tip.textContent = '当前状态：新同步码已生成（记得保存并同步）'; };
      M.$('#syncSave', body).onclick = () => {
        const k = input.value.trim();
        if (!/^[A-Za-z0-9_-]{6,}$/.test(k)) { M.toast('同步码至少 6 位字母数字', 'warn'); return; }
        M.db().settings.syncKey = k; M.save({ silent: true });
        M.setSyncState('已设置'); tip.textContent = '当前状态：已设置，正在上传…';
        M.push(false);
      };
      M.$('#syncPull', body).onclick = () => M.pull(false);
      M.$('#syncExport', body).onclick = () => {
        const blob = new Blob([M.exportJSON()], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = 'miracle-backup-' + M.today() + '.json'; a.click();
        M.toast('已导出备份文件', 'ok');
      };
      const file = M.$('#syncFile', body);
      M.$('#syncImport', body).onclick = () => file.click();
      file.onchange = () => {
        const f = file.files[0]; if (!f) return;
        const r = new FileReader();
        r.onload = () => { try { M.importJSON(r.result); M.toast('导入并合并成功', 'ok'); } catch (e) { M.toast('文件格式错误', 'err'); } };
        r.readAsText(f);
      };
    });
  }

  /* ---------- 读取 ?sync= 参数（手机扫码直达） ---------- */
  function consumeSyncParam() {
    const m = location.search.match(/[?&]sync=([^&]+)/);
    if (!m) return;
    try {
      const code = decodeURIComponent(m[1]);
      if (code && code !== 'YOUR_CODE') {
        M.db().settings.syncKey = code; M.save({ silent: true });
      }
      history.replaceState(null, '', location.pathname);
    } catch (e) { }
  }

  /* ---------- 启动 ---------- */
  function boot() {
    consumeSyncParam();
    const db = M.db();
    applyTheme(db.settings.theme || 'light');

    // 事件绑定
    M.$$('.nav-item').forEach(b => b.onclick = () => setView(b.dataset.view));
    M.$$('.tb-item').forEach(b => b.onclick = () => setView(b.dataset.view));
    M.$('#btnMenu').onclick = openDrawer;
    M.$('#scrim').onclick = closeDrawer;
    M.$('#btnTheme').onclick = toggleTheme;
    M.$('#btnTheme2').onclick = toggleTheme;
    M.$('#btnSync').onclick = openSync;
    M.$('#btnSync2').onclick = openSync;
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { M.closeModal(); closeDrawer(); } });

    tickClock(); setInterval(tickClock, 1000);

    // 初始化各模块
    try { M.home.init(); } catch (e) { console.error('home', e); }
    try { M.hot.init(); } catch (e) { console.error('hot', e); }
    try { M.film.init(); } catch (e) { console.error('film', e); }
    try { M.study.init(); } catch (e) { console.error('study', e); }
    try { M.overtime.init(); } catch (e) { console.error('overtime', e); }
    try { M.wool.init(); } catch (e) { console.error('wool', e); }
    try { M.ledger.init(); } catch (e) { console.error('ledger', e); }
    try { M.todo.init(); } catch (e) { console.error('todo', e); }
    M.initGames();

    // 跳到上次视图（默认首页）
    const last = db.settings.lastView || 'home';
    setView(PAGES[last] ? last : 'home');

    // 若有同步码，加载后自动拉取一次
    if (db.settings.syncKey) { M.setSyncState('同步中…'); M.pull(true); }

    M.setSyncState(db.settings.syncKey ? '已同步 ' + M.hhmm() : '同步');
    hideBoot();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window.MW);
