/* ==========================================================
   影视推荐：电视剧 / 电影 / 动漫，各国佳作收藏与管理
   ========================================================== */
(function (M) {
  'use strict';
  const $ = M.$;

  const KINDS = { tv: '电视剧', movie: '电影', anime: '动漫' };
  const COUNTRIES = ['中国', '美国', '日本', '韩国', '英国', '法国', '泰国', '其他'];
  const STATUS = {
    wish:     { n: '想看', c: '#d98200' },
    watching: { n: '在看', c: '#1f6feb' },
    done:     { n: '已看', c: '#00976b' }
  };
  const RANK = { wish: 0, watching: 1, done: 2 };

  let fKind = 'all', fCountry = 'all', fStatus = 'all', fSearch = '';

  /* 首次使用时注入的示例库（覆盖三类 + 多国，剧荒不愁） */
  const SEED = [
    { name: '繁花', kind: 'tv', country: '中国', status: 'done', rate: 4.5, genre: '年代/剧情', year: 2023, note: '王家卫美学，上海风情' },
    { name: '绝命毒师', kind: 'tv', country: '美国', status: 'done', rate: 5, genre: '犯罪/剧情', year: 2008, note: '化学反应般的经典' },
    { name: '半泽直树', kind: 'tv', country: '日本', status: 'done', rate: 4.8, genre: '职场', year: 2013, note: '以牙还牙' },
    { name: '信号', kind: 'tv', country: '韩国', status: 'done', rate: 4.7, genre: '悬疑', year: 2016, note: '跨时空对讲机' },
    { name: '神探夏洛克', kind: 'tv', country: '英国', status: 'done', rate: 4.6, genre: '推理', year: 2010, note: '现代福尔摩斯' },
    { name: '凡尔赛', kind: 'tv', country: '法国', status: 'watching', rate: 4.2, genre: '历史', year: 2015, note: '宫廷权谋' },
    { name: '以你的心诠释我的爱', kind: 'tv', country: '泰国', status: 'done', rate: 4.5, genre: '爱情', year: 2020, note: '清迈夏日' },
    { name: '流浪地球', kind: 'movie', country: '中国', status: 'done', rate: 4.6, genre: '科幻', year: 2019, note: '带着地球去流浪' },
    { name: '盗梦空间', kind: 'movie', country: '美国', status: 'done', rate: 4.9, genre: '科幻', year: 2010, note: '梦境层层嵌套' },
    { name: '情书', kind: 'movie', country: '日本', status: 'done', rate: 4.7, genre: '爱情', year: 1995, note: '暗恋的温柔' },
    { name: '寄生虫', kind: 'movie', country: '韩国', status: 'done', rate: 4.8, genre: '剧情', year: 2019, note: '阶层寓言' },
    { name: '国王的演讲', kind: 'movie', country: '英国', status: 'done', rate: 4.5, genre: '历史', year: 2010, note: '口吃国王' },
    { name: '名侦探柯南', kind: 'anime', country: '日本', status: 'watching', rate: 4.8, genre: '推理', year: 1996, note: '真相只有一个' },
    { name: '进击的巨人', kind: 'anime', country: '日本', status: 'done', rate: 4.7, genre: '热血', year: 2013, note: '墙外的世界' },
    { name: '罗小黑战记', kind: 'anime', country: '中国', status: 'done', rate: 4.6, genre: '奇幻', year: 2019, note: '国产治愈系' },
    { name: '瑞克和莫蒂', kind: 'anime', country: '美国', status: 'watching', rate: 4.7, genre: '科幻喜剧', year: 2013, note: '脑洞宇宙' },
    { name: '沙丘2', kind: 'movie', country: '美国', status: 'wish', rate: 0, genre: '科幻', year: 2024, note: '沙漠星战' },
    { name: '漫长的季节', kind: 'tv', country: '中国', status: 'wish', rate: 0, genre: '悬疑', year: 2023, note: '东北往事' }
  ];

  function countries() {
    const set = new Set(COUNTRIES);
    M.list('film').forEach(r => { if (r.country) set.add(r.country); });
    return Array.from(set);
  }
  function stOf(r) { return STATUS[r.status] || { n: '—', c: '#888' }; }

  function injectSeed() {
    if (M.list('film').length) return;
    const db = M.db();
    SEED.forEach(s => db.film.push(Object.assign({ id: M.uid(), _u: Date.now(), _d: 0 }, s)));
    M.save({ silent: true });
  }

  function openForm(id) {
    const ed = id ? M.list('film').find(r => r.id === id) : null;
    const countryOpts = countries().map(c => `<option ${ed && ed.country === c ? 'selected' : ''}>${M.esc(c)}</option>`).join('');
    const kindOpts = Object.keys(KINDS).map(k => `<option value="${k}" ${ed && ed.kind === k ? 'selected' : ''}>${KINDS[k]}</option>`).join('');
    const statusOpts = Object.keys(STATUS).map(k => `<option value="${k}" ${ed && ed.status === k ? 'selected' : ''}>${STATUS[k].n}</option>`).join('');
    const rateOpts = [0, 1, 2, 3, 4, 5].map(v => `<option value="${v}" ${ed && (ed.rate || 0) === v ? 'selected' : ''}>${v === 0 ? '未评' : v + ' 星'}</option>`).join('');
    M.modal(ed ? '编辑影片' : '添加影片', `
      <div class="form-grid">
        <div class="field" style="grid-column:1/-1"><label>片名</label><input class="input" id="fName" value="${M.esc(ed ? ed.name : '')}" placeholder="如：漫长的季节"></div>
        <div class="field"><label>分类</label><select class="input" id="fKind">${kindOpts}</select></div>
        <div class="field"><label>国家 / 地区</label><select class="input" id="fCountry">${countryOpts}</select></div>
        <div class="field"><label>状态</label><select class="input" id="fStatus">${statusOpts}</select></div>
        <div class="field"><label>评分</label><select class="input" id="fRate">${rateOpts}</select></div>
        <div class="field"><label>年份</label><input class="input" id="fYear" type="number" value="${ed ? (ed.year || '') : ''}" placeholder="如：2023"></div>
        <div class="field" style="grid-column:1/-1"><label>类型 / 标签</label><input class="input" id="fGenre" value="${M.esc(ed ? ed.genre || '' : '')}" placeholder="如：悬疑 / 科幻"></div>
        <div class="field" style="grid-column:1/-1"><label>短评 / 备注</label><input class="input" id="fNote" value="${M.esc(ed ? ed.note || '' : '')}" placeholder="一句话安利"></div>
      </div>
      <div class="form-act"><button class="btn" id="filmSave">${ed ? '保存修改' : '添加影片'}</button></div>
    `, body => {
      body.querySelector('#filmSave').onclick = () => {
        const name = body.querySelector('#fName').value.trim();
        if (!name) { M.toast('片名不能为空', 'warn'); return; }
        const obj = {
          name,
          kind: body.querySelector('#fKind').value,
          country: body.querySelector('#fCountry').value,
          status: body.querySelector('#fStatus').value,
          rate: +body.querySelector('#fRate').value || 0,
          genre: body.querySelector('#fGenre').value.trim(),
          year: +body.querySelector('#fYear').value || 0,
          note: body.querySelector('#fNote').value.trim()
        };
        if (ed) { M.update('film', id, obj); M.toast('已更新', 'ok'); }
        else { M.add('film', obj); M.toast('已添加', 'ok'); }
        M.closeModal(); render();
      };
    });
  }

  function render() {
    const box = $('#filmBody'); if (!box) return;
    const list = M.list('film');
    const total = list.length;
    const wish = list.filter(r => r.status === 'wish').length;
    const watching = list.filter(r => r.status === 'watching').length;
    const done = list.filter(r => r.status === 'done').length;
    const rated = list.filter(r => r.status === 'done' && r.rate > 0);
    const avg = rated.length ? Math.round(rated.reduce((a, r) => a + r.rate, 0) / rated.length * 10) / 10 : 0;

    // 国家下拉（保留当前筛选）
    const fc = $('#filmCountry');
    if (fc) {
      fc.innerHTML = '<option value="all">全部国家</option>' + countries().map(c => `<option value="${M.esc(c)}">${M.esc(c)}</option>`).join('');
      fc.value = fCountry;
    }

    // 筛选
    let view = list;
    if (fKind !== 'all') view = view.filter(r => r.kind === fKind);
    if (fCountry !== 'all') view = view.filter(r => r.country === fCountry);
    if (fStatus !== 'all') view = view.filter(r => r.status === fStatus);
    if (fSearch) {
      const q = fSearch.toLowerCase();
      view = view.filter(r => (r.name || '').toLowerCase().includes(q) || (r.genre || '').toLowerCase().includes(q));
    }
    view = view.slice().sort((a, b) =>
      (RANK[a.status] - RANK[b.status]) || ((b.year || 0) - (a.year || 0)) || (a.name || '').localeCompare(b.name || ''));

    box.innerHTML = `
      <div class="grid g4" style="margin-bottom:14px">
        <div class="stat" style="--sc:var(--c-film)"><div class="k">已收录</div><div class="v">${total}</div><div class="s">剧集/电影/动漫</div></div>
        <div class="stat" style="--sc:#d98200"><div class="k">想看</div><div class="v">${wish}</div><div class="s">待开看</div></div>
        <div class="stat" style="--sc:#1f6feb"><div class="k">在看</div><div class="v">${watching}</div><div class="s">追更中</div></div>
        <div class="stat" style="--sc:#00976b"><div class="k">已看</div><div class="v">${done}</div><div class="s">均分 ${avg ? avg.toFixed(1) : '—'}</div></div>
      </div>

      <div class="card">
        <h3 class="card-h"><span class="dot"></span>影视台账 <span class="more">${view.length} 部</span></h3>
        ${view.length ? `<div class="tb-wrap"><table>
          <thead><tr><th>片名</th><th>分类</th><th>国家</th><th>状态</th><th>评分</th><th>类型 / 年份</th><th></th></tr></thead>
          <tbody>${view.map(r => { const st = stOf(r); return `<tr>
            <td><b>${M.esc(r.name)}</b>${r.note ? '<div class="note">' + M.esc(r.note) + '</div>' : ''}</td>
            <td><span class="pill">${KINDS[r.kind] || '—'}</span></td>
            <td>${M.esc(r.country || '—')}</td>
            <td><span class="tag" style="background:${st.c}22;color:${st.c}">${st.n}</span></td>
            <td class="note">${r.rate > 0 ? '★' + r.rate.toFixed(1) : '—'}</td>
            <td class="note">${(r.genre || '—') + (r.year ? (' · ' + r.year) : '')}</td>
            <td><div class="t-act">
              <button class="btn btn-sm btn-ghost" data-edit="${r.id}">改</button>
              <button class="btn btn-sm btn-ghost" data-del="${r.id}">删</button>
            </div></td>
          </tr>`; }).join('')}</tbody></table></div>`
          : `<div class="empty"><span class="e-ico">🎬</span>还没有影片，去添加第一部吧<br><button class="btn btn-sm" id="filmNew2" style="margin-top:10px">添加</button></div>`}
      </div>`;

    const c = $('#filmCount'); if (c) c.textContent = total;
    const w = $('#filmWish'); if (w) w.textContent = wish;

    // 事件
    $$on(box, '[data-edit]', el => el.onclick = () => openForm(el.dataset.edit));
    $$on(box, '[data-del]', el => el.onclick = () => {
      const it = M.list('film').find(r => r.id === el.dataset.del);
      M.confirm('确定删除《' + (it ? it.name : '') + '》？', () => { M.remove('film', el.dataset.del); render(); M.toast('已删除', 'ok'); });
    });
    const n2 = $('#filmNew2'); if (n2) n2.onclick = () => openForm();

    const tabs = $('#filmTabs'); if (tabs) $$on(tabs, '.tab', el => el.onclick = () => { fKind = el.dataset.kind; $$on(tabs, '.tab', t => t.classList.toggle('is-active', t === el)); render(); });
    if (fc) fc.onchange = () => { fCountry = fc.value; render(); };
    const fs = $('#filmStatus'); if (fs) fs.onchange = () => { fStatus = fs.value; render(); };
    const fq = $('#filmSearch'); if (fq) fq.oninput = () => { fSearch = fq.value.trim(); render(); };
    const fa = $('#filmAdd'); if (fa) fa.onclick = () => openForm();
  }

  function $$on(root, sel, fn) { M.$$(sel, root).forEach(fn); }

  M.film = {
    init() { injectSeed(); render(); M.on('data', () => { const v = $('#view-film'); if (v && v.classList.contains('is-active')) render(); }); },
    render
  };
})(window.MW);
