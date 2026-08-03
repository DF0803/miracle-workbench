/* ================= 数独 Sudoku ================= */
(function (M) {
  'use strict';
  M.gameDefs = M.gameDefs || {};

  const DIFF = { easy: 40, medium: 48, hard: 54 };

  function emptyGrid() { return Array.from({ length: 9 }, () => Array(9).fill(0)); }
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function canPlace(g, r, c, v) {
    for (let i = 0; i < 9; i++) if (g[r][i] === v || g[i][c] === v) return false;
    const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (g[br + i][bc + j] === v) return false;
    return true;
  }
  function fill(g) {
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      if (g[r][c] === 0) {
        const cand = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const v of cand) if (canPlace(g, r, c, v)) { g[r][c] = v; if (fill(g)) return true; g[r][c] = 0; }
        return false;
      }
    }
    return true;
  }
  function gen(diff) {
    const full = emptyGrid(); fill(full);
    const sol = full.map(r => r.slice());
    const pos = []; for (let i = 0; i < 81; i++) pos.push(i);
    shuffle(pos);
    let h = 0; const holes = DIFF[diff] || 48;
    for (const p of pos) { if (h >= holes) break; full[Math.floor(p / 9)][p % 9] = 0; h++; }
    return { sol, puzzle: full };
  }

  M.gameDefs.sudoku = {
    name: '数独', icon: '🔢',
    mount(stage, panel) {
      let grid, given, sol, sel = null, elapsed = 0, timer = null, done = false, gameover = false, dead = false, diff = 'medium';

      function fmt(t) { const m = Math.floor(t / 60), s = t % 60; return m + ':' + M.pad2(s); }
      function countEmpty() { let n = 0; for (let y = 0; y < 9; y++) for (let x = 0; x < 9; x++) if (grid[y][x] === 0) n++; return n; }
      function bestStr() {
        const b = M.db().games.best.sudoku;
        const lab = { easy: '简单', medium: '中等', hard: '困难' }[diff];
        return b ? (b + 's') : '—';
      }

      function conflict(x, y, v) {
        for (let i = 0; i < 9; i++) { if (i !== x && grid[y][i] === v) return true; if (i !== y && grid[i][x] === v) return true; }
        const bx = Math.floor(x / 3) * 3, by = Math.floor(y / 3) * 3;
        for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
          const nx = bx + i, ny = by + j;
          if ((nx !== x || ny !== y) && grid[ny][nx] === v) return true;
        }
        return false;
      }

      function redraw() {
        let h = '<div class="sudoku">';
        for (let y = 0; y < 9; y++) for (let x = 0; x < 9; x++) {
          const v = grid[y][x];
          const cl = ['su-c'];
          if (x % 3 === 2 && x !== 8) cl.push('br');
          if (y % 3 === 2 && y !== 8) cl.push('bb');
          if (given[y][x]) cl.push('fixed'); else if (v) cl.push('user');
          if (sel && sel.x === x && sel.y === y) cl.push('sel');
          else if (sel && (sel.x === x || sel.y === y ||
            (Math.floor(sel.x / 3) === Math.floor(x / 3) && Math.floor(sel.y / 3) === Math.floor(y / 3)))) cl.push('peer');
          if (v && conflict(x, y, v)) cl.push('err');
          h += `<div class="${cl.join(' ')}" data-x="${x}" data-y="${y}">${v || ''}</div>`;
        }
        h += '</div>';
        stage.innerHTML = h;
      }

      function updatePanel() {
        const lab = { easy: '简单', medium: '中等', hard: '困难' }[diff];
        panel.innerHTML =
          `<div class="g-stats">
            <div class="g-stat"><div class="k">用时</div><div class="v" id="suTime">${fmt(elapsed)}</div></div>
            <div class="g-stat"><div class="k">难度</div><div class="v">${lab}</div></div>
            <div class="g-stat"><div class="k">最佳</div><div class="v">${bestStr()}</div></div>
            <div class="g-stat"><div class="k">剩余</div><div class="v">${countEmpty()}</div></div>
          </div>
          <div class="seg" style="display:flex;gap:6px;margin-top:2px">
            <button class="btn btn-sm btn-ghost" data-d="easy" style="${diff === 'easy' ? 'background:var(--c-game);color:#fff' : ''}">简单</button>
            <button class="btn btn-sm btn-ghost" data-d="medium" style="${diff === 'medium' ? 'background:var(--c-game);color:#fff;border:1px solid var(--line)' : 'border:1px solid var(--line)'};border-radius:8px;font-size:12px;padding:5px 10px">中等</button>
            <button class="btn btn-sm btn-ghost" data-d="hard" style="${diff === 'hard' ? 'background:var(--c-game);color:#fff;border:1px solid var(--line)' : 'border:1px solid var(--line)'};border-radius:8px;font-size:12px;padding:5px 10px">困难</button>
          </div>
          <div class="su-pad">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button data-n="${n}">${n}</button>`).join('')}
            <button data-n="0" style="grid-column:span 5;aspect-ratio:auto;padding:6px;background:var(--surface-2);border:1px solid var(--line);border-radius:10px">⌫ 擦除</button>
          </div>
          <div class="form-act" style="justify-content:center">
            <button class="btn btn-sm btn-ghost" id="suNew">↻ 新游戏</button>
          </div>
          <p class="note" style="text-align:center">点选空格后点数字填入，或直接用键盘 1-9 / 退格。填满且无误即通关。</p>`;
        M.$$('[data-d]', panel).forEach(b => b.onclick = () => { diff = b.dataset.d; newGame(); });
        M.$$('[data-n]', panel).forEach(b => b.onclick = () => setVal(+b.dataset.n));
        M.$('#suNew', panel).onclick = newGame;
      }

      function updateTime() { const t = M.$('#suTime', panel); if (t) t.textContent = fmt(elapsed); }

      function setVal(n) {
        if (!sel || given[sel.y][sel.x] || done || gameover) return;
        grid[sel.y][sel.x] = n;
        redraw();
        if (countEmpty() === 0 && !grid.flat().some((v, i) => v !== sol[Math.floor(i / 9)][i % 9])) {
          done = true; clearInterval(timer);
          const db = M.db();
          db.games.best = db.games.best || {};
          if (db.games.best.sudoku == null || elapsed < db.games.best.sudoku) db.games.best.sudoku = elapsed;
          M.save({ silent: true });
          M.updateGameHeader();
          M.toast('数独通关！用时 ' + fmt(elapsed) + ' 🎉', 'ok');
          updatePanel();
        }
      }

      function key(e) {
        if (gameover) return;
        if (e.key >= '1' && e.key <= '9') setVal(+e.key);
        else if (e.key === 'Backspace' || e.key === '0') setVal(0);
        else if (sel) {
          const map = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
          if (map[e.key]) { e.preventDefault(); sel.x = (sel.x + map[e.key][0] + 9) % 9; sel.y = (sel.y + map[e.key][1] + 9) % 9; redraw(); }
        }
      }

      function startTimer() {
        if (timer) clearInterval(timer);
        timer = setInterval(() => { if (done || gameover) return; elapsed++; updateTime(); }, 1000);
      }

      function newGame() {
        const g = gen(diff);
        sol = g.sol;
        grid = g.puzzle.map(r => r.slice());
        given = g.puzzle.map(r => r.map(v => v !== 0));
        elapsed = 0; done = false; gameover = false; sel = null;
        startTimer(); redraw(); updatePanel();
      }

      stage.addEventListener('click', e => {
        const c = e.target.closest('.su-c'); if (!c || gameover) return;
        const x = +c.dataset.x, y = +c.dataset.y;
        sel = (sel && sel.x === x && sel.y === y) ? null : { x, y };
        redraw();
      });

      document.addEventListener('keydown', key);
      newGame();

      return () => { dead = true; clearInterval(timer); document.removeEventListener('keydown', key); };
    }
  };
})(window.MW);
