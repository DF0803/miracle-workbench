/* ================= 消消乐 Match-3 ================= */
(function (M) {
  'use strict';
  M.gameDefs = M.gameDefs || {};

  /* 难度参数：棋盘尺寸 N、宝石种类 TYPES、限定步数 MOVES_MAX、目标分 TARGET */
  const DIFF = {
    easy:   { N: 6, TYPES: 5, MOVES_MAX: 25, TARGET: 500 },
    normal: { N: 8, TYPES: 6, MOVES_MAX: 20, TARGET: 1000 },
    hard:   { N: 8, TYPES: 6, MOVES_MAX: 14, TARGET: 1600 }
  };
  const diffKey = () => M.db().games.difficulty || 'normal';

  const wait = ms => new Promise(r => setTimeout(r, ms));
  const adj = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;

  M.gameDefs.match3 = {
    name: '消消乐', icon: '💎',
    mount(stage, panel) {
      const dconf = DIFF[diffKey()] || DIFF.normal;
      let N = dconf.N, TYPES = dconf.TYPES, MOVES_MAX = dconf.MOVES_MAX, TARGET = dconf.TARGET;
      let board = [], cells = [], sel = null, moves = 0, score = 0, busy = false, dead = false;

      const rnd = () => Math.floor(Math.random() * TYPES);

      /* 生成无初始三连、且存在可消除步的棋盘 */
      function make() {
        board = [];
        for (let y = 0; y < N; y++) {
          board[y] = [];
          for (let x = 0; x < N; x++) {
            let t;
            do { t = rnd(); }
            while ((x >= 2 && board[y][x - 1] === t && board[y][x - 2] === t) ||
                   (y >= 2 && board[y - 1][x] === t && board[y - 2][x] === t));
            board[y][x] = t;
          }
        }
      }

      function findMatches() {
        const m = Array.from({ length: N }, () => Array(N).fill(false));
        for (let y = 0; y < N; y++) {
          let rs = 0;
          for (let x = 1; x <= N; x++) {
            if (x < N && board[y][x] === board[y][rs]) continue;
            if (x - rs >= 3) for (let k = rs; k < x; k++) m[y][k] = true;
            rs = x;
          }
        }
        for (let x = 0; x < N; x++) {
          let rs = 0;
          for (let y = 1; y <= N; y++) {
            if (y < N && board[y][x] === board[rs][x]) continue;
            if (y - rs >= 3) for (let k = rs; k < y; k++) m[k][x] = true;
            rs = y;
          }
        }
        return m;
      }
      function anyMatch() {
        const m = findMatches();
        for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (m[y][x]) return true;
        return false;
      }
      /* 是否存在任意一步可消除（用于死局检测） */
      function hasMove() {
        for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
          if (x < N - 1) { swap({ x, y }, { x: x + 1, y }); const ok = anyMatch(); swap({ x, y }, { x: x + 1, y }); if (ok) return true; }
          if (y < N - 1) { swap({ x, y }, { x, y: y + 1 }); const ok = anyMatch(); swap({ x, y }, { x, y: y + 1 }); if (ok) return true; }
        }
        return false;
      }

      /* 一次性构建 64 个持久单元格（便于 CSS 过渡动画） */
      function build() {
        let h = `<div class="match3" style="grid-template-columns:repeat(${N},1fr)">`;
        for (let y = 0; y < N; y++) for (let x = 0; x < N; x++)
          h += `<div class="m3-cell" data-x="${x}" data-y="${y}"></div>`;
        h += '</div>';
        stage.innerHTML = h;
        cells = [];
        for (let y = 0; y < N; y++) {
          cells[y] = [];
          for (let x = 0; x < N; x++)
            cells[y][x] = stage.querySelector(`.m3-cell[data-x="${x}"][data-y="${y}"]`);
        }
      }

      function paint() {
        for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
          const v = board[y][x];
          const cell = cells[y][x];
          cell.classList.remove('clearing');
          const wasEmpty = cell.classList.contains('empty');
          if (v < 0) {
            cell.classList.add('empty');
            cell.removeAttribute('data-g');
          } else {
            cell.classList.remove('empty');
            cell.setAttribute('data-g', v);
            if (wasEmpty) { cell.classList.remove('spawn'); void cell.offsetWidth; cell.classList.add('spawn'); }
          }
          cell.classList.toggle('sel', sel && sel.x === x && sel.y === y);
        }
      }

      function updatePanel() {
        const dk = diffKey();
        const best = M.db().games.best['match3_' + dk] || 0;
        const remain = Math.max(0, MOVES_MAX - moves);
        const pct = Math.min(100, Math.round(score / TARGET * 100));
        panel.innerHTML =
          `<div class="g-stats">
            <div class="g-stat"><div class="k">得分</div><div class="v">${score}</div></div>
            <div class="g-stat"><div class="k">剩余步数</div><div class="v" style="color:${remain <= 5 ? '#ff6b81' : 'inherit'}">${remain}</div></div>
            <div class="g-stat"><div class="k">最佳</div><div class="v">${best}</div></div>
          </div>
          <div class="m3-prog"><div class="m3-prog-bar" style="width:${pct}%"></div></div>
          <div class="m3-prog-txt">目标 ${TARGET} 分 · 已达成 ${pct}%</div>
          <div class="form-act" style="justify-content:center">
            <button class="btn btn-sm btn-ghost" id="m3New">↻ 重开一局</button>
          </div>
          <p class="note" style="text-align:center">点击或滑动交换相邻宝石，凑齐 3 个及以上同色即可消除并连锁得分。每局仅 ${MOVES_MAX} 步，达到 ${TARGET} 分即获胜。</p>`;
        const nb = M.$('#m3New', panel); if (nb) nb.onclick = start;
      }

      function saveBest() {
        const db = M.db();
        db.games.best = db.games.best || {};
        const dk = diffKey();
        if (score > (db.games.best['match3_' + dk] || 0)) db.games.best['match3_' + dk] = score;
        if (score > (db.games.best.match3 || 0)) db.games.best.match3 = score;  // 总榜，供头部显示
        M.save({ silent: true });
        M.updateGameHeader();
      }

      /* 下落 + 顶部补充新宝石 */
      function gravityRefill() {
        for (let x = 0; x < N; x++) {
          const col = [];
          for (let y = N - 1; y >= 0; y--) if (board[y][x] !== -1) col.push(board[y][x]);
          while (col.length < N) col.push(rnd());
          for (let y = N - 1, i = 0; y >= 0; y--, i++) board[y][x] = col[i];
        }
      }

      async function resolve() {
        let combo = 0;
        while (true) {
          const m = findMatches();
          const hit = [];
          for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (m[y][x]) hit.push({ x, y });
          if (!hit.length) break;
          combo++;
          score += hit.length * 10 * combo;
          hit.forEach(c => cells[c.y][c.x].classList.add('clearing'));   // 先播放消除动画
          await wait(200);
          hit.forEach(c => { board[c.y][c.x] = -1; });
          gravityRefill();
          paint();                                                        // 下落/新生带 spawn 动画
          await wait(190);
        }
        return combo;
      }

      function swap(a, b) {
        const t = board[a.y][a.x];
        board[a.y][a.x] = board[b.y][b.x];
        board[b.y][b.x] = t;
      }

      async function trySwap(a, b) {
        if (busy || dead) return;
        busy = true;
        swap(a, b); paint();
        if (!anyMatch()) {                          // 无效交换：回退且不扣步
          await wait(150);
          swap(a, b); paint(); busy = false; return;
        }
        moves++;
        await resolve();
        saveBest();
        if (moves >= MOVES_MAX) gameOver();
        else if (!hasMove()) reshuffle();           // 无可行步则自动重排（不扣步）
        updatePanel();
        busy = false;
      }

      function reshuffle() {
        do { make(); } while (!hasMove());
        sel = null;
        paint();
        if (M.toast) M.toast('无可消除，已自动重排', 'ok');
      }

      function removeOverlay() { const o = stage.querySelector('.m3-overlay'); if (o) o.remove(); }
      function gameOver() {
        dead = true;
        removeOverlay();
        const win = score >= TARGET;
        const ov = document.createElement('div');
        ov.className = 'm3-overlay';
        ov.innerHTML =
          `<div class="m3-ov-card">
            <div class="m3-ov-emoji">${win ? '🏆' : '💤'}</div>
            <div class="m3-ov-title">${win ? '达成目标！' : '步数用尽'}</div>
            <div class="m3-ov-score">本局得分 <b>${score}</b></div>
            <div class="m3-ov-sub">目标 ${TARGET} 分 · 历史最佳 ${M.db().games.best['match3_' + diffKey()] || 0}</div>
            <button class="btn btn-sm" id="m3Again">再来一局</button>
          </div>`;
        stage.appendChild(ov);
        const ab = M.$('#m3Again', ov); if (ab) ab.onclick = start;
      }

      stage.addEventListener('click', e => {
        const c = e.target.closest('.m3-cell'); if (!c || busy || dead) return;
        const x = +c.dataset.x, y = +c.dataset.y;
        if (!sel) { sel = { x, y }; paint(); return; }
        if (sel.x === x && sel.y === y) { sel = null; paint(); return; }
        if (adj(sel, { x, y })) { const s = sel; sel = null; trySwap(s, { x, y }); }
        else { sel = { x, y }; paint(); }
      });

      const sw = M.swipe(stage, (dx, dy) => {
        if (busy || dead || !sel) return;
        const nx = sel.x + dx, ny = sel.y + dy;
        if (nx < 0 || nx >= N || ny < 0 || ny >= N) return;
        const s = sel; sel = null; trySwap(s, { x: nx, y: ny });
      });

      function start() {
        do { make(); } while (!hasMove());
        sel = null; moves = 0; score = 0; dead = false; busy = false;
        build(); paint(); updatePanel(); removeOverlay();
      }
      start();

      return () => { dead = true; try { sw(); } catch (e) { } };
    }
  };
})(window.MW);
