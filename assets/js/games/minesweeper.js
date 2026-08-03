/* ================= 扫雷 Minesweeper ================= */
(function (M) {
  'use strict';
  M.gameDefs = M.gameDefs || {};

  // 难度 → 行 / 列 / 雷数
  const DIFF = {
    easy:   { r: 9,  c: 9,  m: 10, label: '简单' },
    normal: { r: 14, c: 14, m: 30, label: '普通' },
    hard:   { r: 16, c: 16, m: 45, label: '困难' }
  };
  const diffKey = () => M.db().games.difficulty || 'normal';

  M.gameDefs.minesweeper = {
    name: '扫雷', icon: '💣',
    mount(stage, panel) {
      const dk = diffKey();
      const cfg = DIFF[dk] || DIFF.normal;
      const R = cfg.r, C = cfg.c, MN = cfg.m;

      let grid, started, over, flagMode, timer, t0, minesLeft, revealedCount;
      const cleanups = [];

      const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

      function build() {
        grid = [];
        for (let i = 0; i < R * C; i++) grid.push({ mine: false, adj: 0, rev: false, flag: false, boom: false });
      }

      // 首次点击后布雷，保证首点及其周围安全
      function placeMines(safe) {
        const forbid = new Set([safe]);
        const sr = Math.floor(safe / C), sc = safe % C;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          const y = sr + dy, x = sc + dx;
          if (y >= 0 && y < R && x >= 0 && x < C) forbid.add(y * C + x);
        }
        let placed = 0;
        while (placed < MN) {
          const i = rand(0, R * C - 1);
          if (forbid.has(i) || grid[i].mine) continue;
          grid[i].mine = true; placed++;
        }
        for (let i = 0; i < R * C; i++) {
          if (grid[i].mine) continue;
          const y = Math.floor(i / C), x = i % C; let n = 0;
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
            const yy = y + dy, xx = x + dx;
            if (yy < 0 || yy >= R || xx < 0 || xx >= C) continue;
            if (grid[yy * C + xx].mine) n++;
          }
          grid[i].adj = n;
        }
      }

      function startTimer() {
        t0 = Date.now();
        timer = setInterval(() => {
          const t = M.$('#msTime');
          if (t) t.textContent = ((Date.now() - t0) / 1000).toFixed(0) + 's';
          else updatePanel();
        }, 1000);
      }
      function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }

      function flood(i) {
        const stack = [i];
        while (stack.length) {
          const k = stack.pop();
          const c = grid[k];
          if (c.rev || c.flag || c.mine) continue;
          c.rev = true; revealedCount++;
          if (c.adj === 0) {
            const y = Math.floor(k / C), x = k % C;
            for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
              const yy = y + dy, xx = x + dx;
              if (yy < 0 || yy >= R || xx < 0 || xx >= C) continue;
              const nk = yy * C + xx;
              if (!grid[nk].rev && !grid[nk].mine) stack.push(nk);
            }
          }
        }
      }

      function reveal(i) {
        if (over) return;
        const cell = grid[i];
        if (cell.rev || cell.flag) return;
        if (cell.mine) { lose(i); return; }
        if (!started) { started = true; placeMines(i); startTimer(); }
        flood(i);
        checkEnd();
        draw();
      }

      function toggleFlag(i) {
        const cell = grid[i];
        if (cell.rev || over) return;
        cell.flag = !cell.flag;
        minesLeft += cell.flag ? -1 : 1;
        draw(); updatePanel();
      }

      function lose(mi) {
        over = true; stopTimer();
        grid.forEach(c => { if (c.mine) c.rev = true; });
        if (mi != null) grid[mi].boom = true;
        M.gameLog('minesweeper');
        draw(); updatePanel();
        M.toast('踩雷了！💥', 'err');
      }

      function checkEnd() {
        if (over) return;
        if (revealedCount === R * C - MN) {   // 全部安全格已翻开 → 胜
          over = true; stopTimer();
          grid.forEach(c => { if (c.mine) c.flag = true; });
          const ms = Date.now() - t0;
          M.saveBest('minesweeper_' + dk, ms, true);
          M.gameLog('minesweeper');
          draw(); updatePanel();
          M.toast('排雷成功！⏱ ' + (ms / 1000).toFixed(1) + 's 🎉', 'ok');
        }
      }

      function draw() {
        let h = '<div class="mine-grid" style="grid-template-columns:repeat(' + C + ',1fr)">';
        for (let i = 0; i < R * C; i++) {
          const c = grid[i];
          let cls = 'mc', txt = '';
          if (c.rev) {
            cls += ' rev';
            if (c.mine) { cls += ' mine'; txt = '💣'; if (c.boom) cls += ' boom'; }
            else if (c.adj > 0) { cls += ' n' + c.adj; txt = c.adj; }
          } else if (c.flag) { cls += ' flag'; txt = '🚩'; }
          h += '<button class="' + cls + '" data-i="' + i + '">' + txt + '</button>';
        }
        h += '</div>';
        stage.innerHTML = h;
      }

      function updatePanel() {
        const ms = started ? (Date.now() - t0) : 0;
        const best = M.db().games.best['minesweeper_' + dk];
        const bestTxt = best ? (best / 1000).toFixed(1) + 's' : '—';
        panel.innerHTML =
          '<div class="g-stats">' +
            '<div class="g-stat"><div class="k">难度</div><div class="v">' + cfg.label + '</div></div>' +
            '<div class="g-stat"><div class="k">剩余雷</div><div class="v">' + minesLeft + '</div></div>' +
            '<div class="g-stat"><div class="k">时间</div><div class="v" id="msTime">' + (ms / 1000).toFixed(0) + 's</div></div>' +
            '<div class="g-stat"><div class="k">最佳</div><div class="v">' + bestTxt + '</div></div>' +
          '</div>' +
          '<div class="form-act" style="justify-content:center">' +
            '<button class="btn btn-sm ' + (flagMode ? 'btn-warn' : 'btn-ghost') + '" id="msFlag">🚩 标记模式' + (flagMode ? '(开)' : '') + '</button>' +
            '<button class="btn btn-sm btn-ghost" id="msReset">重开</button>' +
          '</div>' +
          '<p class="note" style="text-align:center">左键翻开 · 右键 / 标记模式插旗 · 数字=周围雷数。首次点击保证安全。</p>';
        const fb = M.$('#msFlag'); if (fb) fb.onclick = () => { flagMode = !flagMode; updatePanel(); };
        const rb = M.$('#msReset'); if (rb) rb.onclick = () => reset();
      }

      function reset() {
        stopTimer();
        started = false; over = false; flagMode = false;
        minesLeft = MN; revealedCount = 0;
        build(); draw(); updatePanel();
      }

      function onClick(e) {
        const b = e.target.closest('.mc'); if (!b) return;
        const i = +b.dataset.i;
        if (flagMode) toggleFlag(i); else reveal(i);
      }
      function onCtx(e) {
        e.preventDefault();
        const b = e.target.closest('.mc'); if (!b) return;
        toggleFlag(+b.dataset.i);
      }

      stage.addEventListener('click', onClick);
      stage.addEventListener('contextmenu', onCtx);
      cleanups.push(() => { stage.removeEventListener('click', onClick); stage.removeEventListener('contextmenu', onCtx); });

      reset();

      return function () {
        stopTimer();
        cleanups.forEach(f => f());
      };
    }
  };
})(window.MW);
