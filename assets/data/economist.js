/* ==========================================================
   每日经济学人 · 精读语料库
   说明：以下篇目为按《经济学人》文体与论证结构原创撰写的练习稿，
        供 CATTI 备考精读与视译训练使用（非原刊转载）。
   ========================================================== */
window.ECONOMIST = [
  {
    id: 'e01', section: 'Finance & economics', title: 'The soft landing that nobody quite believes in',
    cn_title: '无人尽信的“软着陆”',
    paras: [
      { en: 'For two years economists have warned that taming inflation would cost jobs. It has not, or at least not yet. Unemployment across the rich world remains close to historic lows even as headline price growth has fallen by two-thirds from its peak. That combination was supposed to be impossible.', cn: '两年来，经济学家一再警告，驯服通胀必以就业为代价。事实并非如此，至少目前尚未如此。发达国家失业率仍接近历史低位，而整体物价涨幅已较峰值回落三分之二。这样的组合本被认为不可能出现。' },
      { en: 'Optimists credit central bankers for acting decisively. A more sober reading is that much of the disinflation came from the unwinding of supply-chain snarls rather than from higher interest rates. If so, the remaining stretch—from three percent to two—may prove the hardest, for it must be won in the labour market rather than at the ports.', cn: '乐观者将功劳归于央行果断出手。更冷静的解读是：多数反通胀成效源自供应链梗阻的缓解，而非利率上调。果真如此，从 3% 降至 2% 的最后一程恐怕最为艰难——这一仗要在劳动力市场打，而不是在港口。' },
      { en: 'Policymakers therefore face an unenviable choice. Ease too soon and they risk re-anchoring expectations at an uncomfortably high level; hold too long and they invite the very recession they have so far avoided. Neither error would be forgiven quickly, and both would be obvious only in hindsight.', cn: '决策者由此面临两难。过早放松，通胀预期恐将锚定在令人不安的高位；紧缩过久，则可能招致迄今侥幸避开的衰退。两种失误都不会很快被原谅，而且都只有事后才看得分明。' }
    ],
    vocab: [
      { w: 'tame inflation', d: '驯服通胀（tame 作动词，比 control 更具画面感）' },
      { w: 'headline price growth', d: '整体物价涨幅（headline 指未剔除食品能源的总体指标，对应 core 核心）' },
      { w: 'a sober reading', d: '更冷静／清醒的解读（reading 此处指“解读”，非“阅读”）' },
      { w: 'supply-chain snarls', d: '供应链梗阻（snarl 原意“缠结”，媒体高频）' },
      { w: 're-anchor expectations', d: '重新锚定预期（货币政策术语，anchor 为定译“锚定”）' },
      { w: 'only in hindsight', d: '只有事后才（明白）；hindsight 事后之明' }
    ],
    notes: [
      '“That combination was supposed to be impossible.” 短句独立成段收尾，是《经济学人》制造反转的常用手法，中文可保留短句节奏，不必并入上句。',
      '“Ease too soon and they risk…; hold too long and they invite…” 祈使句 + and 表条件，译为“过早放松，……；紧缩过久，则……”，中文以对仗小句呈现。'
    ]
  },
  {
    id: 'e02', section: 'Business', title: 'The quiet reinvention of the factory floor',
    cn_title: '车间里静悄悄的革命',
    paras: [
      { en: 'Talk of robots replacing workers tends to conjure images of gleaming humanoids. The reality on most factory floors is duller and more consequential: sensors bolted onto decades-old machines, feeding data to software that predicts when a bearing will fail.', cn: '一谈起机器人取代工人，人们脑中浮现的往往是锃亮的人形机器。而多数车间的现实要乏味得多，影响却大得多：在用了数十年的机床上装几个传感器，把数据送进软件，由软件预判轴承何时会坏。' },
      { en: 'The returns are unglamorous but real. One German mid-sized manufacturer reckons unplanned downtime has fallen by nearly a third since it began monitoring vibration data. No jobs were lost; the maintenance crew simply stopped working nights.', cn: '这类回报并不光鲜，却实实在在。德国一家中型制造商估算，自开始监测振动数据以来，非计划停机减少了近三分之一。无人因此失业，只是维修班组不必再上夜班。' },
      { en: 'Such gains are, however, stubbornly hard to scale. Each plant is a bespoke tangle of legacy equipment, and the consultants who once promised a turnkey “smart factory” have grown noticeably more modest. Productivity, it turns out, is retail work, not wholesale.', cn: '然而这类收益极难复制推广。每座工厂都是一团独一无二的老旧设备，而当年承诺“交钥匙智慧工厂”的咨询顾问们，如今明显低调了许多。事实证明，提升生产率是零售式的精耕细作，而非批发式的一蹴而就。' }
    ],
    vocab: [
      { w: 'conjure images of', d: '让人联想到、勾起……的画面' },
      { w: 'unplanned downtime', d: '非计划停机（工业术语）' },
      { w: 'unglamorous but real', d: '不光鲜却真实（形容词对举，典型economist句式）' },
      { w: 'a bespoke tangle of', d: '独一无二的一团（bespoke 定制的，此处反讽）' },
      { w: 'turnkey', d: '交钥匙（工程），即一站式交付' },
      { w: 'retail work, not wholesale', d: '零售式而非批发式（比喻：需逐一精耕，无法一揽子解决）' }
    ],
    notes: [
      '末句 “Productivity, it turns out, is retail work, not wholesale.” 借商业术语作比喻收尾，翻译需补出比喻义（精耕细作 / 一蹴而就），否则中文读者不知所云。',
      '“No jobs were lost; the maintenance crew simply stopped working nights.” 分号连接两个短句，后句以具体细节支撑前句结论，译文保留分号与克制语气。'
    ]
  },
  {
    id: 'e03', section: 'Science & technology', title: 'When models learn to say “I don\'t know”',
    cn_title: '当模型学会说“我不知道”',
    paras: [
      { en: 'The most useful improvement to artificial intelligence in the past year may also be the least glamorous: teaching models to express uncertainty. A system that confidently invents a citation is worse than useless in law or medicine, where the cost of a plausible falsehood is measured in years or lives.', cn: '过去一年人工智能最有用的改进，或许也是最不起眼的一项：教会模型表达不确定性。一个信誓旦旦编造引文的系统，在法律或医学领域比无用更糟——在那里，一个听起来合理的谎言，代价以年计、以命计。' },
      { en: 'Calibration, as statisticians call it, means that a model claiming 80% confidence should be right about 80% of the time. Today\'s largest systems are strikingly poor at this, in part because the training process rewards fluency over hedging. Sounding sure is, unfortunately, an easy way to sound helpful.', cn: '统计学家所说的“校准”，是指模型宣称有八成把握时，就应有八成左右的正确率。当今最大的系统在这方面表现糟糕，部分原因在于训练过程奖励流畅表达而非审慎存疑。遗憾的是，说得笃定，往往就显得有用。' },
      { en: 'Fixes exist. Ensembles of models can be polled; outputs can be checked against retrieved documents. Both add cost and latency, which is precisely why they remain optional. Until buyers demand calibration as insistently as they demand speed, they will keep getting neither.', cn: '办法是有的：可对多个模型集成投票，也可将输出与检索到的文档相互核验。两者都会增加成本与时延——这恰恰是它们至今仍属“可选项”的原因。除非买方像追求速度那样执着地要求校准，否则两样都得不到。' }
    ],
    vocab: [
      { w: 'worse than useless', d: '比无用更糟（强调负价值）' },
      { w: 'a plausible falsehood', d: '看似合理的谬误' },
      { w: 'calibration', d: '（统计）校准，指置信度与准确率相符' },
      { w: 'reward fluency over hedging', d: '奖励流畅表达甚于审慎措辞（hedge 使用模糊限制语）' },
      { w: 'latency', d: '时延、响应延迟' },
      { w: 'as insistently as', d: '像……一样执着地' }
    ],
    notes: [
      '“measured in years or lives” 译“以年计、以命计”，用中文四字节奏复现英文的凝练，避免“用年或生命来衡量”的翻译腔。',
      '结尾 “they will keep getting neither” 中的 neither 指代前文 calibration 与 speed，中文须显化为“两样都得不到”。'
    ]
  },
  {
    id: 'e04', section: 'Leaders', title: 'The case for boring infrastructure',
    cn_title: '为“乏味的基建”辩护',
    paras: [
      { en: 'Ribbon-cuttings favour the spectacular. Politicians would rather open a bridge than replace a pipe, even though the pipe may deliver more welfare per dollar. This bias has a name in the literature—maintenance neglect—and a cost that arrives, invisibly, decades later.', cn: '剪彩仪式偏爱壮观场面。政客宁愿为一座大桥揭幕，也不愿更换一根水管——尽管每一元钱花在水管上带来的福祉可能更多。这种偏好在文献中有个名字：维护缺位；其代价则在数十年后悄然显现。' },
      { en: 'America\'s water utilities lose roughly a sixth of treated water to leaks. Britain\'s figure is not much better. Fixing this would be cheaper than building new reservoirs, would cut energy use and would inconvenience almost nobody. It also generates no photographs.', cn: '美国自来水系统约有六分之一的处理水因渗漏流失，英国的数字也好不了多少。堵住漏损比新建水库更便宜，还能减少能耗，且几乎不惊扰任何人。唯一的缺点是——拍不出照片。' },
      { en: 'The remedy is institutional rather than technical. Ring-fenced maintenance budgets, published asset registers and regulators willing to penalise deferred repairs would do more for infrastructure than another grand plan. Unglamorous governance, it seems, is the price of glamorous cities.', cn: '解决之道在制度而非技术。专款专用的维护预算、公开的资产台账，以及愿意对拖延检修施以处罚的监管机构，其作用胜过又一份宏伟规划。看来，光鲜的城市，须以乏味的治理为代价。' }
    ],
    vocab: [
      { w: 'ribbon-cutting', d: '剪彩（仪式）' },
      { w: 'welfare per dollar', d: '每元钱产生的福祉（成本效益视角）' },
      { w: 'maintenance neglect', d: '维护缺位／重建轻养' },
      { w: 'ring-fenced budget', d: '专款专用预算（ring-fence 圈定、隔离保护）' },
      { w: 'asset register', d: '资产台账／登记册' },
      { w: 'deferred repairs', d: '拖延的检修' }
    ],
    notes: [
      '“It also generates no photographs.” 一句冷幽默收束，直译“它也产生不了照片”过于生硬，可译“唯一的缺点是——拍不出照片”，用破折号复现停顿感。',
      '末句 Unglamorous governance… is the price of glamorous cities 形成 unglamorous/glamorous 的对照，中文用“乏味／光鲜”对举保留修辞。'
    ]
  },
  {
    id: 'e05', section: 'Finance & economics', title: 'Why cheap money made housing dear',
    cn_title: '廉价资金何以推高房价',
    paras: [
      { en: 'A decade of low interest rates was meant to make homes affordable. It did the opposite. When borrowing costs fall, buyers can service larger loans; competition then bids prices up until monthly payments are roughly as burdensome as before. The subsidy is capitalised into the asset, not the buyer\'s pocket.', cn: '十年低利率本意是让住房更可负担，结果适得其反。借贷成本下降后，买家能承担更大额度的贷款；竞相加价直至月供负担与从前大致相当。补贴最终被资本化进了资产价格，而非留在买家口袋里。' },
      { en: 'The effect is starkest where supply is least elastic. In cities that permit little new construction, each loosening of credit shows up almost entirely in prices; where builders can respond, it shows up in houses. Zoning, in other words, determines who captures the gain.', cn: '在供给弹性最小的地方，这一效应最为鲜明。在几乎不允许新建的城市，每一次信贷松动几乎全数体现为价格上涨；而在开发商能够回应的地方，则体现为房屋供给。换言之，是分区规划决定了谁攫取了这份收益。' },
      { en: 'None of this is an argument for dear money. It is an argument for treating housing costs as a planning problem wearing a monetary disguise. Rate-setters can change the terms of the auction; only planners can change what is being auctioned.', cn: '这并非在主张实行高利率，而是在主张：应把住房成本视作一个披着货币外衣的规划问题。利率制定者能改变拍卖的条件，唯有规划者才能改变被拍卖的标的。' }
    ],
    vocab: [
      { w: 'service a loan', d: '偿付贷款（本息），service 作动词' },
      { w: 'be capitalised into', d: '被资本化计入（资产价格）' },
      { w: 'supply elasticity', d: '供给弹性' },
      { w: 'zoning', d: '（城市）分区规划／用途管制' },
      { w: 'dear money', d: '高利率／银根紧（dear = 昂贵，与 cheap money 相对）' },
      { w: 'wearing a monetary disguise', d: '披着货币（政策）的外衣' }
    ],
    notes: [
      '标题 “cheap money made housing dear” 靠 cheap/dear 的反义双关，中文难以完全对应，可译“廉价资金何以推高房价”，在正文首段补足逻辑。',
      '末句两个分句结构对称（change the terms of the auction / change what is being auctioned），译文亦保持“改变……条件／改变……标的”的对仗。'
    ]
  },
  {
    id: 'e06', section: 'International', title: 'The world\'s workforce is getting older, fast',
    cn_title: '全球劳动力正在迅速老去',
    paras: [
      { en: 'Demography is often called destiny, which is unfair to demographers: they have been warning about this for forty years. By 2050 nearly one in six people worldwide will be over 65, up from one in eleven today. The shift is fastest not in Europe but in East Asia, where it is compressed into a single generation.', cn: '人们常说“人口即命运”，这对人口学家并不公平——他们已经警告了四十年。到 2050 年，全球每六人中将有近一人年过 65 岁，而今天这一比例为十一分之一。转变最快的并非欧洲，而是东亚，其变化被压缩在一代人之内。' },
      { en: 'The economic arithmetic is unforgiving. Fewer workers must support more retirees, and productivity growth has not obliged by accelerating. Yet the picture is not uniformly bleak: healthier ageing means many can work longer, and a shrinking labour force raises the return on automation.', cn: '经济账目冷酷无情：更少的劳动者要供养更多的退休者，而生产率增速并未随之加快。不过前景并非一片灰暗：更健康的老龄化意味着许多人可以工作更久，而劳动力萎缩也提高了自动化的回报率。' },
      { en: 'Policy has been slow to adjust. Retirement ages set when life expectancy was sixty-five now look quaint; immigration remains politically fraught almost everywhere. Countries that face the arithmetic early will find the adjustment merely difficult. Those that delay will find it wrenching.', cn: '政策调整迟缓。当年按预期寿命六十五岁设定的退休年龄如今显得不合时宜；而移民问题在几乎所有国家都政治敏感。及早正视这本账的国家，只会觉得调整困难；一再拖延的国家，则将痛彻心扉。' }
    ],
    vocab: [
      { w: 'demography is destiny', d: '人口即命运（人口结构决定长期走势）' },
      { w: 'unforgiving arithmetic', d: '冷酷无情的算术账' },
      { w: 'has not obliged', d: '未能配合／未如人愿（oblige 此处为“帮忙、成全”）' },
      { w: 'politically fraught', d: '政治上高度敏感、充满张力' },
      { w: 'look quaint', d: '显得过时而古怪' },
      { w: 'wrenching', d: '剧痛的、撕裂式的（形容调整之痛）' }
    ],
    notes: [
      '“merely difficult / wrenching” 的程度对比是全文落点，译文用“只会觉得困难／将痛彻心扉”拉开层次，切勿都译成“困难”。',
      '“productivity growth has not obliged by accelerating” 中 oblige 是拟人用法，直译“生产率没有义务加速”会失真，宜译“并未随之加快”。'
    ]
  },
  {
    id: 'e07', section: 'Business', title: 'The subscription trap tightens',
    cn_title: '订阅陷阱越收越紧',
    paras: [
      { en: 'Businesses love recurring revenue; customers, less so. The average American household now pays for a dozen subscriptions, a third of which go unused in any given month. Firms have learned that inertia is more profitable than loyalty and design accordingly.', cn: '企业钟爱经常性收入，消费者则未必。如今美国普通家庭订阅十来项服务，其中约三分之一在任一月份都未曾使用。企业已经明白：惰性比忠诚更赚钱，产品设计也据此而来。' },
      { en: 'Regulators are stirring. Rules requiring cancellation to be as easy as sign-up—“click to cancel”—have arrived in several markets. Compliance has been creative: one streaming service reduced its cancellation flow to a single button, then added four screens of retention offers before it.', cn: '监管者开始行动。要求“取消与订阅同样便捷”的“一键退订”规则已在多个市场落地。企业的合规方式颇具创意：某流媒体把退订流程压缩为一个按钮，却在按钮之前加了四屏挽留优惠。' },
      { en: 'The deeper problem is pricing opacity rather than friction. When a service raises its monthly fee by a dollar, few notice; when a dozen do so at once, budgets buckle quietly. Transparency rules may prove more powerful than cancellation rules, if only because they are harder to design around.', cn: '更深层的问题在于定价不透明，而非退订麻烦。某项服务月费上调一美元，鲜有人察觉；十几项同时上调，家庭预算便悄然吃紧。透明度规则或许比退订规则更有力——原因很简单：它更难被绕开。' }
    ],
    vocab: [
      { w: 'recurring revenue', d: '经常性收入（订阅制核心指标）' },
      { w: 'inertia', d: '惰性（此处指用户懒得取消）' },
      { w: 'click to cancel', d: '一键退订（监管术语）' },
      { w: 'retention offer', d: '挽留优惠' },
      { w: 'pricing opacity', d: '定价不透明' },
      { w: 'design around', d: '绕开（规则）设计、规避' }
    ],
    notes: [
      '“Businesses love recurring revenue; customers, less so.” 省略句 customers, less so = customers love it less so，中文补出“则未必”即可，不必补全。',
      '“budgets buckle quietly” 中 buckle 意为“压弯、扛不住”，译“预算悄然吃紧”比“预算弯曲”准确。'
    ]
  },
  {
    id: 'e08', section: 'Finance & economics', title: 'Green industrial policy meets its budget constraint',
    cn_title: '绿色产业政策撞上预算硬约束',
    paras: [
      { en: 'Subsidising clean technology was the easy part. Governments discovered that writing cheques is popular, and that factories make satisfying backdrops. The harder part—now arriving—is deciding which of those cheques to stop writing.', cn: '补贴清洁技术是容易的部分。各国政府发现，开支票很受欢迎，工厂也是令人满意的背景板。更难的部分如今已然来临：决定哪些支票不再签发。' },
      { en: 'Fiscal room has narrowed just as demand for support has broadened. Battery makers, hydrogen ventures, carbon-capture pilots and heat-pump installers all present themselves as strategic. Ministries lack the technical capacity to adjudicate, and the political cost of picking losers is immediate while the benefit is diffuse.', cn: '财政空间收窄之际，寻求扶持的行业却在扩大。电池厂商、氢能项目、碳捕集试点、热泵安装商，无一不自称具有战略意义。各部委缺乏足够的技术能力做出裁断，而淘汰“输家”的政治代价立竿见影，收益却分散难察。' },
      { en: 'A better design would tie support to outcomes rather than to sectors: a price on carbon, plus competitive auctions for whatever abatement it fails to deliver. That is less exciting than a ribbon-cutting, and considerably harder to photograph. It is also the only version that survives a downturn.', cn: '更好的设计是把扶持与结果挂钩，而非与行业挂钩：设定碳价，再对碳价未能带来的减排量进行竞争性招标。这远不如剪彩令人兴奋，也确实难以拍照留念，却是唯一能熬过经济下行的方案。' }
    ],
    vocab: [
      { w: 'fiscal room', d: '财政空间' },
      { w: 'present oneself as strategic', d: '自称具有战略意义' },
      { w: 'adjudicate', d: '裁断、裁定' },
      { w: 'picking losers', d: '（政策）挑出输家（与 picking winners 相对）' },
      { w: 'a price on carbon', d: '碳定价' },
      { w: 'abatement', d: '（污染／碳排）削减量' }
    ],
    notes: [
      '“the political cost is immediate while the benefit is diffuse” 是政策分析常用对照，译“代价立竿见影，收益分散难察”，用四字格提升可读性。',
      '注意 picking winners/losers 为产业政策固定表达，指政府挑选扶持对象，不可直译为“挑选赢家/输家”而不加解释。'
    ]
  },
  {
    id: 'e09', section: 'Science & technology', title: 'The unglamorous triumph of the heat pump',
    cn_title: '热泵：不动声色的胜利',
    paras: [
      { en: 'Few technologies have been so consistently underestimated. A heat pump does not generate heat; it moves it, which is why it can deliver three or four units of warmth for every unit of electricity consumed. Thermodynamics, not marketing, does the heavy lifting.', cn: '很少有技术被如此持续地低估。热泵并不产生热量，而是搬运热量——这正是它每消耗一单位电能可输出三到四单位热量的原因。真正出力的是热力学，而非营销。' },
      { en: 'Adoption nonetheless lags. Upfront costs are high, installers are scarce and the retrofit often requires better insulation first, which turns a weekend job into a renovation. In cold climates the physics still works; the plumbing is what fails.', cn: '然而普及依旧滞后。前期成本高、安装工短缺，加之改造往往需先提升保温性能，于是一个周末就能干完的活变成了一场装修。在寒冷地区，物理原理仍然成立，出问题的是管道施工。' },
      { en: 'Governments keen to decarbonise heating would do well to subsidise training rather than hardware. A grant lowers the price of a unit once; a qualified installer lowers the cost of every unit thereafter. Skills, unlike rebates, compound.', cn: '有意推动供暖脱碳的政府，与其补贴设备，不如补贴培训。一笔补助只能让一台设备便宜一次；一名合格的安装工却能降低此后每一台的成本。技能与返现不同——技能会复利增长。' }
    ],
    vocab: [
      { w: 'do the heavy lifting', d: '承担主要工作、真正出力' },
      { w: 'adoption lags', d: '（技术）普及滞后' },
      { w: 'upfront cost', d: '前期／一次性成本' },
      { w: 'retrofit', d: '改造、加装（既有建筑设备升级）' },
      { w: 'rebate', d: '返现、补贴退款' },
      { w: 'compound', d: '复利式累积增长' }
    ],
    notes: [
      '“the physics still works; the plumbing is what fails” 用具体名词形成对比，译“物理原理仍然成立，出问题的是管道施工”，保留了“理论没错、工程掉链子”的讽刺。',
      '末句 “Skills, unlike rebates, compound.” 三词收尾极简，中文需加破折号或补语才立得住：“技能会复利增长”。'
    ]
  },
  {
    id: 'e10', section: 'Leaders', title: 'In defence of doing less, better',
    cn_title: '为“少做而精”辩护',
    paras: [
      { en: 'Institutions rarely fail for want of ambition. They fail because ambition outruns attention. Ministries announce a dozen strategies a year, each with a launch event and none with a named owner eighteen months later.', cn: '机构失败，鲜少是因为缺乏雄心，而是因为雄心超出了注意力。各部委一年发布十来项战略，每项都有启动仪式，而十八个月后，没有一项还找得到具体负责人。' },
      { en: 'The discipline of subtraction is unnatural in politics. Cancelling a programme creates identifiable victims and anonymous beneficiaries; launching one does the reverse. Yet organisations that prune deliberately tend to deliver more, if only because their staff can remember what they are supposed to be doing.', cn: '在政治中，做减法的自律并不自然。取消一个项目会造就有名有姓的受害者与无名无姓的受益者，启动一个项目则恰好相反。然而，主动做减法的组织往往交付更多——哪怕只是因为员工还记得自己该干什么。' },
      { en: 'The test is not how many initiatives a government launches but how many it can still describe accurately a year on. By that measure most would fail, and quietly know it.', cn: '真正的检验，不是一届政府启动了多少项倡议，而是一年之后它还能准确说清其中几项。以此衡量，多数政府都不及格——而且心里有数。' }
    ],
    vocab: [
      { w: 'for want of', d: '因缺乏……（书面表达，= for lack of）' },
      { w: 'outrun attention', d: '超出注意力所及' },
      { w: 'the discipline of subtraction', d: '做减法的自律' },
      { w: 'identifiable victims / anonymous beneficiaries', d: '有名有姓的受害者／无名无姓的受益者（公共政策经典对照）' },
      { w: 'prune', d: '修剪、削减（项目）' },
      { w: 'a year on', d: '一年之后' }
    ],
    notes: [
      '“and quietly know it” 三词收尾，暗示“心知肚明却不明说”，译“而且心里有数”既简且传神。',
      '注意 identifiable victims / anonymous beneficiaries 这组对照在公共政策文本中反复出现，建议整组背诵。'
    ]
  },
  {
    id: 'e11', section: 'Finance & economics', title: 'The dollar\'s awkward dominance',
    cn_title: '美元难堪的主导地位',
    paras: [
      { en: 'Predictions of the dollar\'s demise have a long and unbroken record of being wrong. Its share of global reserves has drifted down, yet in the plumbing of finance—trade invoicing, derivatives margin, offshore lending—it remains overwhelming and, if anything, more entrenched.', cn: '关于美元衰落的预言，有着悠久而从未中断的错误记录。美元在全球储备中的占比确有下滑，但在金融体系的“管道”里——贸易计价、衍生品保证金、离岸信贷——它依旧压倒性地存在，甚至可以说更加根深蒂固。' },
      { en: 'That dominance is uncomfortable for everyone, including America. Foreign demand for dollar assets pushes up the exchange rate and hollows out tradable industries; abroad, dollar borrowing transmits the Federal Reserve\'s decisions to economies that never voted for them.', cn: '这种主导地位令所有人都不自在，美国自己也不例外。海外对美元资产的需求推高汇率，掏空可贸易部门；而在海外，美元借贷又把美联储的决策传导给那些从未参与投票的经济体。' },
      { en: 'Alternatives exist on paper. In practice, a reserve currency requires deep, liquid markets, open capital accounts and courts that foreigners trust—a combination no challenger yet offers. The dollar\'s position rests less on American strength than on everyone else\'s unwillingness to make the trade-offs.', cn: '替代方案在纸面上是有的。但在现实中，储备货币需要有纵深且流动性充足的市场、开放的资本账户，以及能让外国人信任的法院——这一组合，尚无挑战者能够提供。美元的地位，与其说源自美国的强大，不如说源自其他各方不愿付出相应代价。' }
    ],
    vocab: [
      { w: 'a long and unbroken record of being wrong', d: '一贯错到底的记录（反讽式表达）' },
      { w: 'the plumbing of finance', d: '金融体系的“管道”（指底层基础设施）' },
      { w: 'trade invoicing', d: '贸易计价（以何种货币开票结算）' },
      { w: 'hollow out', d: '掏空、空心化' },
      { w: 'open capital account', d: '资本账户开放' },
      { w: 'make the trade-offs', d: '做出取舍／付出代价' }
    ],
    notes: [
      '“if anything, more entrenched” 中 if anything 表“甚至可以说、要说有变化的话”，是高频插入语，务必掌握。',
      '“economies that never voted for them” 带讽刺意味，译“从未参与投票的经济体”保留原意，不宜改写为“无关国家”。'
    ]
  },
  {
    id: 'e12', section: 'Business', title: 'Why big mergers keep disappointing',
    cn_title: '大并购为何总令人失望',
    paras: [
      { en: 'Roughly two-thirds of large mergers destroy value for the acquirer\'s shareholders. This is not a new finding; it has been replicated for decades across markets and cycles. Boards nonetheless keep approving them, which suggests the problem is not information but incentives.', cn: '约三分之二的大型并购会摧毁收购方股东的价值。这并非新发现——数十年来，在不同市场与周期中反复得到验证。董事会却依旧一次次批准，这说明问题不在于信息不足，而在于激励错位。' },
      { en: 'Chief executives are paid, informally, for the size of what they run. Advisers are paid for deals that close, not deals that work. Synergy estimates, meanwhile, are produced by the very teams whose bonuses depend on the transaction proceeding—a conflict so routine it has stopped being remarked upon.', cn: '首席执行官的报酬在非正式意义上与其管辖规模挂钩；顾问的报酬取决于交易能否达成，而非交易是否成功。与此同时，协同效应的测算，恰恰出自那些奖金系于交易推进的团队之手——这一利益冲突司空见惯到已无人提及。' },
      { en: 'The remedy is dull: clawbacks tied to post-merger performance, independent review of synergy claims, and a default presumption against deals that require heroic assumptions. Dull remedies, unfortunately, do not get proposed at conferences.', cn: '补救之道很乏味：将薪酬追回机制与并购后业绩挂钩、对协同效应主张进行独立复核、并对依赖大胆假设的交易设定默认否决的推定。遗憾的是，乏味的方案，从来不会成为会议上的议题。' }
    ],
    vocab: [
      { w: 'destroy value', d: '毁损（股东）价值' },
      { w: 'be replicated', d: '（研究结论）被反复验证' },
      { w: 'synergy estimates', d: '协同效应测算' },
      { w: 'clawback', d: '（薪酬）追回条款' },
      { w: 'default presumption against', d: '默认反对的推定' },
      { w: 'heroic assumptions', d: '过于大胆／不切实际的假设（金融黑话）' }
    ],
    notes: [
      '“the problem is not information but incentives” 是全篇论点，译文用“不在于……而在于……”的对比结构，切勿弱化。',
      'heroic assumptions 是金融行业惯用讽刺语，指“需要奇迹才能成立的假设”，译“大胆假设”并可加注。'
    ]
  },
  {
    id: 'e13', section: 'International', title: 'Cities are learning to live with water',
    cn_title: '城市学着与水共处',
    paras: [
      { en: 'For a century, urban engineering treated rainwater as waste to be flushed away as fast as possible. Concrete channels did the job until they did not: when storms exceed design capacity, speed becomes the problem rather than the solution.', cn: '一个世纪以来，城市工程把雨水视为废物，力求尽快排走。混凝土渠道一直管用——直到不再管用：当暴雨超出设计容量，排得快反而成了问题本身，而非解决之道。' },
      { en: 'The alternative goes by many names—sponge cities, sustainable drainage, blue-green infrastructure—but rests on one idea: slow the water down. Permeable pavements, restored wetlands and rooftop gardens each absorb a little; together they can shave the peak that overwhelms a sewer.', cn: '替代方案名目繁多——海绵城市、可持续排水、蓝绿基础设施——但核心只有一个：让水慢下来。透水铺装、湿地修复、屋顶花园各自吸纳一点，合在一起便能削去那个压垮下水道的峰值。' },
      { en: 'Retrofitting is slow and rarely photogenic, and the benefits show up as floods that did not happen. Persuading voters to pay for absence is the hardest sale in public policy, which is why the case must be made before the water arrives, not after.', cn: '改造进程缓慢，且鲜有观赏性，其收益体现为“没有发生的洪水”。说服选民为“没有发生的事”掏钱，是公共政策中最难的推销——所以必须在洪水到来之前把道理讲清，而不是之后。' }
    ],
    vocab: [
      { w: 'design capacity', d: '设计容量／设计标准' },
      { w: 'sponge city', d: '海绵城市' },
      { w: 'permeable pavement', d: '透水铺装' },
      { w: 'shave the peak', d: '削峰（削减洪峰／负荷峰值）' },
      { w: 'photogenic', d: '上镜的（此处引申为“有宣传效果的”）' },
      { w: 'pay for absence', d: '为“没有发生的事”买单' }
    ],
    notes: [
      '“Concrete channels did the job until they did not.” until they did not 是英文常见省略式转折，译“一直管用——直到不再管用”，用破折号复现顿挫。',
      '“benefits show up as floods that did not happen” 属反事实表述，中文需加引号处理为“没有发生的洪水”，否则读来突兀。'
    ]
  },
  {
    id: 'e14', section: 'Finance & economics', title: 'The strange resilience of cash',
    cn_title: '现金出人意料的韧性',
    paras: [
      { en: 'Cash was supposed to be dead by now. Its share of transactions has indeed collapsed in Sweden and South Korea, yet the value of banknotes in circulation has risen almost everywhere, including in countries where nobody seems to spend them.', cn: '按理说现金早该消亡了。在瑞典和韩国，其交易占比确已崩塌；然而流通中的纸币价值几乎在各国都有上升——包括那些看上去无人使用现金的国家。' },
      { en: 'The paradox resolves once one separates cash as a medium of exchange from cash as a store of value. Few people buy coffee with banknotes; many keep some under the mattress, and demand for the largest denominations rises reliably whenever confidence in banks or governments wobbles.', cn: '一旦把现金作为“交易媒介”与作为“价值储藏”区分开来，这一悖论便迎刃而解。用纸币买咖啡的人不多，把一些钱压在床垫下的人却不少；每当人们对银行或政府的信心动摇，大面额纸币的需求都会应声上升。' },
      { en: 'That is an argument for keeping cash alive even as digital payment spreads. A payment system with no offline fallback is a single point of failure dressed up as convenience—a lesson learned, repeatedly, during power cuts.', cn: '因此，即便数字支付不断扩张，也有理由让现金继续存在。没有离线备份的支付体系，不过是披着便利外衣的单点故障——这个教训，在一次次停电中被反复印证。' }
    ],
    vocab: [
      { w: 'medium of exchange / store of value', d: '交易媒介／价值储藏（货币两大职能）' },
      { w: 'banknotes in circulation', d: '流通中的纸币' },
      { w: 'denomination', d: '（货币）面额' },
      { w: 'wobble', d: '动摇、不稳' },
      { w: 'offline fallback', d: '离线备用方案' },
      { w: 'single point of failure', d: '单点故障' }
    ],
    notes: [
      '“The paradox resolves once one separates A from B” 是分析类文章拆解矛盾的常用句式，译“一旦把 A 与 B 区分开来，悖论便迎刃而解”。',
      '“dressed up as convenience” 译“披着便利外衣”，保留贬义修辞；避免译成中性的“以便利的形式”。'
    ]
  },
  {
    id: 'e15', section: 'Science & technology', title: 'The long tail of drug discovery',
    cn_title: '药物研发的长尾',
    paras: [
      { en: 'Bringing a new medicine to market takes about a decade and, by most estimates, well over a billion dollars—a figure inflated by the many candidates that fail along the way. The successful drug pays for its dead siblings.', cn: '将一款新药推向市场约需十年，多数估算认为耗资远超十亿美元——这一数字被途中大量折戟的候选药物所抬高。成功上市的那一款，替它夭折的“兄弟姐妹”买了单。' },
      { en: 'Machine learning has compressed parts of this pipeline, particularly the search for molecules that bind to a chosen target. What it has not yet compressed is the part that consumes most of the money: clinical trials, where biology, ethics and recruitment set the pace.', cn: '机器学习已压缩了这条流水线的部分环节，尤其是寻找能与既定靶点结合的分子。但它尚未压缩的，恰是最耗钱的一环——临床试验；在那里，节奏由生物学、伦理与受试者招募决定。' },
      { en: 'Enthusiasts should therefore temper their timelines. Faster candidate generation without faster trials simply produces a longer queue. The bottleneck has moved, which is progress; it has not disappeared, which is worth remembering.', cn: '因此，热情的鼓吹者应当调低时间预期。候选分子生成加快而试验不加快，只会带来更长的排队。瓶颈发生了转移，这是进步；但瓶颈并未消失，这一点值得记住。' }
    ],
    vocab: [
      { w: 'bring a drug to market', d: '将药物推向市场' },
      { w: 'candidate (molecule)', d: '候选（分子／药物）' },
      { w: 'bind to a target', d: '与靶点结合' },
      { w: 'clinical trial', d: '临床试验' },
      { w: 'temper expectations / timelines', d: '调低预期／时间表' },
      { w: 'the bottleneck has moved', d: '瓶颈发生了转移' }
    ],
    notes: [
      '“The successful drug pays for its dead siblings.” 拟人比喻，译“替夭折的‘兄弟姐妹’买单”，加引号提示比喻，避免歧义。',
      '结尾用两个 which 从句形成对仗（which is progress / which is worth remembering），中文以分号并列复现节奏。'
    ]
  },
  {
    id: 'e16', section: 'Leaders', title: 'Education\'s measurement problem',
    cn_title: '教育的“测量难题”',
    paras: [
      { en: 'What gets measured gets managed, runs the adage—and, in schooling, what gets measured gets taught. Standardised tests were introduced to hold systems accountable. They have succeeded, at the cost of narrowing what schools consider worth doing.', cn: '俗话说，可测量者方可管理；而在学校教育中，可测量者便被拿来教。标准化考试的引入本是为了问责教育体系。它做到了，代价却是收窄了学校认为值得去做的事。' },
      { en: 'Nobody disputes that literacy and numeracy matter, or that data beat impressions. The difficulty is that the easiest things to measure are not always the most valuable, and that the gap between them widens as the stakes rise.', cn: '没有人否认读写与算术很重要，也没有人否认数据胜过印象。难点在于：最容易测量的东西未必最有价值；而随着考试利害提高，两者之间的落差还会拉大。' },
      { en: 'The answer is not to abandon assessment but to hold it more lightly: sample rather than census, audit rather than rank, and publish results in a form that invites diagnosis instead of humiliation. Schools improve when they are helped to see, not merely made to fear.', cn: '出路不在于放弃评估，而在于放松其权重：抽样而非普查，审计而非排名，并以促成诊断而非羞辱的方式公布结果。学校的进步，来自被帮助看清问题，而不仅仅是被迫心生恐惧。' }
    ],
    vocab: [
      { w: 'adage', d: '格言、俗语' },
      { w: 'hold sb accountable', d: '对……问责' },
      { w: 'literacy and numeracy', d: '读写能力与计算能力' },
      { w: 'high-stakes (testing)', d: '高利害（考试）' },
      { w: 'sample rather than census', d: '抽样而非普查' },
      { w: 'invite diagnosis', d: '促成／引向诊断' }
    ],
    notes: [
      '“hold it more lightly” 直译“更轻地握住”不通，需意译为“放松其权重／不必奉为圭臬”。',
      '末句 helped to see / made to fear 形成被动结构对照，中文用“被帮助看清／被迫心生恐惧”保留对仗。'
    ]
  },
  {
    id: 'e17', section: 'Business', title: 'Remote work settles into a compromise',
    cn_title: '远程办公落定为一种妥协',
    paras: [
      { en: 'The argument about remote work is over; the negotiation continues. Most large firms have converged on two or three days in the office, a settlement that satisfies nobody entirely and therefore looks stable.', cn: '关于远程办公的争论已经结束，谈判却仍在继续。多数大公司趋同于每周到岗两三天——这种安排谁都不完全满意，因此看上去反而稳固。' },
      { en: 'Evidence on productivity remains muddy, largely because the question is badly posed. Remote work suits focused individual tasks and suits new joiners poorly; it lowers commuting costs and raises coordination costs. Averaging these effects produces a number that describes no actual worker.', cn: '关于生产率的证据依旧混沌，很大程度上是因为问题问错了。远程办公适合需要专注的个人任务，却不适合新人；它降低通勤成本，却抬高协调成本。把这些效应一平均，得出的数字不描述任何一个真实的员工。' },
      { en: 'The interesting question is no longer whether to allow remote work but how to manage by output. That requires defining what good work looks like—an exercise many organisations avoided for decades because attendance was a convenient proxy.', cn: '真正有意思的问题，已不是要不要允许远程办公，而是如何按成果管理。这就要求界定“好的工作”是什么样——而许多组织数十年来一直回避这项功课，因为出勤是一个方便的替代指标。' }
    ],
    vocab: [
      { w: 'converge on', d: '趋同于、汇聚到' },
      { w: 'a settlement that satisfies nobody', d: '谁都不满意的安排（暗示可持续）' },
      { w: 'muddy (evidence)', d: '混沌不清的（证据）' },
      { w: 'badly posed (question)', d: '问题本身提得不当' },
      { w: 'coordination cost', d: '协调成本' },
      { w: 'proxy', d: '替代指标、代理变量' }
    ],
    notes: [
      '“satisfies nobody entirely and therefore looks stable” 内含反讽逻辑（正因人人不满，才无人有力推翻），译文用破折号引出，保留因果的意外感。',
      'proxy 在社科与商业文本中固定译“替代指标／代理变量”，不可译“代理人”。'
    ]
  },
  {
    id: 'e18', section: 'Finance & economics', title: 'What trade statistics no longer capture',
    cn_title: '贸易统计再也测不准的东西',
    paras: [
      { en: 'Trade figures were designed for an era of ships and crates. They struggle with an economy in which a design is drawn in one country, licensed in a second, manufactured in a third and serviced remotely from a fourth.', cn: '贸易统计诞生于轮船与货箱的年代。面对这样一种经济，它便力不从心：设计在甲国完成，授权在乙国办理，制造在丙国进行，售后又由丁国远程提供。' },
      { en: 'Gross figures double-count intermediate goods, inflating the apparent size of bilateral imbalances. Value-added measures correct for this, but they arrive years late and receive a fraction of the attention. Politics runs on the fast, misleading number.', cn: '总量数据重复计算中间品，夸大了双边失衡的表观规模。增加值口径可以纠偏，却往往滞后数年发布，关注度也只有前者的零头。政治所依赖的，恰是那个快速而误导的数字。' },
      { en: 'Better statistics would not settle trade disputes, but they would raise the cost of talking nonsense. That is a modest ambition, and probably the achievable one.', cn: '更好的统计不会平息贸易争端，却能抬高胡说八道的成本。这是个不高的抱负——大概也是唯一能实现的抱负。' }
    ],
    vocab: [
      { w: 'double-count', d: '重复计算' },
      { w: 'intermediate goods', d: '中间品' },
      { w: 'bilateral imbalance', d: '双边（贸易）失衡' },
      { w: 'value-added measure', d: '增加值口径（统计）' },
      { w: 'run on', d: '依靠……运转' },
      { w: 'a modest ambition', d: '不高的抱负（自嘲式收束）' }
    ],
    notes: [
      '首段用 ships and crates 与后文四国分工形成时代对照，译文以“力不从心”承接，避免直译 struggle with。',
      '“raise the cost of talking nonsense” 是典型的经济学人式表述（用成本语言谈公共讨论质量），译“抬高胡说八道的成本”保留其俏皮。'
    ]
  },
  {
    id: 'e19', section: 'International', title: 'Small states, long memories',
    cn_title: '小国，长记性',
    paras: [
      { en: 'Great powers tend to treat each crisis as fresh. Small states cannot afford to. Lacking the margin for error that size confers, they hedge, diversify and remember—sometimes for generations—who behaved well when it was costly to do so.', cn: '大国倾向于把每一次危机都当作全新的一次，小国却没有这种余裕。由于缺乏体量所赋予的容错空间，它们对冲、分散、并且铭记——有时是世代铭记——在付出代价时谁曾行事得体。' },
      { en: 'This produces foreign policies that look inconsistent from the outside and are perfectly coherent from within. A country may buy weapons from one power, energy from a second and hold its reserves in the currency of a third, not out of confusion but out of arithmetic.', cn: '这就造就了从外部看似前后矛盾、从内部看却完全自洽的外交政策。一个国家可能从甲国购买武器、从乙国进口能源，同时以丙国货币持有储备——这并非糊涂，而是算过账的。' },
      { en: 'Bigger powers routinely misread such behaviour as disloyalty. It is better understood as insurance, purchased by those who know they will not be rescued and priced accordingly.', cn: '大国常把这类行为误读为不忠。更恰当的理解是：这是一份保险，由深知自己无人搭救者购买，并据此定价。' }
    ],
    vocab: [
      { w: 'margin for error', d: '容错空间' },
      { w: 'hedge and diversify', d: '对冲与分散（风险）' },
      { w: 'look inconsistent from the outside', d: '从外部看似前后矛盾' },
      { w: 'out of arithmetic', d: '出于算计／算过账（与 out of confusion 对照）' },
      { w: 'misread A as B', d: '把 A 误读为 B' },
      { w: 'priced accordingly', d: '据此定价' }
    ],
    notes: [
      '“not out of confusion but out of arithmetic” 用同结构介词短语对照，译“并非糊涂，而是算过账的”，口语化处理反而更贴近原文的干脆。',
      '结尾把外交行为比作“保险”，译文需保留 insurance / purchased / priced 的商业隐喻链条。'
    ]
  },
  {
    id: 'e20', section: 'Business', title: 'The economics of the second-hand everything',
    cn_title: '“万物二手”的经济学',
    paras: [
      { en: 'Resale used to be a market of last resort. It is becoming a channel of first choice, particularly for clothes, phones and furniture, as platforms strip out the friction that once made second-hand trading tiresome.', cn: '转售曾是走投无路的市场，如今正成为首选渠道——服装、手机和家具尤为明显；平台清除了那些曾让二手交易令人生厌的摩擦。' },
      { en: 'Brands initially resisted, fearing cannibalisation. Many now run resale operations themselves, having noticed two things: a robust second-hand price supports the new-goods price, and customers who can recoup part of their outlay buy more often, not less.', cn: '品牌起初抵制，担心自我蚕食。如今许多品牌亲自经营转售业务，因为它们发现了两点：坚挺的二手价格支撑着新品价格；而能收回部分支出的顾客，购买频次是上升而非下降的。' },
      { en: 'The environmental case is real but easily overstated. Extending a garment\'s life plainly beats landfill, yet resale also lowers the effective cost of consumption, which tends to increase it. Whether the net effect is green depends on behaviour that no platform reports.', cn: '环保理由确实成立，却容易被夸大。延长一件衣物的寿命显然优于填埋，但转售同时降低了消费的实际成本，而这往往会刺激消费。净效应是否环保，取决于那些没有任何平台会披露的行为。' }
    ],
    vocab: [
      { w: 'market of last resort', d: '走投无路时的市场（last resort 最后手段）' },
      { w: 'strip out the friction', d: '清除交易摩擦' },
      { w: 'cannibalisation', d: '（对自家产品的）蚕食' },
      { w: 'recoup one\'s outlay', d: '收回支出' },
      { w: 'easily overstated', d: '容易被夸大' },
      { w: 'net effect', d: '净效应' }
    ],
    notes: [
      '“buy more often, not less” 用逗号加否定补足，译“是上升而非下降的”，中文需补出动词避免悬空。',
      '末句 “behaviour that no platform reports” 暗指数据缺口，译“没有任何平台会披露的行为”，比“无平台报告的行为”更自然。'
    ]
  }
];
