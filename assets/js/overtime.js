/* ==========================================================
   每日加班记录：工时台账 · 加班费估算 · 月度趋势
   ========================================================== */
(function (M) {
  'use strict';
  const $ = M.$, $$ = M.$$;
  const TYPES = { work: { n: '工作日', c: '#7b5cff' }, weekend: { n: '休息日', c: '#1f6feb' }, holiday: { n: '法定节假日', c: '#e4002b' } };
  const COMP = { pay: '加班费', off: '调休', none: '无补偿' };
  // 单一状态源：日期区间 [from, to]（默认 = 近 12 个月，滚动）
  function defaultFrom() {
    const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - 11);
    return M.today(d);
  }
  function defaultTo() {
    const n = new Date();
    return n.getFullYear() + '-' + M.pad2(n.getMonth() + 1) + '-' + M.pad2(new Date(n.getFullYear(), n.getMonth() + 1, 0).getDate());
  }
  let scope = { from: defaultFrom(), to: defaultTo() };       // 顶部「概览」区间：仅控制 4 张统计卡
  let viewMonth = M.month();   // 「每日加班分布」当前查看的月份（单月视图，支持上/下月时间导航）
  let salRange = 12;           // 「每月薪资统计」时间区间（月）：3 / 6 / 12 / 24
  let salHi = M.month();   // 每月薪资统计「在看」高亮月份（独立，不与日历/明细联动）

  // 最近 N 个月（最早→最新），相对今天生成
  function lastN(n) {
    const out = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - i);
      out.push(M.month(M.today(d)));
    }
    return out;
  }
  function lastDayOf(ym) {
    const [y, m] = ym.split('-').map(Number);
    return y + '-' + M.pad2(m) + '-' + M.pad2(new Date(y, m, 0).getDate());
  }
  function monthsInRange(from, to) {
    const [fy, fm] = from.slice(0, 7).split('-').map(Number);
    const [ty, tm] = to.slice(0, 7).split('-').map(Number);
    const out = []; let y = fy, m = fm;
    while (y < ty || (y === ty && m <= tm)) { out.push(y + '-' + M.pad2(m)); m++; if (m > 12) { m = 1; y++; } }
    return out;
  }
  function isFull12State(s) { return s.from === defaultFrom() && s.to === defaultTo(); }
  function isSingleState(s) {
    const ym = s.from.slice(0, 7);
    return s.from.slice(8) === '01' && s.to === lastDayOf(ym);
  }

  function rate(t) {
    const s = M.db().settings;
    return t === 'holiday' ? +s.rateHoliday : t === 'weekend' ? +s.rateWeekend : +s.rateWork;
  }
  // YYYY-MM-DD → XX年XX月XX日
  function cnDate(d) {
    const p = String(d).split('-');
    return p.length === 3 ? `${p[0]}年${p[1]}月${p[2]}日` : String(d);
  }
  function payOf(r) {
    if (r.comp !== 'pay') return 0;
    return (+r.hours || 0) * (+M.db().settings.hourly || 0) * rate(r.type);
  }
  // 当月薪资构成：基本工资 + 加班费 + 绩效 + 工龄工资(元/月) + 补贴 + 其他(±) − 社保 − 公积金
  function salaryBreak(month) {
    const s = M.db().settings;
    const recs = ofMonth(month);
    const pay = recs.reduce((a, r) => a + payOf(r), 0);
    const h = Math.round(recs.reduce((a, r) => a + (+r.hours || 0), 0) * 10) / 10;
    const seniorityPay = (+s.seniorityPerMonth || 0);        // 工龄工资（元/月，直接按月计，不再乘工龄年数）
    const perf = +s.performance || 0;
    const allow = (s.allowances || []).reduce((a, x) => a + (+x.amount || 0), 0);
    const extraNet = (s.extras || []).reduce((a, x) => a + (+x.amount || 0) * (+x.sign || 1), 0);
    const add = perf + seniorityPay + allow;                 // 加项（绩效+工龄工资+补贴）
    const social = +s.social || 0, fund = +s.fund || 0;      // 扣款
    const total = (s.baseSalary || 0) + pay + add + extraNet - social - fund;
    return { base: s.baseSalary || 0, h, pay, seniorityPay, perf, allow, extraNet, add, social, fund, total };
  }
  function calcHours(s, e) {
    if (!s || !e) return 0;
    const [sh, sm] = s.split(':').map(Number), [eh, em] = e.split(':').map(Number);
    let m = (eh * 60 + em) - (sh * 60 + sm);
    if (m < 0) m += 1440;               // 跨零点
    return Math.round(m / 6) / 10;      // 保留 1 位小数
  }

  function all() { return M.list('overtime'); }
  function ofMonth(m) { return all().filter(r => M.month(r.date) === m); }

  /* ---------------- 表单 ---------------- */
  function formHTML(r) {
    r = r || {};
    return `<div class="form-grid">
      <div class="field"><label>日期</label><input class="input" type="date" id="fDate" value="${r.date || M.today()}"></div>
      <div class="field"><label>开始时间</label><input class="input" type="time" id="fStart" value="${r.start || '18:30'}"></div>
      <div class="field"><label>结束时间</label><input class="input" type="time" id="fEnd" value="${r.end || '21:00'}"></div>
      <div class="field"><label>时长（小时）</label><input class="input" type="number" step="0.1" id="fHours" value="${r.hours != null ? r.hours : ''}" placeholder="自动计算"></div>
      <div class="field"><label>加班类型</label><select id="fType">${Object.keys(TYPES).map(k => `<option value="${k}" ${r.type === k ? 'selected' : ''}>${TYPES[k].n}（${rate(k)} 倍）</option>`).join('')}</select></div>
      <div class="field"><label>补偿方式</label><select id="fComp">${Object.keys(COMP).map(k => `<option value="${k}" ${(r.comp || 'pay') === k ? 'selected' : ''}>${COMP[k]}</option>`).join('')}</select></div>
      <div class="field"><label>项目 / 事由</label><input class="input" id="fProj" value="${M.esc(r.project || '')}" placeholder="如：版本发布"></div>
      <div class="field"><label>状态</label><select id="fPaid"><option value="0" ${!r.paid ? 'selected' : ''}>未结算</option><option value="1" ${r.paid ? 'selected' : ''}>已结算/已调休</option></select></div>
      <div class="field" style="grid-column:1/-1"><label>备注</label><input class="input" id="fNote" value="${M.esc(r.note || '')}" placeholder="选填"></div>
    </div>
    <div class="form-act"><button class="btn" id="fSave">保存记录</button>
      <button class="btn btn-ghost" id="fCancel">取消</button></div>`;
  }

  function openForm(id, prefillDate) {
    const r = id ? M.db().overtime.find(x => x.id === id) : (prefillDate ? { date: prefillDate } : null);
    M.modal(id ? '编辑加班记录' : '新增加班记录', formHTML(r), body => {
      const sync = () => {
        const h = calcHours($('#fStart', body).value, $('#fEnd', body).value);
        if (h) $('#fHours', body).value = h;
        const d = $('#fDate', body).value;
        if (d && !id) $('#fType', body).value = M.isWeekend(d) ? 'weekend' : 'work';
      };
      $('#fStart', body).onchange = sync; $('#fEnd', body).onchange = sync;
      $('#fDate', body).onchange = sync;
      $('#fCancel', body).onclick = M.closeModal;
      $('#fSave', body).onclick = () => {
        const o = {
          date: $('#fDate', body).value || M.today(),
          start: $('#fStart', body).value, end: $('#fEnd', body).value,
          hours: +$('#fHours', body).value || calcHours($('#fStart', body).value, $('#fEnd', body).value),
          type: $('#fType', body).value, comp: $('#fComp', body).value,
          project: $('#fProj', body).value.trim(), note: $('#fNote', body).value.trim(),
          paid: $('#fPaid', body).value === '1'
        };
        if (!o.hours) { M.toast('请填写时长或起止时间', 'warn'); return; }
        if (id) M.update('overtime', id, o); else M.add('overtime', o);
        M.closeModal(); M.toast('已保存', 'ok'); render();
      };
    });
  }

  function openSettings() {
    const s = M.db().settings;
    const derivHourly = b => Math.round((+b || 0) / 21.75 / 8 * 100) / 100;
    let allow = (s.allowances || []).map(x => ({ name: x.name || '', amount: +x.amount || 0 }));
    let extra = (s.extras || []).map(x => ({ name: x.name || '', amount: +x.amount || 0, sign: +x.sign || 1 }));
    M.modal('薪资与加班费参数', `<div class="form-grid">
      <div class="field"><label>基本工资（元/月）</label><input class="input" type="number" id="sBase" value="${s.baseSalary != null ? s.baseSalary : ''}" placeholder="如 8000"></div>
      <div class="field"><label>时薪（元/小时）</label><input class="input" type="number" step="0.01" id="sHour" value="${s.hourly}"><span class="note" style="margin:2px 0 0">由基本工资自动估算，可手动微调</span></div>
      <div class="field"><label>工作日倍率</label><input class="input" type="number" step="0.1" id="sW" value="${s.rateWork}"></div>
      <div class="field"><label>休息日倍率</label><input class="input" type="number" step="0.1" id="sE" value="${s.rateWeekend}"></div>
      <div class="field"><label>节假日倍率</label><input class="input" type="number" step="0.1" id="sH" value="${s.rateHoliday}"></div>
      <div class="field"><label>社保（元/月，扣）</label><input class="input" type="number" id="sSocial" value="${s.social != null ? s.social : ''}"></div>
      <div class="field"><label>公积金（元/月，扣）</label><input class="input" type="number" id="sFund" value="${s.fund != null ? s.fund : ''}"></div>
      <div class="field"><label>工龄工资（元/月）</label><input class="input" type="number" id="sSPM" value="${s.seniorityPerMonth != null ? s.seniorityPerMonth : ''}"></div>
      <div class="field"><label>绩效（元/月）</label><input class="input" type="number" id="sPerf" value="${s.performance != null ? s.performance : ''}"></div>
    </div>
    <div class="field" style="margin-top:4px"><label>补贴（可增删）</label>
      <div id="sAllowBox"></div>
      <button class="btn btn-sm btn-ghost" id="sAllowAdd" style="margin-top:6px">＋ 添加补贴</button>
    </div>
    <div class="field" style="margin-top:10px"><label>其他增减项（可增删）</label>
      <div id="sExtraBox"></div>
      <button class="btn btn-sm btn-ghost" id="sExtraAdd" style="margin-top:6px">＋ 添加其他</button>
    </div>
    <p class="note">💡 当月薪资 = 基本工资 + 加班费 + 绩效 + 工龄工资(元/月) + 补贴 + 其他(±) − 社保 − 公积金。时薪按「基本工资 ÷ 21.75 ÷ 8」自动估算（8000 元 ≈ ¥${derivHourly(8000)}/h）。</p>
    <div class="form-act"><button class="btn" id="sSave">保存</button></div>`, body => {
      const baseEl = $('#sBase', body), hourEl = $('#sHour', body);
      baseEl.oninput = () => { const v = derivHourly(baseEl.value); if (v) hourEl.value = v; };
      const renderAllow = () => {
        $('#sAllowBox', body).innerHTML = allow.map((x, i) => `<div class="kv-row">
          <input class="input" placeholder="名称" data-a="n" data-i="${i}" value="${M.esc(x.name)}">
          <input class="input" placeholder="金额" data-a="amt" data-i="${i}" value="${x.amount != null ? x.amount : ''}" style="width:92px">
          <button class="btn btn-sm btn-ghost" data-adel="${i}">×</button></div>`).join('') || '<div class="note">暂无补贴</div>';
        bindList('sAllowBox', allow, 'a');
      };
      const renderExtra = () => {
        $('#sExtraBox', body).innerHTML = extra.map((x, i) => `<div class="kv-row">
          <select class="input" data-e="sign" data-i="${i}" style="width:62px"><option value="1" ${x.sign !== -1 ? 'selected' : ''}>增</option><option value="-1" ${x.sign === -1 ? 'selected' : ''}>减</option></select>
          <input class="input" placeholder="名称" data-e="n" data-i="${i}" value="${M.esc(x.name)}">
          <input class="input" placeholder="金额" data-e="amt" data-i="${i}" value="${x.amount != null ? x.amount : ''}" style="width:92px">
          <button class="btn btn-sm btn-ghost" data-edel="${i}">×</button></div>`).join('') || '<div class="note">暂无其他项</div>';
        bindList('sExtraBox', extra, 'e');
      };
      function bindList(boxId, arr, key) {
        const box = $('#' + boxId, body);
        box.querySelectorAll('input,select').forEach(el => {
          el.oninput = el.onchange = () => {
            const i = +el.dataset.i;
            if (el.dataset[key] === 'n') arr[i].name = el.value;
            else if (el.dataset[key] === 'amt') arr[i].amount = +el.value || 0;
            else if (el.dataset[key] === 'sign') arr[i].sign = +el.value || 1;
          };
        });
        box.querySelectorAll('[data-adel],[data-edel]').forEach(b => {
          b.onclick = () => { const i = b.dataset.adel != null ? +b.dataset.adel : +b.dataset.edel; arr.splice(i, 1); key === 'a' ? renderAllow() : renderExtra(); };
        });
      }
      renderAllow(); renderExtra();
      $('#sAllowAdd', body).onclick = () => { allow.push({ name: '', amount: 0 }); renderAllow(); };
      $('#sExtraAdd', body).onclick = () => { extra.push({ name: '', amount: 0, sign: 1 }); renderExtra(); };
      $('#sSave', body).onclick = () => {
        const base = +baseEl.value || 0;
        Object.assign(M.db().settings, {
          baseSalary: base,
          hourly: +hourEl.value || derivHourly(base) || 0,
          rateWork: +$('#sW', body).value || 1.5,
          rateWeekend: +$('#sE', body).value || 2, rateHoliday: +$('#sH', body).value || 3,
          social: +$('#sSocial', body).value || 0, fund: +$('#sFund', body).value || 0,
          seniorityPerMonth: +$('#sSPM', body).value || 0,
          performance: +$('#sPerf', body).value || 0,
          allowances: allow.filter(x => (x.name || '').trim() || (+x.amount || 0)).map(x => ({ name: x.name || '', amount: +x.amount || 0 })),
          extras: extra.filter(x => (x.name || '').trim() || (+x.amount || 0)).map(x => ({ name: x.name || '', amount: +x.amount || 0, sign: (+x.sign || 1) }))
        });
        M.save(); M.closeModal(); M.toast('参数已更新', 'ok'); render();
      };
    });
  }

  /* ---------------- 日历热力图 ---------------- */
  function calColor(h) {
    if (h <= 1) return 'rgba(123,92,255,.28)';
    if (h <= 2) return 'rgba(123,92,255,.5)';
    if (h <= 3) return 'rgba(123,92,255,.72)';
    return 'rgba(123,92,255,.95)';
  }
  function calChart(month, daily) {
    const y = +month.slice(0, 4), m = +month.slice(5, 7);
    const dim = new Date(y, m, 0).getDate();
    const first = new Date(y, m - 1, 1).getDay();        // 0=周日
    const dows = ['日', '一', '二', '三', '四', '五', '六'];
    const map = {}; daily.forEach(d => { map[+d.label] = d.value; });
    let cells = '';
    for (let i = 0; i < first; i++) cells += '<div class="cal-cell empty"></div>';
    for (let d = 1; d <= dim; d++) {
      const v = map[d] || 0;
      const we = new Date(y, m - 1, d).getDay() % 6 === 0;
      const cls = 'cal-cell' + (v > 0 ? ' has' : '') + (we && !v ? ' we' : '') + (v > 2 ? ' deep' : '');
      const bg = v > 0 ? 'background:' + calColor(v) + ';' : '';
      cells += `<div class="${cls}" data-calday="${month}-${M.pad2(d)}" style="${bg}">
        <span class="cal-day">${d}</span><span class="cal-h">${v > 0 ? M.num(v) + 'h' : ''}</span></div>`;
    }
    const legend = '<div class="cal-legend">少'
      + ['.28', '.5', '.72', '.95'].map(a => `<i style="background:rgba(123,92,255,${a})"></i>`).join('')
      + '多</div>';
    return '<div class="cal">' + dows.map(x => '<div class="cal-dow">' + x + '</div>').join('') + cells + '</div>' + legend;
  }

  /* ---------------- 渲染 ---------------- */
  function render() {
    const box = $('#otBody'); if (!box) return;
    const list = all();
    // 顶部「概览」区间（scope）：驱动 4 张统计卡
    const cur = list.filter(r => r.date >= scope.from && r.date <= scope.to);
    const single = isSingleState(scope);
    const full12 = isFull12State(scope);
    const mon = monthsInRange(scope.from, scope.to);
    // 「每日加班分布」视图月份（单月 + 时间导航）：与顶部「概览」区间相互独立
    const vm = viewMonth;
    const vmFrom = vm + '-01';
    const vmTo = lastDayOf(vm);
    const vmRecs = list.filter(r => r.date >= vmFrom && r.date <= vmTo);
    const vmDays = new Set(vmRecs.map(r => r.date)).size;
    const vmYear = +vm.slice(0, 4), vmMon = +vm.slice(5, 7);

    const mH = cur.reduce((s, r) => s + (+r.hours || 0), 0);
    const mP = cur.reduce((s, r) => s + payOf(r), 0);
    const base = M.db().settings.baseSalary || 0;
    const S = M.db().settings;
    const days = new Set(cur.map(r => r.date)).size;
    const unpaid = list.filter(r => !r.paid).reduce((s, r) => s + payOf(r), 0);
    const totalH = list.reduce((s, r) => s + (+r.hours || 0), 0);
    const late = cur.filter(r => r.end && (+r.end.slice(0, 2) >= 22 || +r.end.slice(0, 2) <= 4)).length;

    // hero 区：本月真实统计（当前自然月），避免 hero 显示写死的 0/¥0
    const cm = M.month();
    const cmList = list.filter(r => M.month(r.date) === cm);
    const cmH = cmList.reduce((s, r) => s + (+r.hours || 0), 0);
    const cmP = cmList.reduce((s, r) => s + payOf(r), 0);
    const hH = $('#otMonthHours'); if (hH) hH.textContent = M.num(cmH) + ' h';
    const hP = $('#otMonthPay'); if (hP) hP.textContent = M.money(cmP);

    // 每月薪资统计（按所选时间区间 salRange 滚动，按月份升序，独立显示「XX年XX月」；不与日历/明细筛选联动）
    const salRows = lastN(salRange).map(m => Object.assign({ m, label: (+m.slice(0, 4)) + '年' + (+m.slice(5)) + '月' }, salaryBreak(m)))
      .sort((a, b) => a.m.localeCompare(b.m));
    const salMax = Math.max(1, ...salRows.map(s => s.h));
    const totH = Math.round(salRows.reduce((s, x) => s + x.h, 0) * 10) / 10;
    const totPay = salRows.reduce((s, x) => s + x.pay, 0);
    const sumAdd = salRows.reduce((s, x) => s + x.add, 0);
    const sumExtra = salRows.reduce((s, x) => s + x.extraNet, 0);
    const totSal = salRows.reduce((s, x) => s + x.total, 0);

    // 每日加班分布：单月视图（当前查看月份）+ 上/下月时间导航
    const dm = new Date(vmYear, vmMon, 0).getDate();
    const dy = [];
    for (let d = 1; d <= dm; d++) { const k = vm + '-' + M.pad2(d); dy.push({ label: String(d), value: Math.round(vmRecs.filter(r => r.date === k).reduce((s, r) => s + (+r.hours || 0), 0) * 10) / 10 }); }
    const calHTML = calChart(vm, dy);

    // 加班明细范围（跟随「每日加班分布」的查看月份）
    const det = vmRecs;

    box.innerHTML = `
    <div class="toolbar" style="margin-bottom:14px">
      <div class="tabs"><span class="more" style="margin-right:8px">概览区间</span>
        <span class="date-range">
          <input type="date" class="input ot-sel" id="otFromTop" value="${scope.from}">
          <span class="dr-sep">—</span>
          <input type="date" class="input ot-sel" id="otToTop" value="${scope.to}">
        </span>
      </div>
      <div class="tool-right">
        <button class="btn btn-sm btn-ghost" id="otCfg">⚙️ 计算参数</button>
        <button class="btn btn-sm btn-ghost" id="otExport">导出 CSV</button>
        <button class="btn btn-sm btn-danger" id="otReset">重置</button>
      </div>
    </div>

    <div class="grid g4" style="margin-bottom:14px">
      <div class="stat" style="--sc:var(--c-ot)"><div class="k">${single ? scope.from.slice(0, 7) + ' 加班时长' : full12 ? '全年加班时长' : '区间加班时长'}</div><div class="v">${M.num(mH)} h</div><div class="s">${single ? days + ' 天有加班 · 深夜 ' + late + ' 次' : full12 ? '近 12 个月合计' : mon.length + ' 个月合计'}</div></div>
      <div class="stat" style="--sc:#e4002b"><div class="k">${single ? scope.from.slice(0, 7) + ' 预估加班费' : full12 ? '全年预估加班费' : '区间预估加班费'}</div><div class="v">${M.money(mP)}</div><div class="s">${base ? '基本工资 ¥' + M.num(base) + ' · ' : ''}时薪 ¥${M.db().settings.hourly}/h</div></div>
      <div class="stat" style="--sc:var(--gold)"><div class="k">未结算金额</div><div class="v">${M.money(unpaid)}</div><div class="s">全部未结算记录合计</div></div>
      <div class="stat" style="--sc:#00976b"><div class="k">累计加班</div><div class="v">${M.num(totalH)} h</div><div class="s">共 ${list.length} 条记录 · 折合 ${M.num(Math.round(totalH / 8 * 10) / 10)} 个工作日</div></div>
    </div>

    <div class="card" style="margin-bottom:14px"><h3 class="card-h"><span class="dot"></span>每月薪资统计
      <span class="card-tools">
        <div class="m-rng">
          <button class="btn btn-sm btn-ghost ${salRange === 3 ? 'on' : ''}" data-rng="3">近3月</button>
          <button class="btn btn-sm btn-ghost ${salRange === 6 ? 'on' : ''}" data-rng="6">近6月</button>
          <button class="btn btn-sm btn-ghost ${salRange === 12 ? 'on' : ''}" data-rng="12">近12月</button>
          <button class="btn btn-sm btn-ghost ${salRange === 24 ? 'on' : ''}" data-rng="24">近24月</button>
        </div>
        <span class="more">点击月份行高亮「在看」</span>
      </span>
    </h3>
      <div class="tb-wrap"><table class="ot-tbl ot-sal">
        <thead><tr><th>月份</th><th>时长(h)</th><th>加班费</th><th>基本工资</th><th>社保</th><th>公积金</th><th>加项</th><th>其他</th><th>当月薪资</th></tr></thead>
        <tbody>${salRows.map(s => `<tr class="${s.m === salHi ? 'cur' : ''}" data-sm="${s.m}">
          <td><b>${s.label}</b>${s.m === salHi ? ' <span class="cur-tag">在看</span>' : ''}</td>
          <td class="col-h"><span class="h-num">${M.num(s.h)}</span><span class="h-bar"><i style="width:${Math.round(s.h / salMax * 100)}%"></i></span></td>
          <td>${s.pay ? M.money(s.pay) : '—'}</td>
          <td>${s.base ? M.money(s.base) : '—'}</td>
          <td class="col-sub">${s.social ? '−' + M.money(s.social) : '—'}</td>
          <td class="col-sub">${s.fund ? '−' + M.money(s.fund) : '—'}</td>
          <td class="col-add">${s.add ? '+' + M.money(s.add) : '—'}</td>
          <td class="${s.extraNet < 0 ? 'col-sub' : s.extraNet > 0 ? 'col-add' : ''}">${s.extraNet ? (s.extraNet > 0 ? '+' : '−') + M.money(Math.abs(s.extraNet)) : '—'}</td>
          <td><b>${M.money(s.total)}</b></td>
        </tr>`).join('')}</tbody>
        <tfoot><tr>
          <td><b>${salRange} 个月合计</b></td>
          <td>${M.num(totH)}</td>
          <td>${M.money(totPay)}</td>
          <td>${M.money(base * salRows.length)}</td>
          <td class="col-sub">${S.social ? '−' + M.money(S.social * salRows.length) : '—'}</td>
          <td class="col-sub">${S.fund ? '−' + M.money(S.fund * salRows.length) : '—'}</td>
          <td class="col-add">${sumAdd ? '+' + M.money(sumAdd) : '—'}</td>
          <td class="${sumExtra < 0 ? 'col-sub' : sumExtra > 0 ? 'col-add' : ''}">${sumExtra ? (sumExtra > 0 ? '+' : '−') + M.money(Math.abs(sumExtra)) : '—'}</td>
          <td><b>${M.money(totSal)}</b></td>
        </tr></tfoot>
      </table></div>
    </div>

    <div class="card" style="margin-bottom:14px"><h3 class="card-h"><span class="dot"></span>每日加班分布
      <span class="card-tools">
        <div class="m-nav">
          <button class="btn btn-sm btn-ghost m-nav-arrow" id="otPrevMon" title="上一月">‹</button>
          <span class="m-nav-label" id="otMonLabel">${vmYear}年${vmMon}月</span>
          <button class="btn btn-sm btn-ghost m-nav-arrow" id="otNextMon" title="下一月">›</button>
          ${vm !== M.month() ? '<button class="btn btn-sm btn-ghost" id="otThisMon">回到本月</button>' : ''}
        </div>
        <span class="more">点击日期可记一笔 · 本月 ${vmDays} 天有加班</span>
      </span>
    </h3>${calHTML}</div>

    <div class="card">
      <h3 class="card-h"><span class="dot"></span>加班明细
        <span class="card-tools"><span class="more">${det.length} 条 · ${vmYear}年${vmMon}月</span></span>
      </h3>
      ${det.length ? `<div class="tb-wrap"><table>
        <thead><tr><th>日期</th><th>时段</th><th>时长</th><th>类型</th><th>项目</th><th>补偿</th><th>估算</th><th>状态</th><th></th></tr></thead>
        <tbody>${det.slice().sort((a, b) => b.date.localeCompare(a.date)).map(r => `<tr>
          <td><b>${cnDate(r.date)}</b> <span class="note">${M.weekday(r.date)}</span></td>
          <td class="note">${r.start || '—'} ~ ${r.end || '—'}</td>
          <td><b>${M.num(r.hours)}</b> h</td>
          <td><span class="tag" style="background:${TYPES[r.type] ? TYPES[r.type].c : '#999'}22;color:${TYPES[r.type] ? TYPES[r.type].c : '#999'}">${TYPES[r.type] ? TYPES[r.type].n : '—'}</span></td>
          <td>${M.esc(r.project || '—')}${r.note ? '<div class="note">' + M.esc(r.note) + '</div>' : ''}</td>
          <td class="note">${COMP[r.comp] || '—'}</td>
          <td>${payOf(r) ? M.money(payOf(r)) : '—'}</td>
          <td><span class="pill" style="${r.paid ? 'color:#00976b' : 'color:#d98200'}">${r.paid ? '已结算' : '未结算'}</span></td>
          <td><div class="t-act"><button class="btn btn-sm btn-ghost" data-edit="${r.id}">改</button><button class="btn btn-sm btn-ghost" data-del="${r.id}">删</button></div></td>
        </tr>`).join('')}</tbody></table></div>`
        : `<div class="empty"><span class="e-ico">🌙</span>${vmYear}年${vmMon}月还没有加班记录 —— 这是好事<br><span class="note" style="margin-top:8px">点上方日历任意日期即可记一笔 ✍️</span></div>`}
    </div>`;

    // 顶部选择器：仅改「概览」区间（4 张统计卡），不动日历/明细
    const setTopRange = (f, t) => {
      if (!f || !t) return;
      if (f > t) { const x = f; f = t; t = x; }   // 起止颠倒自动纠正
      scope.from = f; scope.to = t; render();
    };
    const topF = $('#otFromTop', box), topT = $('#otToTop', box);
    topF.onchange = () => setTopRange(topF.value, topT.value);
    topT.onchange = () => setTopRange(topF.value, topT.value);
    // 「每日加班分布」时间导航：上/下月 + 回到本月
    const shiftMonth = (delta) => {
      const [y, m] = viewMonth.split('-').map(Number);
      let ny = y, nm = m + delta;
      if (nm < 1) { nm = 12; ny--; } else if (nm > 12) { nm = 1; ny++; }
      viewMonth = ny + '-' + M.pad2(nm); render();
    };
    const prev = $('#otPrevMon', box); if (prev) prev.onclick = () => shiftMonth(-1);
    const next = $('#otNextMon', box); if (next) next.onclick = () => shiftMonth(1);
    const thisMon = $('#otThisMon', box); if (thisMon) thisMon.onclick = () => { viewMonth = M.month(); render(); };
    $('#otCfg').onclick = openSettings;
    $('#otExport').onclick = exportCSV;
    const resetBtn = $('#otReset', box); if (resetBtn) resetBtn.onclick = () => M.confirm('确定清空全部加班记录吗？此操作不可恢复，且会同步到云端。', () => {
      M.db().overtime = [];   // 直接清空整张表（比逐项软删除更彻底）
      M.save();
      viewMonth = M.month();
      render();
      M.toast('已清空全部加班记录', 'ok');
    });
    $$('[data-edit]', box).forEach(b => b.onclick = () => openForm(b.dataset.edit));
    $$('[data-del]', box).forEach(b => b.onclick = () => M.confirm('确定删除这条加班记录？', () => { M.remove('overtime', b.dataset.del); render(); M.toast('已删除', 'ok'); }));
    $$('[data-calday]', box).forEach(b => b.onclick = () => openForm(null, b.dataset.calday));
    $$('[data-rng]', box).forEach(b => b.onclick = () => { salRange = +b.dataset.rng; render(); });
    $$('[data-sm]', box).forEach(b => b.onclick = () => { salHi = b.dataset.sm; render(); });
  }

  function exportCSV() {
    const rows = [['日期', '星期', '开始', '结束', '时长(h)', '类型', '项目', '补偿', '估算金额', '状态', '备注']];
    all().sort((a, b) => a.date.localeCompare(b.date)).forEach(r => rows.push([
      r.date, M.weekday(r.date), r.start || '', r.end || '', r.hours, (TYPES[r.type] || {}).n || '', r.project || '',
      COMP[r.comp] || '', payOf(r).toFixed(2), r.paid ? '已结算' : '未结算', r.note || ''
    ]));
    const csv = '\ufeff' + rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = '加班记录_' + M.today() + '.csv'; a.click();
    M.toast('已导出 CSV', 'ok');
  }

  M.overtime = {
    init() { M.on('data', render); render(); },
    render
  };
})(window.MW);
