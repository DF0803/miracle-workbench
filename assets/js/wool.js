/* ==========================================================
   羊毛记录：笔数追踪 · 已收 / 未收 · 每年 / 每月笔数统计
   ========================================================== */
(function (M) {
  'use strict';
  const $ = M.$, $$ = M.$$;
  const CATS = { cashback: '返现', redpack: '红包', coupon: '优惠券', activity: '活动奖励', card: '信用卡权益', invest: '理财/开户', newbie: '新人礼', other: '其他' };
  // 状态仅两态：已收到 / 未收到
  const ST = { received: { n: '已收到', c: '#00976b' }, pending: { n: '未收到', c: '#d98200' } };
  const COLORS = ['#00976b', '#1f6feb', '#e4002b', '#f5b301', '#7b5cff', '#00a6b8', '#ff7a45', '#8a94ad', '#0f9d63', '#b3001f', '#5a67d8'];
  let fStatus = 'all', fSrc = 'all';

  const all = () => M.list('wool');
  const isRecv = r => r.status === 'received' || r.status === 'done'; // 兼容历史数据
  const curST = r => ST[r.status] || (isRecv(r) ? ST.received : ST.pending);
  const keyOf = r => isRecv(r) ? 'received' : 'pending';
  const srcs = list => Array.from(new Set(list.map(r => (r.platform || '').trim()).filter(Boolean))).sort();

  function formHTML(r) {
    r = r || {};
    const sv = isRecv(r) ? 'received' : 'pending';
    return `<div class="form-grid">
      <div class="field"><label>来源</label><input class="input" id="wSrc" value="${M.esc(r.platform || '')}" placeholder="如：支付宝 / 银行App / 线下门店"></div>
      <div class="field"><label>类型</label><select id="wCat">${Object.keys(CATS).map(k => `<option value="${k}" ${(r.cat || 'cashback') === k ? 'selected' : ''}>${CATS[k]}</option>`).join('')}</select></div>
      <div class="field"><label>状态</label><select id="wSt">
        <option value="received" ${sv === 'received' ? 'selected' : ''}>已收到</option>
        <option value="pending" ${sv === 'pending' ? 'selected' : ''}>未收到</option>
      </select></div>
      <div class="field"><label>投入金额（元）</label><input class="input" type="number" step="0.01" id="wCost" value="${r.cost != null ? r.cost : 0}"></div>
      <div class="field"><label>兑换日</label><input class="input" type="date" id="wArr" value="${r.arrive || ''}"></div>
      <div class="field" style="grid-column:1/-1"><label>项目名称</label><input class="input" id="wName" value="${M.esc(r.name || '')}" placeholder="如：银行 App 签到 5 元立减金"></div>
      <div class="field" style="grid-column:1/-1"><label>备注 / 规则</label><input class="input" id="wNote" value="${M.esc(r.note || '')}" placeholder="如：每月限领一次，需消费满 50"></div>
    </div>
    <div class="form-act"><button class="btn" id="wSave">保存记录</button><button class="btn btn-ghost" id="wCancel">取消</button></div>`;
  }

  function openForm(id) {
    const r = id ? M.db().wool.find(x => x.id === id) : null;
    M.modal(id ? '编辑羊毛记录' : '新增羊毛记录', formHTML(r), body => {
      $('#wCancel', body).onclick = M.closeModal;
      $('#wSave', body).onclick = () => {
        const st = $('#wSt', body).value;
        const o = {
          platform: $('#wSrc', body).value.trim() || '—',
          cat: $('#wCat', body).value,
          status: st,
          cost: +$('#wCost', body).value || 0,
          arrive: $('#wArr', body).value,
          name: $('#wName', body).value.trim(),
          note: $('#wNote', body).value.trim(),
          // 收到日：状态为「已收到」时，编辑旧记录保留原收到日，新建则取今天；改回「未收到」则清空
          recvDate: st === 'received' ? (id && r && r.recvDate ? r.recvDate : M.today()) : ''
        };
        if (!o.name) { M.toast('请填写项目名称', 'warn'); return; }
        if (id) M.update('wool', id, o); else M.add('wool', o);
        M.closeModal(); M.toast('已保存', 'ok'); render();
      };
    });
  }

  function render() {
    const box = $('#woolBody'); if (!box) return;
    const list = all();
    const recv = list.filter(isRecv);
    const pend = list.filter(r => !isRecv(r));
    const total = list.length;
    const rate = total ? Math.round(recv.length / total * 100) : 0;

    // 每年笔数（近三年）
    const byYear = {};
    list.forEach(r => { const y = (r.arrive || '').slice(0, 4); if (y) byYear[y] = (byYear[y] || 0) + 1; });
    const yearYears = Object.keys(byYear).sort().slice(-3);
    const yearBars = yearYears.map((y, i) => ({ label: y + '年', value: byYear[y], color: COLORS[i % COLORS.length] }));
    const yearMax = yearBars.reduce((m, b) => Math.max(m, b.value), 0);

    // 每月笔数（最近 6 个月）
    const monthSet = {};
    for (let i = 5; i >= 0; i--) { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - i); monthSet[M.month(M.today(d))] = 0; }
    list.forEach(r => { const m = (r.arrive || '').slice(0, 7); if (m in monthSet) monthSet[m]++; });
    const monthBars = Object.keys(monthSet).sort().map((m, i) => ({ label: m.slice(5) + '月', value: monthSet[m], color: COLORS[i % COLORS.length] }));

    const srcOpts = srcs(list);

    let view = list;
    if (fStatus !== 'all') view = view.filter(r => keyOf(r) === fStatus);
    if (fSrc !== 'all') view = view.filter(r => (r.platform || '') === fSrc);
    view = view.sort((a, b) => (b.arrive || '').localeCompare((a.arrive || '')));

    box.innerHTML = `
    <div class="grid g4" style="margin-bottom:14px">
      <div class="stat" style="--sc:#1f6feb"><div class="k">总笔数</div><div class="v">${total}</div><div class="s">覆盖 ${Object.keys(byYear).length} 个年份</div></div>
      <div class="stat" style="--sc:#00976b"><div class="k">已收到</div><div class="v">${recv.length}</div><div class="s">未收到 ${pend.length} 笔</div></div>
      <div class="stat" style="--sc:#d98200"><div class="k">未收到</div><div class="v">${pend.length}</div><div class="s">待追踪 ${pend.length} 笔</div></div>
      <div class="stat" style="--sc:var(--gold)"><div class="k">接收率</div><div class="v">${rate}%</div><div class="s">已收 ${recv.length} / 共 ${total}</div></div>
    </div>

    <div class="grid g-side" style="margin-bottom:14px">
      <div class="card"><h3 class="card-h"><span class="dot"></span>每年羊毛笔数</h3>
        ${yearBars.length ? `<div class="bar-chart">${yearBars.map(b => `<div class="bar-col"><div class="bar-val">${b.value}</div><div class="bar-pillar"><div class="bar-fill" style="height:${yearMax ? Math.max(8, Math.round(b.value / yearMax * 100)) : 0}%"></div></div><div class="bar-x">${b.label}</div></div>`).join('')}</div><div class="bar-cap">近三年 · 共 ${yearBars.reduce((s, b) => s + b.value, 0)} 笔</div>` : '<div class="empty" style="padding:20px"><span class="e-ico">🐑</span>暂无记录</div>'}
      </div>
      <div class="card"><h3 class="card-h"><span class="dot"></span>每月羊毛笔数（近 6 个月）</h3>
        <div class="tb-wrap"><table class="mini"><thead><tr><th>月份</th><th>笔数</th><th>占比</th></tr></thead><tbody>${monthBars.map(b => `<tr><td>${b.label}</td><td>${b.value}</td><td>${total ? Math.round(b.value / total * 100) : 0}%</td></tr>`).join('')}</tbody></table></div>
      </div>
    </div>

    <div class="toolbar">
      <div class="tabs" id="wStTabs">
        <button class="tab ${fStatus === 'all' ? 'is-active' : ''}" data-st="all">全部 ${list.length}</button>
        <button class="tab ${fStatus === 'received' ? 'is-active' : ''}" data-st="received">已收到 ${recv.length}</button>
        <button class="tab ${fStatus === 'pending' ? 'is-active' : ''}" data-st="pending">未收到 ${pend.length}</button>
      </div>
      <div class="tool-right">
        <select class="input" id="wSrcF" style="width:130px"><option value="all">全部来源</option>${srcOpts.map(s => `<option ${fSrc === s ? 'selected' : ''}>${M.esc(s)}</option>`).join('')}</select>
        <button class="btn btn-sm btn-ghost" id="wExport">导出 CSV</button>
        <button class="btn btn-sm btn-danger" id="wReset">重置</button>
        <button class="btn btn-sm" id="wNew">＋ 新增</button>
      </div>
    </div>

    <div class="card">
      <h3 class="card-h"><span class="dot"></span>羊毛台账 <span class="more">${view.length} 条</span></h3>
      ${view.length ? `<div class="tb-wrap"><table>
        <thead><tr><th>兑换日</th><th>收到日</th><th>项目</th><th>来源</th><th>类型</th><th>投入</th><th>状态</th><th></th></tr></thead>
        <tbody>${view.map(r => `<tr>
          <td class="note">${(r.arrive || '').slice(5) || '—'}</td>
          <td class="note">${(r.recvDate || '').slice(5) || '—'}</td>
          <td><b>${M.esc(r.name)}</b>${r.note ? '<div class="note">' + M.esc(r.note) + '</div>' : ''}</td>
          <td><span class="pill">${M.esc(r.platform || '—')}</span></td>
          <td class="note">${CATS[r.cat] || '—'}</td>
          <td class="note">${r.cost ? M.money(r.cost) : '—'}</td>
          <td><span class="tag" style="background:${curST(r).c}22;color:${curST(r).c}">${curST(r).n}</span></td>
          <td><div class="t-act">
            ${!isRecv(r) ? `<button class="btn btn-sm" data-ok="${r.id}">收到</button>` : ''}
            <button class="btn btn-sm btn-ghost" data-edit="${r.id}">改</button>
            <button class="btn btn-sm btn-ghost" data-del="${r.id}">删</button></div></td>
        </tr>`).join('')}</tbody></table></div>`
        : `<div class="empty"><span class="e-ico">🐑</span>还没有记录，去薅第一笔吧<br><button class="btn btn-sm" id="wNew2" style="margin-top:10px">记一笔</button></div>`}
    </div>`;

    $$('#wStTabs .tab', box).forEach(b => b.onclick = () => { fStatus = b.dataset.st; render(); });
    $('#wSrcF').onchange = e => { fSrc = e.target.value; render(); };
    $('#wNew').onclick = () => openForm();
    const n2 = $('#wNew2'); if (n2) n2.onclick = () => openForm();
    $('#wExport').onclick = exportCSV;
    const resetBtn = $('#wReset', box); if (resetBtn) resetBtn.onclick = () => M.confirm('确定清空全部羊毛记录吗？此操作不可恢复，且会同步到云端。', () => {
      M.db().wool = [];   // 直接清空整张表（比逐项软删除更彻底）
      M.save();
      fStatus = 'all'; fSrc = 'all';
      render();
      M.toast('已清空全部羊毛记录', 'ok');
    });
    $$('[data-edit]', box).forEach(b => b.onclick = () => openForm(b.dataset.edit));
    $$('[data-ok]', box).forEach(b => b.onclick = () => { M.update('wool', b.dataset.ok, { status: 'received', recvDate: M.today() }); M.toast('已标记收到 🎉', 'ok'); render(); });
    $$('[data-del]', box).forEach(b => b.onclick = () => M.confirm('确定删除这条羊毛记录？', () => { M.remove('wool', b.dataset.del); render(); M.toast('已删除', 'ok'); }));

    const t = $('#woolTotal'), p = $('#woolPending');
    if (t) t.textContent = total;
    if (p) p.textContent = pend.length;
  }

  function exportCSV() {
    const rows = [['项目', '来源', '类型', '投入', '兑换日', '收到日', '状态', '备注']];
    all().sort((a, b) => (a.arrive || '').localeCompare((b.arrive || ''))).forEach(r => rows.push([
      r.name, r.platform || '', CATS[r.cat] || '', r.cost || 0, r.arrive || '', r.recvDate || '', curST(r).n, r.note || ''
    ]));
    const csv = '﻿' + rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = '羊毛记录_' + M.today() + '.csv'; a.click();
    M.toast('已导出 CSV', 'ok');
  }

  M.wool = { init() { const add = $('#woolAdd'); if (add) add.onclick = () => openForm(); render(); }, render };
})(window.MW);
