/* ================= 推箱子 Sokoban ================= */
(function (M) {
  'use strict';
  M.gameDefs = M.gameDefs || {};

  const LEVELS = [
    ['#######',
      '#     #',
      '# . $@#',
      '#     #',
      '#######'],
    ['########',
      '#      #',
      '#  .   #',
      '# $  $ #',
      '#  @ . #',
      '#      #',
      '########'],
    ['#########',
      '#       #',
      '# . $   #',
      '#   @   #',
      '#   $ . #',
      '#       #',
      '#########'],
    ['#########',
      '#       #',
      '# ..  $ #',
      '#   ##  #',
      '#  $ @  #',
      '#       #',
      '#########'],
    ['##########',
      '#        #',
      '# .  $ . #',
      '#   ##   #',
      '#  $@$   #',
      '#      . #',
      '#        #',
      '##########'],
    ['##########',
      '#        #',
      '# ..  $$ #',
      '#        #',
      '#  @     #',
      '# ..  $$ #',
      '#        #',
      '##########'],
    ['###########',
      '#         #',
      '# . $   . #',
      '#   ###   #',
      '#  $ @ $  #',
      '#   ###   #',
      '# .     . #',
      '#     $   #',
      '###########'],
    ['###########',
      '#         #',
      '# ..... . #',
      '#         #',
      '#  $$$$$  #',
      '#    @    #',
      '#      $  #',
      '#         #',
      '###########'],
    ['############',
      '#          #',
      '# .. ## ..  #'.slice(0, 12),
      '#    @     #',
      '#  $$  $$  #',
      '#          #',
      '#  .    .  #',
      '#   $  $   #',
      '############'],
    ['############',
      '#          #',
      '# ...  ... #',
      '#          #',
      '#  $$$$$$  #',
      '#     @    #',
      '#          #',
      '#          #',
      '############']
  ];

  /* 难度 → 可玩关卡池（LEVELS 下标）；关卡按复杂度升序，越难越多 */
  const POOL = {
    easy:   [0, 1, 2, 3],
    normal: [0, 1, 2, 3, 4, 5, 6],
    hard:   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  };
  const pool = () => POOL[M.db().games.difficulty || 'normal'] || POOL.normal;

  M.gameDefs.sokoban = {
    name: '推箱子', icon: '📦',
    mount(stage, panel) {
      let li = M.db().games.sokobanLevel || 0;   // li 为关卡池内序号
      let grid, px, py, steps, hist;

      function load(n) {
        const p = pool();
        li = ((n % p.length) + p.length) % p.length;
        const real = p[li];                        // 真实关卡下标（用于最佳分记录）
        grid = LEVELS[real].map(r => r.split(''));
        steps = 0; hist = [];
        grid.forEach((row, y) => row.forEach((c, x) => {
          if (c === '@' || c === '+') { px = x; py = y; }
        }));
        draw();
      }
      const at = (x, y) => (grid[y] && grid[y][x]) || '#';
      const isWall = c => c === '#';
      const isBox = c => c === '$' || c === '*';
      const isGoal = c => c === '.' || c === '*' || c === '+';

      function setCell(x, y, kind) {
        // kind: 'empty' | 'box' | 'player'
        const g = isGoal(at(x, y));
        grid[y][x] = kind === 'box' ? (g ? '*' : '$') : kind === 'player' ? (g ? '+' : '@') : (g ? '.' : ' ');
      }

      function move(dx, dy) {
        const nx = px + dx, ny = py + dy, c = at(nx, ny);
        if (isWall(c)) return;
        const snap = { g: grid.map(r => r.slice()), px, py, steps };
        if (isBox(c)) {
          const bx = nx + dx, by = ny + dy, c2 = at(bx, by);
          if (isWall(c2) || isBox(c2)) return;
          setCell(bx, by, 'box');
        }
        hist.push(snap); if (hist.length > 200) hist.shift();
        setCell(px, py, 'empty');
        setCell(nx, ny, 'player');
        px = nx; py = ny; steps++;
        draw();
        if (win()) setTimeout(finish, 120);
      }
      function win() { return !grid.some(r => r.includes('$')); }
      function undo() { const s = hist.pop(); if (!s) return; grid = s.g; px = s.px; py = s.py; steps = s.steps; draw(); }

      function finish() {
        const db = M.db(), real = pool()[li], k = 'sokoban_l' + real;
        const best = db.games.best[k];
        if (best == null || steps < best) { db.games.best[k] = steps; }
        db.games.best.sokobanCleared = Object.keys(db.games.best).filter(x => x.startsWith('sokoban_l')).length;
        M.gameLog('sokoban');
        M.toast('第 ' + (li + 1) + ' 关通过！用了 ' + steps + ' 步 🎉', 'ok');
        draw();
        setTimeout(() => { if (li < pool().length - 1) load(li + 1); }, 900);
      }

      function draw() {
        const p = pool();
        const real = p[li];
        const w = grid[0].length, cs = Math.max(20, Math.min(40, Math.floor(Math.min(stage.clientWidth - 40, 460) / w)));
        stage.innerHTML = `<div class="sokoban" style="grid-template-columns:repeat(${w},${cs}px)">` +
          grid.map(row => row.map(c => {
            const cls = c === '#' ? 'sk-wall' : isGoal(c) ? 'sk-goal' : 'sk-floor';
            let inner;
            if (c === '@' || c === '+') inner = '🕵️';
            else if (c === '*') inner = '<span class="sk-box on"></span>';
            else if (c === '$') inner = '<span class="sk-box"></span>';
            else if (isGoal(c)) inner = '🎯';
            else inner = '';
            return `<div class="sk-cell ${cls}" style="--cs:${cs}px">${inner}</div>`;
          }).join('')).join('') + '</div>';
        const db = M.db();
        panel.innerHTML = `
          <div class="g-stats">
            <div class="g-stat"><div class="k">关卡</div><div class="v">${li + 1}/${p.length}</div></div>
            <div class="g-stat"><div class="k">步数</div><div class="v">${steps}</div></div>
            <div class="g-stat"><div class="k">最佳</div><div class="v">${db.games.best['sokoban_l' + real] != null ? db.games.best['sokoban_l' + real] : '—'}</div></div>
            <div class="g-stat"><div class="k">剩余箱子</div><div class="v">${grid.reduce((s, r) => s + r.filter(c => c === '$').length, 0)}</div></div>
          </div>
          <div class="pad">
            <button class="sp"></button><button data-d="U">▲</button><button class="sp"></button>
            <button data-d="L">◀</button><button data-d="R" style="grid-column:3">▶</button>
            <button class="sp"></button><button data-d="D">▼</button><button class="sp"></button>
          </div>
          <div class="form-act" style="justify-content:center">
            <button class="btn btn-sm btn-ghost" id="skUndo">↶ 撤销</button>
            <button class="btn btn-sm btn-ghost" id="skReset">重来</button>
          </div>
          <div class="form-act" style="justify-content:center">
            <button class="btn btn-sm btn-ghost" id="skPrev">上一关</button>
            <button class="btn btn-sm btn-ghost" id="skNext">下一关</button>
          </div>
          <p class="note" style="text-align:center">方向键 / WASD 移动，Z 撤销，R 重来。把箱子推到 🎯 上即可过关。</p>`;
        M.$$('[data-d]', panel).forEach(b => b.onclick = () => {
          const d = b.dataset.d;
          move(d === 'L' ? -1 : d === 'R' ? 1 : 0, d === 'U' ? -1 : d === 'D' ? 1 : 0);
        });
        M.$('#skUndo', panel).onclick = undo;
        M.$('#skReset', panel).onclick = () => load(li);
        M.$('#skPrev', panel).onclick = () => load(li - 1);
        M.$('#skNext', panel).onclick = () => load(li + 1);
        M.db().games.sokobanLevel = li;
      }

      function key(e) {
        const k = e.key.toLowerCase();
        const map = { arrowup: [0, -1], w: [0, -1], arrowdown: [0, 1], s: [0, 1], arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0] };
        if (map[k]) { e.preventDefault(); move(map[k][0], map[k][1]); }
        else if (k === 'z') undo();
        else if (k === 'r') load(li);
      }
      document.addEventListener('keydown', key);
      const sw = M.swipe(stage, (dx, dy) => move(dx, dy));
      load(li);
      return () => { document.removeEventListener('keydown', key); sw(); };
    }
  };
})(window.MW);
