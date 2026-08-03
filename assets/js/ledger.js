/* ==========================================================
   记账：一般记账（收支台账） + 房贷（独立台账）
   两块数据完全独立：一般记账走 ledger 集合，房贷走 mortgage 集合
   ========================================================== */
(function (M) {
  'use strict';
  const $ = M.$, $$ = M.$$;
  const IN_CATS = { salary: '工资', bonus: '奖金', invest: '理财收益', part: '兼职', redpack: '红包', other_in: '其他收入' };
  const OUT_CATS = { food: '餐饮', trans: '交通', shop: '购物', house: '居住', fun: '娱乐', med: '医疗', edu: '教育', comm: '通讯', other_out: '其他支出' };
  const ACCOUNTS = ['现金', '微信', '支付宝', '银行卡', '信用卡', '其他'];
  const COLORS = ['#caa53a', '#e4002b', '#1f6feb', '#00976b', '#7b5cff', '#d98200', '#00a6b8', '#f5b301', '#e0556b'];

  let ledTab = 'general';            // general | mortgage
  let fType = 'all', fCat = 'all';

  /* ---------------- 一般记账 ---------------- */
  const ledgerAll = () => M.list('ledger');
  const amt = r => +r.amount || 0;
  const catName = k => IN_CATS[k] || OUT_CATS[k] || k || '—';

  function formHTML(r) {
    r = r || {};
    const t = r.type || 'out';
    const catOpts = (t === 'in' ? IN_CATS : OUT_CATS);
    return `<div class="form-grid">
      <div class="field"><label>日期</label><input class="input" type="date" id="lDate" value="${r.date || M.today()}"></div>
      <div class="field"><label>类型</label><select id="lType">
        <option value="out" ${t === 'out' ? 'selected' : ''}>支出</option>
        <option value="in" ${t === 'in' ? 'selected' : ''}>收入</option>
      </select></div>
      <div class="field"><label>金额（元）</label><input class="input" type="number" step="0.01" id="lAmt" value="${r.amount != null ? r.amount : ''}" placeholder="必填"></div>
      <div class="field"><label>分类</label><select id="lCat">${Object.keys(catOpts).map(k => `<option value="${k}" ${(r.cat || (t === 'out' ? 'food' : 'salary')) === k ? 'selected' : ''}>${catOpts[k]}</option>`).join('')}</select></div>
      <div class="field"><label>账户</label><select id="lAcc">${ACCOUNTS.map(a => `<option ${r.account === a ? 'selected' : ''}>${a}</option>`).join('')}</select></div>
      <div class="field" style="grid-column:1/-1"><label>备注</label><input class="input" id="lNote" value="${M.esc(r.note || '')}" placeholder="如：午餐 / 地铁卡充值"></div>
    </div>
    <div class="form-act"><button class="btn" id="lSave">保存记录</button><button class="btn btn-ghost" id="lCancel">取消</button></div>`;
  }

  function openForm(id) {
    const r = id ? M.db().ledger.find(x => x.id === id) : null;
    M.modal(id ? '编辑记账' : '新增记账', formHTML(r), body => {
      const typeSel = $('#lType', body);
      const catSel = $('#lCat', body);
      const refillCat = () => {
        const catOpts = (typeSel.value === 'in' ? IN_CATS : OUT_CATS);
        catSel.innerHTML = Object.keys(catOpts).map(k => `<option value="${k}">${catOpts[k]}</option>`).join('');
      };
      typeSel.onchange = refillCat;
      $('#lCancel', body).onclick = M.closeModal;
      $('#lSave', body).onclick = () => {
        const o = {
          date: $('#lDate', body).value || M.today(),
          type: typeSel.value,
          cat: catSel.value,
          amount: +$('#lAmt', body).value || 0,
          account: $('#lAcc', body).value,
          note: $('#lNote', body).value.trim()
        };
        if (!o.amount) { M.toast('请填写金额', 'warn'); return; }
        if (id) M.update('ledger', id, o); else M.add('ledger', o);
        M.closeModal(); M.toast('已保存', 'ok'); render();
      };
    });
  }

  /* ---------------- 房贷（独立模块） ---------------- */
  const mCfg = () => M.db().mortgageCfg;
  const mRecs = () => M.list('mortgage');

  function addMonths(ym, n) {
    const [y, m] = String(ym).split('-').map(Number);
    const d = new Date(y, (m || 1) - 1 + n, 1);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  }

  const round2 = x => Math.round((+x || 0) * 100) / 100;

  // 等额本息月供（给定余额、剩余期数、月利率）
  function annuityPay(balance, periodsLeft, r) {
    if (periodsLeft <= 0) return balance;
    if (r === 0) return balance / periodsLeft;
    const f = Math.pow(1 + r, periodsLeft);
    return balance * r * f / (f - 1);
  }

  // 首期月供（用于展示）
  function monthlyPay(cfg) {
    const P = +cfg.total || 0, n = (+cfg.years || 0) * 12;
    if (!P || !n) return 0;
    const r = (+cfg.rate || 0) / 100 / 12;
    return annuityPay(P, n, r);
  }

  // 第 k 期适用的年利率（LPR 动态调整：取最近一次 ≤ k 的利率变动；无则基准利率）
  function effRateFn(cfg) {
    const adjs = (cfg.rateAdj || []).slice().sort((a, b) => (+a.at) - (+b.at));
    return k => {
      let rr = +cfg.rate || 0;
      for (const a of adjs) if (+a.at <= k) rr = +a.rate;
      return rr;
    };
  }

  // 重定价模式：利率变动后如何重算
  // reprice_pay（默认，银行LPR标准）：年限不变，按剩余本金/剩余期数/新利率重算月供
  // shorten_term：月供保持首期年金不变，靠缩短（或延长）期限消化
  function repriceOf(cfg) { return cfg.repriceMode === 'shorten_term' ? 'shorten_term' : 'reprice_pay'; }

  // 生成子计划：从 fromK 期起，余额 balance，按 mode 摊销到贷款结束
  // mode: 'reprice_pay' | 'shorten_term'；fixedPay 用于 shorten_term（月供不变）
  function buildSubSchedule(cfg, fromK, balance, mode, fixedPay) {
    const n = (+cfg.years) * 12;
    const start = cfg.start || M.today().slice(0, 7);
    const rateAt = effRateFn(cfg);
    const out = [];
    let remain = balance, pay = fixedPay || 0, prevR = null;
    for (let k = fromK; k <= n; k++) {
      const rPct = rateAt(k), r = rPct / 100 / 12;
      const periodsLeft = n - k + 1;
      const isChange = prevR === null || Math.abs(rPct - prevR) > 1e-9;
      if (mode === 'reprice_pay') {
        if (isChange || prevR === null) pay = annuityPay(remain, periodsLeft, r);
      } else { // shorten_term：月供固定为首期
        if (prevR === null) pay = fixedPay;
      }
      let interest = remain * r;
      let principal = pay - interest;
      if (k === n) principal = remain;            // 末期修正
      remain = Math.max(0, remain - principal);
      out.push({
        k, date: addMonths(start, k - 1), pay: round2(pay),
        principal: round2(principal), interest: round2(interest),
        remain: round2(remain), rate: rPct
      });
      prevR = rPct;
      if (mode === 'shorten_term' && remain <= 0) break;   // 月供固定：提前还清则结束（缩短年限）
    }
    return out;
  }

  // 理论还款计划（支持逐期利率 + 重定价模式）
  function schedule(cfg) {
    const P = +cfg.total || 0, n = (+cfg.years) * 12;
    if (!P || !n) return [];
    const mode = repriceOf(cfg);
    const start = cfg.start || M.today().slice(0, 7);
    const rateAt = effRateFn(cfg);
    const out = [];
    let remain = P, pay = 0, prevR = null;
    for (let k = 1; k <= n; k++) {
      const rPct = rateAt(k), r = rPct / 100 / 12;
      const periodsLeft = n - k + 1;
      const isChange = prevR === null || Math.abs(rPct - prevR) > 1e-9;
      if (mode === 'reprice_pay') {
        if (isChange) pay = annuityPay(remain, periodsLeft, r);
      } else {
        if (prevR === null) pay = annuityPay(P, n, r);   // 首期年金，之后不变
      }
      let interest = remain * r;
      let principal = pay - interest;
      if (k === n) principal = remain;
      remain = Math.max(0, remain - principal);
      out.push({
        k, date: addMonths(start, k - 1), pay: round2(pay),
        principal: round2(principal), interest: round2(interest),
        remain: round2(remain), rate: rPct
      });
      prevR = rPct;
      if (mode === 'shorten_term' && remain <= 0) break;   // 月供固定：提前还清则结束（缩短年限）
    }
    return out;
  }

  // 提前还款试算：在第 afterK 期后一次性偿还 amount 本金，对比原剩余方案
  // mode = shorten_term（月供不变·缩短期限）| reduce_pay（期限不变·减少月供）
  // 支持逐期利率：原方案/新方案都基于 schedule()，受 rateAdj 与重定价模式影响
  function prepayCalc(cfg, p, mode) {
    if (!p || +p.amount <= 0) return null;
    mode = mode === 'reduce_pay' ? 'reduce_pay' : 'shorten_term';
    const n = (+cfg.years) * 12;
    const sch = schedule(cfg);
    const afterK = Math.min(Math.max(1, Math.floor(+p.afterK || 0)), n - 1);
    const sAfter = sch[afterK - 1];
    const remainAfterK = sAfter ? sAfter.remain : 0;
    const amount = Math.min(+p.amount || 0, remainAfterK);
    if (amount <= 0) return null;
    const newP = round2(remainAfterK - amount);
    const origRemainK = n - afterK;
    const origRemainInterest = sch.slice(afterK).reduce((a, s) => a + s.interest, 0);
    const rateAt = effRateFn(cfg);
    const r0 = rateAt(afterK + 1) / 100 / 12;

    let newPay, newN, newInterest, feasible = true, sub = null;
    if (mode === 'reduce_pay') {            // 期限不变，按重定价规则重算月供
      sub = buildSubSchedule(cfg, afterK + 1, newP, 'reprice_pay', null);
      newPay = sub.length ? sub[0].pay : 0;
      newN = sub.length;
      newInterest = sub.reduce((a, s) => a + s.interest, 0);
    } else {                                 // 月供不变，缩短期限
      const fixedPay = sAfter ? sAfter.pay : (sch[0] ? sch[0].pay : 0);
      if (fixedPay <= newP * r0) {
        feasible = false; newPay = fixedPay; newN = n - afterK; newInterest = Infinity;
      } else {
        sub = buildSubSchedule(cfg, afterK + 1, newP, 'shorten_term', fixedPay);
        newPay = fixedPay; newN = sub.length;
        newInterest = sub.reduce((a, s) => a + s.interest, 0);
      }
    }
    newN = Math.max(1, newN);
    const saved = feasible ? round2(origRemainInterest - newInterest) : 0;
    return {
      afterK, remainAfterK, amount, newP, mode, feasible,
      origRemainK, origRemainInterest: round2(origRemainInterest),
      newPay: round2(newPay), newN,
      newInterest: round2(newInterest), savedInterest: saved
    };
  }

  // 基于已记录还款，按"第 k 笔 = 第 k 期"映射计划，得出已还/剩余
  function mortgageSummary(cfg) {
    const recs = mRecs().slice().sort((a, b) => a.date.localeCompare(b.date));
    const sch = schedule(cfg);
    let paidPrincipal = 0, paidInterest = 0, paidTotal = 0;
    recs.forEach((rec, i) => {
      const s = sch[i];
      if (s) { paidPrincipal += s.principal; paidInterest += s.interest; }
      paidTotal += +rec.amount || 0;
    });
    const total = +cfg.total || 0;
    return {
      recs, sch, paidTotal,
      paidPrincipal: Math.round(paidPrincipal * 100) / 100,
      paidInterest: Math.round(paidInterest * 100) / 100,
      remainPrincipal: Math.max(0, Math.round((total - paidPrincipal) * 100) / 100),
      remainInterest: Math.max(0, Math.round((sch.reduce((a, s) => a + s.interest, 0) - paidInterest) * 100) / 100),
      periods: recs.length
    };
  }

  function nextPayDate(cfg) {
    const recs = mRecs().slice().sort((a, b) => a.date.localeCompare(b));
    if (!recs.length) return (cfg.start ? cfg.start + '-01' : M.today());
    return addMonths(recs[recs.length - 1].date.slice(0, 7), 1) + '-01';
  }

  function openMortgageCfg() {
    const c = mCfg();
    const adjs = (c.rateAdj || []).slice().sort((a, b) => (+a.at) - (+b.at));
    const reprice = c.repriceMode === 'shorten_term' ? 'shorten_term' : 'reprice_pay';
    const adjRows = adjs.map((a, i) => `<div class="adj-row" data-i="${i}">
        <input class="input" type="number" data-k="at" value="${a.at}" min="2" placeholder="期数">
        <span class="adj-sep">期起</span>
        <input class="input" type="number" step="0.01" data-k="rate" value="${a.rate}" placeholder="年利率%">
        <span class="adj-sep">%</span>
        <button class="btn btn-sm btn-ghost" data-deladj="${i}">×</button>
      </div>`).join('');
    M.modal('房贷参数', `<div class="form-grid">
      <div class="field"><label>贷款总额（元）</label><input class="input" type="number" id="mTotal" value="${c.total || ''}" placeholder="如 1000000"></div>
      <div class="field"><label>基准年利率（%）</label><input class="input" type="number" step="0.01" id="mRate" value="${c.rate || ''}" placeholder="如 4.9"></div>
      <div class="field"><label>贷款年限（年）</label><input class="input" type="number" id="mYears" value="${c.years || ''}" placeholder="如 30"></div>
      <div class="field"><label>首次还款月份</label><input class="input" type="month" id="mStart" value="${c.start || ''}"></div>
    </div>
    <div class="field" style="margin:6px 0 10px"><label>利率变动时处理（LPR 重定价方式）</label><select id="mReprice" class="input" style="width:100%">
      <option value="reprice_pay" ${reprice === 'reprice_pay' ? 'selected' : ''}>重算月供 · 年限不变（银行 LPR 重定价标准）</option>
      <option value="shorten_term" ${reprice === 'shorten_term' ? 'selected' : ''}>月供不变 · 缩短年限</option>
    </select></div>
    <div style="border-top:1px dashed var(--border);padding-top:12px;margin-top:4px">
      <div class="field" style="margin-bottom:8px"><label>利率变动记录（LPR 动态调整，第 X 期起适用新利率）</label></div>
      <div id="mAdjs">${adjRows || '<div class="note" id="mAdjsEmpty">暂无变动，全程按基准利率计算</div>'}</div>
      <button class="btn btn-sm btn-ghost" id="mAddAdj" style="margin-top:8px">＋ 添加利率变动</button>
    </div>
    <p class="note">💡 按「等额本息」计算。利率变动后按所选方式重算还款计划；首次还款月份用于推算每期应还日。</p>
    <div class="form-act"><button class="btn" id="mSave">保存</button><button class="btn btn-danger" id="mReset">重置全部</button></div>`, body => {
      $('#mReset', body).onclick = () => {
        const cnt = (M.db().mortgage || []).length;
        M.modal('重置房贷数据', `<p>确定要清空全部房贷数据吗？此操作不可恢复。</p>
          <ul class="note" style="margin:10px 0 0 18px;line-height:2">
            <li>房贷参数（总额 / 利率 / 年限 / 利率变动 / 提前还款试算）</li>
            <li>全部 ${cnt} 笔还款记录</li>
          </ul>
          <p class="note" style="margin-top:10px">⚠️ 清空后需重新录入。</p>
          <div class="form-act"><button class="btn btn-danger" id="mResetOk">确认重置</button><button class="btn btn-ghost" id="mResetCancel">取消</button></div>`, cbody => {
          $('#mResetCancel', cbody).onclick = M.closeModal;
          $('#mResetOk', cbody).onclick = () => {
            M.db().mortgageCfg = { total: 0, rate: 0, years: 0, start: '', repriceMode: 'reprice_pay', rateAdj: [], prepay: null };
            M.db().mortgage = [];
            M.save(); M.closeModal(); M.toast('房贷数据已重置', 'ok'); render();
          };
        });
      };
      const wrap = $('#mAdjs', body);
      $('#mAddAdj', body).onclick = () => {
        const empty = $('#mAdjsEmpty', body);
        if (empty) empty.remove();
        const div = document.createElement('div');
        div.className = 'adj-row';
        div.innerHTML = `<input class="input" type="number" data-k="at" placeholder="期数"><span class="adj-sep">期起</span><input class="input" type="number" step="0.01" data-k="rate" placeholder="年利率%"><span class="adj-sep">%</span><button class="btn btn-sm btn-ghost" data-deladj>×</button>`;
        wrap.appendChild(div);
        div.querySelector('[data-deladj]').onclick = () => div.remove();
      };
      $$('[data-deladj]', body).forEach(b => b.onclick = () => { const row = b.closest('.adj-row'); if (row) row.remove(); });
      $('#mSave', body).onclick = () => {
        const rateAdj = [];
        $$('#mAdjs .adj-row', body).forEach(row => {
          const at = Math.floor(+row.querySelector('[data-k="at"]').value || 0);
          const rt = +row.querySelector('[data-k="rate"]').value || 0;
          if (at >= 2 && rt > 0) rateAdj.push({ at, rate: rt });
        });
        rateAdj.sort((a, b) => a.at - b.at);
        Object.assign(M.db().mortgageCfg, {
          total: +$('#mTotal', body).value || 0,
          rate: +$('#mRate', body).value || 0,
          years: +$('#mYears', body).value || 0,
          start: $('#mStart', body).value || '',
          repriceMode: $('#mReprice', body).value,
          rateAdj
        });
        M.save(); M.closeModal(); M.toast('房贷参数已更新', 'ok'); render();
      };
    });
  }

  function openMortgageForm(id) {
    const c = mCfg();
    const r = id ? mRecs().find(x => x.id === id) : null;
    const defDate = r ? r.date : nextPayDate(c);
    M.modal(id ? '编辑还款' : '记录房贷还款', `<div class="form-grid">
      <div class="field"><label>还款日期</label><input class="input" type="date" id="mpDate" value="${defDate}"></div>
      <div class="field"><label>实还金额（元）</label><input class="input" type="number" step="0.01" id="mpAmt" value="${r ? r.amount : ''}" placeholder="默认月供 ¥${Math.round(monthlyPay(c))}"></div>
      <div class="field" style="grid-column:1/-1"><label>备注</label><input class="input" id="mpNote" value="${M.esc(r ? r.note : '')}" placeholder="如：第 12 期 / 提前还款"></div>
    </div>
    <div class="form-act"><button class="btn" id="mpSave">保存</button><button class="btn btn-ghost" id="mpCancel">取消</button></div>`, body => {
      $('#mpCancel', body).onclick = M.closeModal;
      $('#mpSave', body).onclick = () => {
        const o = {
          date: $('#mpDate', body).value || M.today(),
          amount: +$('#mpAmt', body).value || 0,
          note: $('#mpNote', body).value.trim()
        };
        if (!o.amount) { M.toast('请填写金额', 'warn'); return; }
        if (id) M.update('mortgage', id, o); else M.add('mortgage', o);
        M.closeModal(); M.toast('已保存', 'ok'); render();
      };
    });
  }

  function openPrepay() {
    const cfg = mCfg();
    const n = (+cfg.years) * 12;
    const p = mCfg().prepay || {};
    const sum = mortgageSummary(cfg);
    const defK = p.afterK != null ? p.afterK : Math.max(sum.periods, 1);
    const defAmt = p.amount != null ? p.amount : '';
    const hasModes = p.modes && p.modes.length;
    const defModes = hasModes ? p.modes : (p.mode ? [p.mode] : ['shorten_term']);
    const chk = m => `<label class="chk"><input type="checkbox" id="ppM_${m}" ${defModes.indexOf(m) >= 0 ? 'checked' : ''}> ${m === 'shorten_term' ? '月供不变 · 缩短期限（更省利息）' : '期限不变 · 减少月供（减轻月供压力）'}</label>`;
    M.modal('提前还款试算', `<div class="form-grid">
      <div class="field"><label>提前还款时机（第几期后）</label><input class="input" type="number" id="ppK" value="${defK}" min="1" max="${n - 1}"></div>
      <div class="field"><label>提前还款金额（元）</label><input class="input" type="number" step="0.01" id="ppAmt" value="${defAmt}" placeholder="如 100000"></div>
      <div class="field" style="grid-column:1/-1"><label>处理方式（可多选，对比展示）</label><div class="chk-group">${chk('shorten_term')}${chk('reduce_pay')}</div></div>
    </div>
    <p class="note">💡 在第 k 期正常还款后，额外一次性偿还一笔本金。可勾选一种或两种方式，系统对比「原始剩余方案」展示新月供 / 新期限 / 节省利息。试算结果不参与实际还款台账，仅供测算。</p>
    <div class="form-act"><button class="btn" id="ppSave">开始试算</button><button class="btn btn-ghost" id="ppCancel">取消</button></div>`, body => {
      $('#ppCancel', body).onclick = M.closeModal;
      $('#ppSave', body).onclick = () => {
        const afterK = Math.floor(+$('#ppK', body).value || 0);
        const amount = +$('#ppAmt', body).value || 0;
        const modes = ['shorten_term', 'reduce_pay'].filter(m => $('#ppM_' + m, body).checked);
        if (afterK < 1 || afterK >= n) { M.toast('期数需在 1 ~ ' + (n - 1) + ' 之间', 'warn'); return; }
        if (amount <= 0) { M.toast('请填写提前还款金额', 'warn'); return; }
        if (!modes.length) { M.toast('请至少选择一种处理方式', 'warn'); return; }
        M.db().mortgageCfg.prepay = { afterK, amount, modes, mode: modes[0] };
        M.save(); M.closeModal(); M.toast('试算完成', 'ok'); render();
      };
    });
  }

  // 单种处理方式的对比卡片（仅展示随方式变化的结果；公共项在外层统一展示）
  function prepayModeCard(pp, sum) {
    const modeTxt = pp.mode === 'reduce_pay' ? '期限不变 · 减少月供' : '月供不变 · 缩短期限';
    const c = pp.mode === 'reduce_pay' ? '#7b5cff' : 'var(--c-ledger)';
    if (!pp.feasible) {
      return `<div class="card" style="margin-bottom:0"><h3 class="card-h"><span class="dot" style="background:${c}"></span>${modeTxt}</h3>
        <div class="empty" style="padding:18px"><span class="e-ico">⚠️</span>当前月供不足以覆盖提前还款后的利息，无法以「月供不变」方式结清，请改用「减少月供」。</div></div>`;
    }
    return `<div class="card" style="margin-bottom:0"><h3 class="card-h"><span class="dot" style="background:${c}"></span>${modeTxt}</h3>
      <div class="kv-grid">
        <div class="kv"><span>新剩余期数</span><b style="color:${c}">${pp.newN} 期</b></div>
        <div class="kv"><span>新月供</span><b>${M.money(pp.newPay)}</b></div>
        <div class="kv"><span>新剩余利息</span><b>${M.money(pp.newInterest)}</b></div>
        <div class="kv"><span>节省利息</span><b style="color:#00976b">${M.money(pp.savedInterest)}</b></div>
      </div>
      <p class="note" style="margin-top:8px">新方案累计利息 ≈ 已还 ${M.money(sum.paidInterest)} + 提前还款 ${M.money(pp.amount)} + 新剩余利息 ${M.money(pp.newInterest)}</p>
    </div>`;
  }

  function renderMortgage(box) {
    const cfg = mCfg();
    const hasCfg = (+cfg.total > 0) && (+cfg.years > 0);
    if (!hasCfg) {
      box.innerHTML = `<div class="empty" style="padding:48px 20px"><span class="e-ico">🏠</span>先设置房贷参数，自动算出月供与还款计划
        <br><button class="btn btn-sm" id="mCfg" style="margin-top:12px">设置房贷参数</button></div>`;
      $('#mCfg', box).onclick = openMortgageCfg;
      setHeroMeta('剩余本金', '月供', M.money(0), M.money(0));
      return;
    }
    const pay = monthlyPay(cfg);
    const n = (+cfg.years) * 12;
    const sum = mortgageSummary(cfg);
    const totalPay = sum.sch.reduce((a, s) => a + s.pay, 0);
    const totalInterest = totalPay - (+cfg.total);
    const adjs = (cfg.rateAdj || []).slice().sort((a, b) => (+a.at) - (+b.at));
    const hasAdj = adjs.length > 0;
    const repriceTxt = cfg.repriceMode === 'shorten_term' ? '月供不变 · 缩短年限' : '重算月供 · 年限不变';
    // 每年实际还款总额（按记录日期的年份聚合实际还款金额与笔数）
    const yearMap = {};
    sum.recs.forEach(r => { const y = (r.date || '').slice(0, 4); if (!yearMap[y]) yearMap[y] = { count: 0, total: 0 }; yearMap[y].count++; yearMap[y].total += (+r.amount || 0); });
    const trend = Object.keys(yearMap).sort().map(y => ({ label: y + '年', count: yearMap[y].count, value: Math.round(yearMap[y].total * 100) / 100 }));
    const prepay = mCfg().prepay || {};
    let ppHTML = `<div class="empty" style="padding:24px 16px"><span class="e-ico">🧮</span>点「试算」设置提前还款金额与方式，对比原方案节省的利息</div>`;
    if (prepay.amount > 0) {
      const modes = (prepay.modes && prepay.modes.length) ? prepay.modes : [prepay.mode || 'shorten_term'];
      const results = modes.map(m => prepayCalc(cfg, prepay, m)).filter(Boolean);
      if (results.length) {
        const f = results[0];
        const common = `
        <p class="note" style="margin-bottom:10px">📌 在第 <b>${f.afterK}</b> 期后一次性提前还款 <b>${M.money(f.amount)}</b></p>
        <div class="kv-grid" style="margin-bottom:12px">
          <div class="kv"><span>提前还款前剩余本金</span><b>${M.money(f.remainAfterK)}</b></div>
          <div class="kv"><span>提前还款后剩余本金</span><b>${M.money(f.newP)}</b></div>
          <div class="kv"><span>原剩余期数</span><b>${f.origRemainK} 期</b></div>
          <div class="kv"><span>原剩余利息</span><b>${M.money(f.origRemainInterest)}</b></div>
        </div>`;
        const cards = results.map(r => prepayModeCard(r, sum)).join('');
        ppHTML = common + (results.length === 2 ? `<div class="grid g2">${cards}</div>` : cards);
      }
    }

    box.innerHTML = `
    <div class="grid g4" style="margin-bottom:14px">
      <div class="stat" style="--sc:var(--c-ledger)"><div class="k">贷款总额</div><div class="v">${M.money(cfg.total)}</div><div class="s">基准 ${cfg.rate}% · ${cfg.years} 年${hasAdj ? ` · ${adjs.length} 次调整` : ''}</div></div>
      <div class="stat" style="--sc:#00976b"><div class="k">${hasAdj ? '首期月供' : '月供（等额本息）'}</div><div class="v">${M.money(pay)}</div><div class="s">${hasAdj ? `利率随LPR调整 · 共${n}期` : `共 ${n} 期`}</div></div>
      <div class="stat" style="--sc:#1f6feb"><div class="k">已还 / 总期数</div><div class="v">${sum.periods} <span style="font-size:14px;opacity:.7">/ ${n}</span></div><div class="s">已还本金 ${M.money(sum.paidPrincipal)}</div></div>
      <div class="stat" style="--sc:var(--c-hot)"><div class="k">剩余本金</div><div class="v">${M.money(sum.remainPrincipal)}</div><div class="s">已还利息 ${M.money(sum.paidInterest)}</div></div>
    </div>

    <div class="toolbar">
      <div class="tool-right">
        <button class="btn btn-sm btn-ghost" id="mCfg">⚙️ 参数</button>
        <button class="btn btn-sm btn-ghost" id="mExport">导出 CSV</button>
      </div>
    </div>

    <div class="card" style="margin-bottom:14px"><h3 class="card-h"><span class="dot"></span>每年实际还款总额</h3>
      ${trend.length ? `<div class="tb-wrap"><table>
        <thead><tr><th>年份</th><th>笔数</th><th>实际还款总额</th></tr></thead>
        <tbody>${trend.map(t => `<tr><td>${t.label}</td><td class="note">${t.count}</td><td><b>${M.money(t.value)}</b></td></tr>`).join('')}</tbody>
        <tfoot><tr><td>合计</td><td class="note">${sum.recs.length}</td><td><b>${M.money(trend.reduce((a, t) => a + t.value, 0))}</b></td></tr></tfoot>
      </table></div>` : '<div class="empty" style="padding:20px"><span class="e-ico">📊</span>还没有实际还款记录，无法统计年度还款</div>'}
    </div>

    <div class="card" style="margin-bottom:14px"><h3 class="card-h"><span class="dot"></span>还款汇总</h3>
      <div class="kv-grid">
        <div class="kv"><span>贷款总额</span><b>${M.money(cfg.total)}</b></div>
        <div class="kv"><span>${hasAdj ? '首期月供' : '月供'}</span><b>${M.money(pay)}</b></div>
        <div class="kv"><span>利率变动</span><b>${hasAdj ? adjs.length + ' 次（LPR动态）' : '固定 ' + cfg.rate + '%'}</b></div>
        <div class="kv"><span>重定价方式</span><b>${repriceTxt}</b></div>
        <div class="kv"><span>还款总额</span><b>${M.money(totalPay)}</b></div>
        <div class="kv"><span>总利息</span><b>${M.money(totalInterest)}</b></div>
        <div class="kv"><span>已还总额</span><b>${M.money(sum.paidTotal)}</b></div>
        <div class="kv"><span>已还本金</span><b>${M.money(sum.paidPrincipal)}</b></div>
        <div class="kv"><span>已还利息</span><b>${M.money(sum.paidInterest)}</b></div>
        <div class="kv"><span>剩余本金</span><b style="color:var(--c-hot)">${M.money(sum.remainPrincipal)}</b></div>
        <div class="kv"><span>剩余利息</span><b>${M.money(sum.remainInterest)}</b></div>
      </div>
    </div>

    <div class="card" style="margin-bottom:14px"><h3 class="card-h"><span class="dot"></span>提前还款试算
      <span class="more"><button class="btn btn-sm btn-ghost" id="ppEdit">试算</button></span></h3>
      ${ppHTML}
    </div>

    <div class="card">
      <h3 class="card-h"><span class="dot"></span>还款台账 <span class="more">${sum.recs.length} 笔</span></h3>
      ${sum.recs.length ? `<div class="tb-wrap"><table>
        <thead><tr><th>期数</th><th>应还日</th><th>实还日</th><th>月供</th><th>本金</th><th>利息</th><th>利率</th><th>剩余本金</th><th>备注</th><th></th></tr></thead>
        <tbody>${sum.recs.map((r, i) => { const s = sum.sch[i] || {}; return `<tr>
          <td class="note">第 ${i + 1} 期</td>
          <td class="note">${s.date || '—'}</td>
          <td class="note">${r.date}</td>
          <td><b>${M.money(r.amount)}</b></td>
          <td>${s.principal != null ? M.money(s.principal) : '—'}</td>
          <td>${s.interest != null ? M.money(s.interest) : '—'}</td>
          <td class="note" style="color:${hasAdj ? 'var(--c-ledger)' : 'inherit'}">${s.rate != null ? s.rate + '%' : '—'}</td>
          <td>${s.remain != null ? M.money(s.remain) : '—'}</td>
          <td>${M.esc(r.note || '')}</td>
          <td><div class="t-act"><button class="btn btn-sm btn-ghost" data-edit="${r.id}">改</button><button class="btn btn-sm btn-ghost" data-del="${r.id}">删</button></div></td>
        </tr>`; }).join('')}</tbody></table></div>`
        : `<div class="empty"><span class="e-ico">🏠</span>还没有还款记录，点「记一笔还款」记录每期月供<br><span class="note" style="margin-top:8px">系统按参数自动推算每期本金 / 利息 / 剩余本金</span></div>`}
    </div>`;

    $('#mCfg', box).onclick = openMortgageCfg;
    $('#mExport', box).onclick = exportMortgageCSV;
    const ppEditBtn = $('#ppEdit', box); if (ppEditBtn) ppEditBtn.onclick = openPrepay;
    $$('[data-edit]', box).forEach(b => b.onclick = () => openMortgageForm(b.dataset.edit));
    $$('[data-del]', box).forEach(b => b.onclick = () => M.confirm('确定删除这条还款记录？', () => { M.remove('mortgage', b.dataset.del); render(); M.toast('已删除', 'ok'); }));

    setHeroMeta('剩余本金', '月供', M.money(sum.remainPrincipal), M.money(pay));
  }

  function exportMortgageCSV() {
    const cfg = mCfg();
    const sum = mortgageSummary(cfg);
    const rows = [['期数', '应还日', '实还日', '月供', '本金', '利息', '利率', '剩余本金', '备注']];
    sum.recs.forEach((r, i) => {
      const s = sum.sch[i] || {};
      rows.push([i + 1, s.date || '', r.date, r.amount, s.principal != null ? s.principal : '', s.interest != null ? s.interest : '', s.rate != null ? s.rate : '', s.remain != null ? s.remain : '', r.note || '']);
    });
    const csv = '﻿' + rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = '房贷还款_' + M.today() + '.csv'; a.click();
    M.toast('已导出 CSV', 'ok');
  }

  /* ---------------- 渲染分发 + 一般记账视图 ---------------- */
  function setHeroMeta(l1, l2, v1, v2) {
    const a = $('#ledMeta1L'), b = $('#ledMeta2L'), c = $('#ledgerBalance'), d = $('#ledgerExpense');
    if (a) a.textContent = l1; if (b) b.textContent = l2;
    if (c) c.textContent = v1; if (d) d.textContent = v2;
  }

  function render() {
    const box = $('#ledgerBody'); if (!box) return;
    // hero「记一笔」按钮文案随当前 tab 切换，作为唯一的新增入口
    const addBtn = $('#ledgerAdd');
    if (addBtn) addBtn.textContent = ledTab === 'mortgage' ? '＋ 记一笔还款' : '＋ 记一笔';
    if (ledTab === 'mortgage') return renderMortgage(box);

    const list = ledgerAll();
    const m = M.month();
    const lm = list.filter(r => M.month(r.date) === m);
    const inM = lm.filter(r => r.type === 'in').reduce((s, r) => s + amt(r), 0);
    const outM = lm.filter(r => r.type === 'out').reduce((s, r) => s + amt(r), 0);
    const balM = inM - outM;
    const allIn = list.filter(r => r.type === 'in').reduce((s, r) => s + amt(r), 0);
    const allOut = list.filter(r => r.type === 'out').reduce((s, r) => s + amt(r), 0);

    // 近 6 月收支
    const incLine = [], outLine = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - i);
      const mm = M.month(M.today(d));
      const x = list.filter(r => M.month(r.date) === mm);
      incLine.push({ label: mm.slice(5) + '月', value: Math.round(x.filter(r => r.type === 'in').reduce((s, r) => s + amt(r), 0) * 100) / 100 });
      outLine.push({ label: mm.slice(5) + '月', value: Math.round(x.filter(r => r.type === 'out').reduce((s, r) => s + amt(r), 0) * 100) / 100 });
    }
    // 支出分类占比
    const byCat = {};
    list.filter(r => r.type === 'out').forEach(r => { byCat[r.cat] = (byCat[r.cat] || 0) + amt(r); });
    const donut = Object.keys(byCat).sort((a, b) => byCat[b] - byCat[a]).slice(0, 8)
      .map((k, i) => ({ label: catName(k), value: Math.round(byCat[k] * 100) / 100, color: COLORS[i % COLORS.length] }));

    let view = list;
    if (fType !== 'all') view = view.filter(r => r.type === fType);
    if (fCat !== 'all') view = view.filter(r => r.cat === fCat);
    view = view.sort((a, b) => b.date.localeCompare(a.date));

    // 分类筛选选项：与「新增记账」共用同一份 IN_CATS / OUT_CATS，按当前 tab 类型取值，显示中文名
    const catMap = fType === 'in' ? IN_CATS : fType === 'out' ? OUT_CATS : Object.assign({}, IN_CATS, OUT_CATS);
    const catOptsHTML = Object.keys(catMap).map(k => `<option value="${k}" ${fCat === k ? 'selected' : ''}>${catName(k)}</option>`).join('');

    box.innerHTML = `
    <div class="grid g4" style="margin-bottom:14px">
      <div class="stat" style="--sc:#00976b"><div class="k">本月收入</div><div class="v">${M.money(inM)}</div><div class="s">${m}</div></div>
      <div class="stat" style="--sc:var(--c-hot)"><div class="k">本月支出</div><div class="v">${M.money(outM)}</div><div class="s">共 ${lm.filter(r => r.type === 'out').length} 笔</div></div>
      <div class="stat" style="--sc:var(--c-ledger)"><div class="k">本月结余</div><div class="v" style="color:${balM < 0 ? 'var(--c-hot)' : 'inherit'}">${(balM >= 0 ? '+' : '−') + M.money(Math.abs(balM))}</div><div class="s">${balM < 0 ? '⚠ 本月超支' : '收支健康'}</div></div>
      <div class="stat" style="--sc:#1f6feb"><div class="k">累计结余</div><div class="v">${M.money(allIn - allOut)}</div><div class="s">收 ${M.money(allIn)} / 支 ${M.money(allOut)}</div></div>
    </div>

    <div class="card" style="margin-bottom:14px"><h3 class="card-h"><span class="dot"></span>近 6 月收支（元）</h3>
      <div class="tb-wrap"><table class="ot-tbl">
        <thead><tr><th>月份</th><th>收入</th><th>支出</th></tr></thead>
        <tbody>${incLine.map((d, i) => `<tr>
          <td class="note">${d.label}</td>
          <td class="col-add">+${M.money(d.value)}</td>
          <td class="col-sub">−${M.money(outLine[i].value)}</td>
        </tr>`).join('')}</tbody>
      </table></div>
    </div>

    <div class="card" style="margin-bottom:14px"><h3 class="card-h"><span class="dot"></span>支出分类占比</h3>
      ${donut.length ? M.donut(donut) + '<div class="legend">' + donut.map(d => `<span><i style="background:${d.color}"></i>${M.esc(d.label)} ${M.money(d.value)}</span>`).join('') + '</div>' : '<div class="empty" style="padding:20px"><span class="e-ico">🧾</span>暂无支出数据</div>'}
    </div>

    <div class="card">
      <h3 class="card-h"><span class="dot"></span>收支台账 <span class="more">${view.length} 条</span>
        <div class="card-tools">
          <div class="tabs" id="lTabs">
            <button class="tab ${fType === 'all' ? 'is-active' : ''}" data-t="all">全部 ${list.length}</button>
            <button class="tab ${fType === 'in' ? 'is-active' : ''}" data-t="in">收入 ${list.filter(r => r.type === 'in').length}</button>
            <button class="tab ${fType === 'out' ? 'is-active' : ''}" data-t="out">支出 ${list.filter(r => r.type === 'out').length}</button>
          </div>
          <select class="input" id="lCatF" style="width:120px"><option value="all" ${fCat === 'all' ? 'selected' : ''}>全部分类</option>${catOptsHTML}</select>
          <button class="btn btn-sm btn-ghost" id="lExport">导出 CSV</button>
        </div>
      </h3>
      ${view.length ? `<div class="tb-wrap"><table>
        <thead><tr><th>日期</th><th>类型</th><th>分类</th><th>金额</th><th>账户</th><th>备注</th><th></th></tr></thead>
        <tbody>${view.map(r => `<tr>
          <td class="note">${r.date.slice(5)}</td>
          <td><span class="tag" style="background:${r.type === 'in' ? '#00976b' : 'var(--c-hot)'}22;color:${r.type === 'in' ? '#00976b' : 'var(--c-hot)'}">${r.type === 'in' ? '收入' : '支出'}</span></td>
          <td><span class="pill">${M.esc(catName(r.cat))}</span></td>
          <td><b style="color:${r.type === 'in' ? '#00976b' : 'var(--c-hot)'}">${r.type === 'in' ? '+' : '−'}${M.money(amt(r))}</b></td>
          <td class="note">${M.esc(r.account || '—')}</td>
          <td>${M.esc(r.note || '')}</td>
          <td><div class="t-act"><button class="btn btn-sm btn-ghost" data-edit="${r.id}">改</button><button class="btn btn-sm btn-ghost" data-del="${r.id}">删</button></div></td>
        </tr>`).join('')}</tbody></table></div>`
        : `<div class="empty"><span class="e-ico">🧾</span>还没有记账，先记一笔吧<br><button class="btn btn-sm" id="lNew2" style="margin-top:10px">记一笔</button></div>`}
    </div>`;

    $$('#lTabs .tab', box).forEach(b => b.onclick = () => { fType = b.dataset.t; fCat = 'all'; render(); });
    $('#lCatF').onchange = e => { fCat = e.target.value; render(); };
    const n2 = $('#lNew2'); if (n2) n2.onclick = () => openForm();
    $('#lExport').onclick = exportCSV;
    $$('[data-edit]', box).forEach(b => b.onclick = () => openForm(b.dataset.edit));
    $$('[data-del]', box).forEach(b => b.onclick = () => M.confirm('确定删除这条记账？', () => { M.remove('ledger', b.dataset.del); render(); M.toast('已删除', 'ok'); }));

    setHeroMeta('本月结余', '本月支出', M.money(balM), M.money(outM));
  }

  function exportCSV() {
    const rows = [['日期', '类型', '分类', '金额', '账户', '备注']];
    ledgerAll().sort((a, b) => a.date.localeCompare(b.date)).forEach(r => rows.push([
      r.date, r.type === 'in' ? '收入' : '支出', catName(r.cat), r.amount, r.account || '', r.note || ''
    ]));
    const csv = '﻿' + rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = '记账_' + M.today() + '.csv'; a.click();
    M.toast('已导出 CSV', 'ok');
  }

  M.ledger = {
    init() {
      const g = $('#ledTabGeneral'), m = $('#ledTabMortgage');
      const setTab = t => {
        ledTab = t;
        g.classList.toggle('is-active', t === 'general');
        m.classList.toggle('is-active', t === 'mortgage');
        render();
      };
      g.onclick = () => setTab('general');
      m.onclick = () => setTab('mortgage');
      $('#ledgerAdd').onclick = () => ledTab === 'mortgage' ? openMortgageForm() : openForm();
      render();
    },
    render,
    // 计算助手（供测试/调试调用）
    calc: { monthlyPay, annuityPay, effRateFn, repriceOf, schedule, buildSubSchedule, prepayCalc, addMonths }
  };
})(window.MW);
