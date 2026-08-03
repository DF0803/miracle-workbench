/* ==========================================================
   待办事项 Todo —— 优先级 · 分类 · 截止日 · 进度环
   重写版：事件委托架构，保留全部功能，修复历史交互问题，响应式自适应
   ========================================================== */
(function (M) {
  'use strict';
  const $ = M.$, $$ = M.$$;

  const PRI = {
    p1: { n: '紧急重要', c: '#e4002b' },
    p2: { n: '重要',     c: '#d98200' },
    p3: { n: '普通',     c: '#1f6feb' },
    p4: { n: '低',       c: '#8a94ad' }
  };
  const CATS = ['工作', '学习', '生活', '其他'];
  const TABS = [
    { f: 'todo',  label: '进行中' },
    { f: 'today', label: '今日' },
    { f: 'over',  label: '逾期' },
    { f: 'done',  label: '已完成' },
    { f: 'all',   label: '全部' }
  ];

  let filter = 'todo';
  let kw = '';

  /* ---------- 数据 & 计算 ---------- */
  const allTodos = () => M.list('todos');
  const isOverdue = t => !t.done && !!t.due && t.due < M.today();
  const priOpts = sel => Object.keys(PRI).map(k => `<option value="${k}" ${k === sel ? 'selected' : ''}>${PRI[k].n}</option>`).join('');

  function match(t) {
    if (kw) {
      const hay = ((t.title || '') + ' ' + (t.note || '')).toLowerCase();
      if (!hay.includes(kw.toLowerCase())) return false;
    }
    switch (filter) {
      case 'todo':  return !t.done;
      case 'today': return !t.done && t.due === M.today();
      case 'over':  return isOverdue(t);
      case 'done':  return !!t.done;
      default:      return true; // all
    }
  }

  function sortFn(a, b) {
    if (!!a.done !== !!b.done) return a.done ? 1 : -1;            // 未完成在前
    const pa = +String(a.pri || 'p3').slice(1), pb = +String(b.pri || 'p3').slice(1);
    if (pa !== pb) return pa - pb;                                // 优先级升序（p1 最急）
    if (a.due && b.due) return a.due.localeCompare(b.due);        // 有截止日靠前
    if (a.due) return -1; if (b.due) return 1;
    return (b._u || 0) - (a._u || 0);                            // 最近更新在前
  }

  function stats(list) {
    const undone = list.filter(t => !t.done);
    const over = list.filter(isOverdue);
    const today = undone.filter(t => t.due === M.today());
    const doneAll = list.filter(t => t.done);
    const week = doneAll.filter(t => t.doneAt && M.daysBetween(t.doneAt, M.today()) <= 7).length;
    const pct = list.length ? Math.round(doneAll.length / list.length * 100) : 0;
    return { undone, over, today, doneAll, week, pct, total: list.length };
  }

  /* ---------- 片段模板 ---------- */
  function quickAddHTML() {
    return `<div class="card" style="margin-bottom:14px">
      <div class="form-grid" style="grid-template-columns:minmax(180px,2.5fr) repeat(3,minmax(100px,1fr)) auto">
        <div class="field"><label>新建待办</label><input class="input" id="tqTitle" placeholder="回车即可添加，例如：完成 CATTI 二级真题一套"></div>
        <div class="field"><label>优先级</label><select id="tqPri">${priOpts('p3')}</select></div>
        <div class="field"><label>分类</label><select id="tqCat">${CATS.map(c => `<option>${c}</option>`).join('')}</select></div>
        <div class="field"><label>截止</label><input class="input" type="date" id="tqDue"></div>
        <div class="field" style="display:flex;align-items:flex-end"><button class="btn" id="tqAdd" style="white-space:nowrap">＋ 添加</button></div>
      </div>
    </div>`;
  }

  function statsHTML(s) {
    return `<div class="grid g4" style="margin-bottom:14px">
      <div class="stat" style="--sc:var(--c-todo)"><div class="k">进行中</div><div class="v">${s.undone.length}</div><div class="s">今日到期 ${s.today.length} 项</div></div>
      <div class="stat" style="--sc:#e4002b"><div class="k">已逾期</div><div class="v">${s.over.length}</div><div class="s">${s.over.length ? '需要优先处理' : '很好，没有逾期'}</div></div>
      <div class="stat" style="--sc:#00976b"><div class="k">近 7 天完成</div><div class="v">${s.week}</div><div class="s">累计完成 ${s.doneAll.length} 项</div></div>
      <div class="stat" style="--sc:#1f6feb"><div class="k">完成率</div><div class="v">${s.pct}%</div><div class="s">共 ${s.total} 项任务</div></div>
    </div>`;
  }

  function toolbarHTML(s) {
    const countOf = f => f === 'todo' ? s.undone.length : f === 'today' ? s.today.length
      : f === 'over' ? s.over.length : f === 'done' ? s.doneAll.length : s.total;
    const tabs = TABS.map(t => `<button class="tab ${filter === t.f ? 'is-active' : ''}" data-f="${t.f}">${t.label} ${countOf(t.f)}</button>`).join('');
    return `<div class="toolbar">
      <div class="tabs" id="tdTabs">${tabs}</div>
      <div class="tool-right">
        <input class="input search" id="tdSearch" placeholder="🔍 搜索待办…" value="${M.esc(kw)}">
        ${s.doneAll.length ? '<button class="btn btn-sm btn-ghost" id="tdClear">清除已完成</button>' : ''}
      </div>
    </div>`;
  }

  function rowHTML(t) {
    const p = PRI[t.pri] || PRI.p3;
    const od = isOverdue(t);
    return `<tr class="${t.done ? 'done' : ''}" style="--pc:${p.c}">
      <td class="td-status">
        <div class="todo-status2 ${t.done ? 'is-done' : ''}" data-status="${t.id}" role="group" aria-label="完成状态">
          <button type="button" class="seg ${t.done ? '' : 'on'}" data-v="0">进行中</button>
          <button type="button" class="seg ${t.done ? 'on' : ''}" data-v="1">已完成</button>
        </div>
      </td>
      <td class="td-title"><div class="t-title">${M.esc(t.title)}</div>${t.note ? `<div class="note" style="margin-top:2px">${M.esc(t.note)}</div>` : ''}</td>
      <td><span class="tag" style="background:${p.c}1f;color:${p.c}">${p.n}</span></td>
      <td><span class="pill">${M.esc(t.cat || '其他')}</span></td>
      <td class="note">${t.due ? `<span class="pill ${od ? 'overdue' : ''}">📅 ${t.due.slice(5)}${od ? ' · 已逾期' : t.due === M.today() ? ' · 今天' : ''}</span>` : '—'}</td>
      <td class="note">${t.done && t.doneAt ? `<span class="pill" style="color:#00976b">✓ ${t.doneAt.slice(5)}</span>` : '—'}</td>
      <td><div class="t-act">
        <button class="btn btn-sm btn-ghost" data-edit="${t.id}" aria-label="编辑">改</button>
        <button class="btn btn-sm btn-ghost" data-del="${t.id}" aria-label="删除">删</button>
      </div></td>
    </tr>`;
  }

  const EMPTY = {
    done: '还没有完成的任务',
    over: '没有逾期任务，干得漂亮',
    all: '这里空空如也，添加第一条待办吧'
  };

  function listHTML(list) {
    const view = list.filter(match).sort(sortFn);
    if (!view.length) {
      const msg = EMPTY[filter] || '这里空空如也，添加第一条待办吧';
      return `<div class="card"><div class="empty"><span class="e-ico">📌</span>${msg}</div></div>`;
    }
    return `<div class="card" id="tdList"><div class="tb-wrap"><table class="todo-tbl">
      <thead><tr><th>状态</th><th>待办内容</th><th>优先级</th><th>分类</th><th>截止</th><th>完成时间</th><th></th></tr></thead>
      <tbody>${view.map(rowHTML).join('')}</tbody>
    </table></div></div>`;
  }

  /* ---------- 主渲染 ---------- */
  function render() {
    const box = $('#todoBody'); if (!box) return;
    const list = allTodos();
    const s = stats(list);
    const wasSearch = document.activeElement && document.activeElement.id === 'tdSearch';

    box.innerHTML = quickAddHTML() + statsHTML(s) + toolbarHTML(s) + listHTML(list);
    updateRing(s.pct);

    // 搜索框在重渲染后保留焦点与光标
    if (wasSearch) {
      const inp = $('#tdSearch');
      if (inp) { inp.focus(); try { inp.setSelectionRange(inp.value.length, inp.value.length); } catch (e) {} }
    }
  }

  function updateRing(pct) {
    const ring = $('#todoRing');
    if (ring) { ring.style.setProperty('--p', pct + '%'); ring.innerHTML = '<span>' + pct + '%</span>'; }
  }

  /* ---------- 行为 ---------- */
  function openForm(id) {
    const t = id ? M.db().todos.find(x => x.id === id && !x._d) : null;
    const r = t || {};
    M.modal(id ? '编辑待办' : '新建待办', `<div class="form-grid">
      <div class="field" style="grid-column:1/-1"><label>标题</label><input class="input" id="tTitle" value="${M.esc(r.title || '')}" placeholder="要做什么？"></div>
      <div class="field"><label>优先级</label><select id="tPri">${priOpts(r.pri || 'p3')}</select></div>
      <div class="field"><label>分类</label><select id="tCat">${CATS.map(c => `<option ${r.cat === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
      <div class="field"><label>截止日期</label><input class="input" type="date" id="tDue" value="${r.due || ''}"></div>
      <div class="field" style="grid-column:1/-1"><label>备注</label><textarea class="input" id="tNote" rows="2" placeholder="选填">${M.esc(r.note || '')}</textarea></div>
    </div>
    <div class="form-act"><button class="btn" id="tSave">保存</button><button class="btn btn-ghost" id="tCancel">取消</button></div>`, body => {
      $('#tCancel', body).onclick = M.closeModal;
      $('#tSave', body).onclick = () => {
        const o = {
          title: $('#tTitle', body).value.trim(),
          pri: $('#tPri', body).value,
          cat: $('#tCat', body).value,
          due: $('#tDue', body).value,
          note: $('#tNote', body).value.trim()
        };
        if (!o.title) { M.toast('请填写标题', 'warn'); return; }
        if (id) M.update('todos', id, o); else M.add('todos', Object.assign({ done: false }, o));
        M.closeModal(); render(); M.toast('已保存', 'ok');
      };
      setTimeout(() => { const el = $('#tTitle', body); if (el) el.focus(); }, 60);
    });
  }

  function quickAdd() {
    const el = $('#tqTitle'); if (!el) return;
    const v = el.value.trim();
    if (!v) { M.toast('先写点什么吧', 'warn'); return; }
    const priEl = $('#tqPri'), catEl = $('#tqCat'), dueEl = $('#tqDue');
    const created = M.add('todos', {
      title: v,
      pri: priEl ? priEl.value : 'p3',
      cat: catEl ? catEl.value : '其他',
      due: dueEl ? dueEl.value : '',
      note: '', done: false
    });
    el.value = '';
    render();
    M.toast('已添加', 'ok');
    // 把刚新增的那条滚入视野（按当前过滤可能不在首位，故精确定位）
    setTimeout(() => {
      const sel = created && created.id ? document.querySelector(`#tdList [data-status="${created.id}"]`) : null;
      const row = sel ? sel.closest('tr') : document.querySelector('#tdList tbody tr');
      if (row && row.scrollIntoView) { try { row.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {} }
      const n = $('#tqTitle'); if (n) n.focus();
    }, 50);
  }

  function setStatus(id, willDone) {
    const t = M.db().todos.find(x => x.id === id && !x._d);
    if (!t) return;
    if (!!t.done === willDone) return; // 状态未变，跳过
    M.update('todos', id, { done: willDone, doneAt: willDone ? M.today() : '' });
    M.toast(willDone ? '完成！🎉' : '已标记为进行中', 'ok');
    render();
  }

  function clearDone() {
    M.confirm('清除全部已完成的待办？', () => {
      M.list('todos').filter(t => t.done).forEach(t => M.remove('todos', t.id));
      render(); M.toast('已清除', 'ok');
    });
  }

  /* ---------- 事件委托（绑定一次，避免重渲染丢失） ---------- */
  function onClick(e) {
    const tab = e.target.closest('#tdTabs .tab');
    if (tab) { filter = tab.dataset.f; render(); return; }
    // 状态切换（两段式：进行中 / 已完成）—— 点击即明确选择该状态
    const seg = e.target.closest('.todo-status2 .seg');
    if (seg) { const box = seg.closest('[data-status]'); if (box) setStatus(box.dataset.status, seg.dataset.v === '1'); return; }
    if (e.target.closest('#tqAdd')) { quickAdd(); return; }
    if (e.target.closest('#tdClear')) { clearDone(); return; }
    const ed = e.target.closest('[data-edit]');
    if (ed) { openForm(ed.dataset.edit); return; }
    const del = e.target.closest('[data-del]');
    if (del) {
      M.confirm('确定删除这条待办？', () => { M.remove('todos', del.dataset.del); render(); M.toast('已删除', 'ok'); });
    }
  }

  function onChange(e) {
    const st = e.target.closest('[data-status]');
    if (st) setStatus(st.dataset.status, st.value === '1');
  }

  const onSearch = M.debounce(() => render(), 260);

  function onInput(e) {
    const s = e.target.closest('#tdSearch');
    if (s) { kw = s.value.trim(); onSearch(); }
  }

  function onKey(e) {
    const q = e.target.closest('#tqTitle');
    if (q && e.key === 'Enter') quickAdd();
  }

  /* ---------- 初始化 ---------- */
  M.todo = {
    init() {
      const focus = $('#todoFocus');
      if (focus) focus.onclick = () => openForm();   // 英雄按钮：直接打开新建表单
      const body = $('#todoBody');
      if (body) {
        body.addEventListener('click', onClick);
        body.addEventListener('change', onChange);
        body.addEventListener('input', onInput);
        body.addEventListener('keydown', onKey);
      }
      render();
    },
    render
  };
})(window.MW);
