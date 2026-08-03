/* ================= 游戏调度器 ================= */
(function (M) {
  'use strict';
  M.gameDefs = M.gameDefs || {};

  /* 滑动手势：返回清理函数；cb(dx,dy) 仅给出主方向单位向量 */
  M.swipe = function (el, cb) {
    let sx = 0, sy = 0, active = false;
    const THR = 24;
    function down(e) {
      const t = e.changedTouches ? e.changedTouches[0] : e;
      sx = t.clientX; sy = t.clientY; active = true;
    }
    function up(e) {
      if (!active) return; active = false;
      const t = e.changedTouches ? e.changedTouches[0] : e;
      const dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) < THR && Math.abs(dy) < THR) return;
      if (Math.abs(dx) > Math.abs(dy)) cb(dx > 0 ? 1 : -1, 0);
      else cb(0, dy > 0 ? 1 : -1);
    }
    el.addEventListener('touchstart', down, { passive: true });
    el.addEventListener('touchend', up, { passive: true });
    return () => { el.removeEventListener('touchstart', down); el.removeEventListener('touchend', up); };
  };

  /* 记录一次游玩，更新今日局数与最高纪录显示 */
  M.gameLog = function (name) {
    const db = M.db();
    db.games.plays[name] = (db.games.plays[name] || 0) + 1;
    db.games.daily = db.games.daily || {};
    const today = M.today();
    db.games.daily[today] = (db.games.daily[today] || 0) + 1;
    M.save({ silent: true });
    updateHeader();
  };

  function updateHeader() {
    const db = M.db(), g = db.games || {};
    const today = M.today();
    const played = (g.daily && g.daily[today]) || 0;
    const p = M.$('#gamePlayed'); if (p) p.textContent = played + ' 局';
    const best = g.best || {};
    let label = '—';
    if (best.match3) label = '消消乐 ' + best.match3;
    else {
      const msKeys = ['minesweeper_easy', 'minesweeper_normal', 'minesweeper_hard'];
      const msBest = Math.min.apply(null, msKeys.map(k => best[k] || Infinity));
      if (isFinite(msBest)) label = '扫雷 ' + (msBest / 1000).toFixed(0) + 's';
      else if (best.sudoku) label = '数独 ' + best.sudoku + 's';
      else if (best.sokobanCleared) label = '推箱子 ' + best.sokobanCleared + ' 关';
    }
    const b = M.$('#gameBest'); if (b) b.textContent = label;
  }
  M.updateGameHeader = updateHeader;

  function saveBest(key, val, minBetter) {
    const db = M.db();
    db.games.best = db.games.best || {};
    const cur = db.games.best[key];
    if (cur == null) db.games.best[key] = val;
    else db.games.best[key] = minBetter ? Math.min(cur, val) : Math.max(cur, val);
    M.save({ silent: true });
    updateHeader();
  }
  M.saveBest = saveBest;

  /* 调度：根据 gameTabs 切换游戏（仅游戏视图激活时挂载，避免全局监听器串扰） */
  let cleanup = null, bound = false, body = null, activeGame = null;

  function mount(name) {
    if (cleanup) { try { cleanup(); } catch (e) { } cleanup = null; }
    if (!name || !body) return;
    activeGame = name;
    body.innerHTML = '<div class="game-wrap"><div class="game-stage" id="gStage"></div><div class="gpanel" id="gPanel"></div></div>';
    const def = M.gameDefs[name];
    if (!def) return;
    const stage = M.$('#gStage'), panel = M.$('#gPanel');
    cleanup = def.mount(stage, panel) || null;
  }

  function syncDiffBar() {
    const bar = M.$('#gameDiff'); if (!bar) return;
    const cur = M.db().games.difficulty || 'normal';
    M.$$('.tab', bar).forEach(t => t.classList.toggle('is-active', t.dataset.diff === cur));
  }

  M.initGames = function () {
    const tabs = M.$('#gameTabs');
    body = M.$('#gameBody');
    if (!tabs || !body) return;
    if (!bound) {
      bound = true;
      tabs.addEventListener('click', e => {
        const b = e.target.closest('.tab'); if (!b) return;
        M.$$('.tab', tabs).forEach(t => t.classList.remove('is-active'));
        b.classList.add('is-active');
        mount(b.dataset.game);
      });
      const diffBar = M.$('#gameDiff');
      if (diffBar) {
        syncDiffBar();
        diffBar.addEventListener('click', e => {
          const b = e.target.closest('.tab'); if (!b) return;
          M.db().games.difficulty = b.dataset.diff;
          M.save({ silent: true });
          syncDiffBar();
          if (activeGame) mount(activeGame);   // 重新挂载当前游戏以套用新难度
        });
      }
    } else {
      syncDiffBar();
    }
  };

  M.enterGame = function () {
    M.initGames();
    if (cleanup) return;
    const tabs = M.$('#gameTabs');
    const first = tabs.querySelector('.tab.is-active') || tabs.querySelector('.tab');
    mount(first.dataset.game);
    updateHeader();
  };

  M.leaveGame = function () {
    if (cleanup) { try { cleanup(); } catch (e) { } cleanup = null; }
  };
})(window.MW);
