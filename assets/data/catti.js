/* ==========================================================
   CATTI 内容库：三级 / 二级 / 一级 · 笔译 + 口译
   ========================================================== */
window.CATTI = {
  levels: [
    /* ================= 三级 ================= */
    {
      id: 'l3', name: '三级', title: 'CATTI 三级 · 入门实战',
      desc: '相当于外语专业本科毕业 + 1 年左右翻译实践，能完成一般性材料的笔译与陪同口译。',
      exam: [
        { k: '笔译综合能力', v: '120 分钟 / 100 分 · 词汇语法 60 题、阅读理解 30 题、完形填空 20 题' },
        { k: '笔译实务', v: '180 分钟 / 100 分 · 英译汉约 600 词、汉译英约 400 字，可带纸质词典' },
        { k: '口译综合能力', v: '60 分钟 / 100 分 · 判断、篇章理解、听力综述（约 500 词写 150 词英文综述）' },
        { k: '口译实务', v: '30 分钟 / 100 分 · 对话互译约 300 字词、英汉交替传译约 300 词、汉英交替传译约 200 字' }
      ],
      pass: '各科 60 分（百分制）合格，两科须同期通过；实务是绝大多数人的失分项。',
      vocab: [
        { en: 'high-quality development', cn: '高质量发展', tag: '政经' },
        { en: 'rural revitalization', cn: '乡村振兴', tag: '政经' },
        { en: 'poverty alleviation', cn: '扶贫、脱贫攻坚', tag: '政经' },
        { en: 'people-centered philosophy', cn: '以人民为中心的发展思想', tag: '政经' },
        { en: 'supply-side structural reform', cn: '供给侧结构性改革', tag: '经济' },
        { en: 'business environment', cn: '营商环境', tag: '经济' },
        { en: 'market entity', cn: '市场主体', tag: '经济' },
        { en: 'employment-first policy', cn: '就业优先政策', tag: '经济' },
        { en: 'tax and fee cuts', cn: '减税降费', tag: '经济' },
        { en: 'digital economy', cn: '数字经济', tag: '科技' },
        { en: 'artificial intelligence', cn: '人工智能', tag: '科技' },
        { en: 'new energy vehicle', cn: '新能源汽车', tag: '科技' },
        { en: 'carbon peaking and carbon neutrality', cn: '碳达峰、碳中和', tag: '环境' },
        { en: 'ecological conservation', cn: '生态保护', tag: '环境' },
        { en: 'green and low-carbon transition', cn: '绿色低碳转型', tag: '环境' },
        { en: 'air quality', cn: '空气质量', tag: '环境' },
        { en: 'public health emergency', cn: '突发公共卫生事件', tag: '社会' },
        { en: 'social security system', cn: '社会保障体系', tag: '社会' },
        { en: 'compulsory education', cn: '义务教育', tag: '社会' },
        { en: 'vocational training', cn: '职业培训', tag: '社会' },
        { en: 'aging population', cn: '人口老龄化', tag: '社会' },
        { en: 'urbanization', cn: '城镇化', tag: '社会' },
        { en: 'floating population', cn: '流动人口', tag: '社会' },
        { en: 'left-behind children', cn: '留守儿童', tag: '社会' },
        { en: 'infrastructure', cn: '基础设施', tag: '建设' },
        { en: 'high-speed railway network', cn: '高铁网络', tag: '建设' },
        { en: 'affordable housing', cn: '保障性住房', tag: '建设' },
        { en: 'intangible cultural heritage', cn: '非物质文化遗产', tag: '文化' },
        { en: 'cultural confidence', cn: '文化自信', tag: '文化' },
        { en: 'people-to-people exchanges', cn: '人文交流', tag: '外事' },
        { en: 'mutual benefit and win-win results', cn: '互利共赢', tag: '外事' },
        { en: 'the Belt and Road Initiative', cn: '“一带一路”倡议', tag: '外事' },
        { en: 'multilateralism', cn: '多边主义', tag: '外事' },
        { en: 'community with a shared future for mankind', cn: '人类命运共同体', tag: '外事' },
        { en: 'sustainable development goals (SDGs)', cn: '可持续发展目标', tag: '外事' },
        { en: 'free trade agreement', cn: '自由贸易协定', tag: '贸易' },
        { en: 'cross-border e-commerce', cn: '跨境电商', tag: '贸易' },
        { en: 'foreign direct investment (FDI)', cn: '外商直接投资', tag: '贸易' },
        { en: 'trade surplus / deficit', cn: '贸易顺差 / 逆差', tag: '贸易' },
        { en: 'customs clearance', cn: '通关、清关', tag: '贸易' },
        { en: 'per capita disposable income', cn: '人均可支配收入', tag: '统计' },
        { en: 'year-on-year growth', cn: '同比增长', tag: '统计' },
        { en: 'month-on-month growth', cn: '环比增长', tag: '统计' },
        { en: 'consumer price index (CPI)', cn: '居民消费价格指数', tag: '统计' },
        { en: 'unemployment rate', cn: '失业率', tag: '统计' },
        { en: 'gross domestic product (GDP)', cn: '国内生产总值', tag: '统计' },
        { en: 'law-based governance', cn: '依法治国', tag: '法治' },
        { en: 'intellectual property protection', cn: '知识产权保护', tag: '法治' },
        { en: 'anti-corruption campaign', cn: '反腐败斗争', tag: '法治' },
        { en: 'public participation', cn: '公众参与', tag: '法治' }
      ],
      trans: [
        {
          dir: 'E-C', src: 'The report notes that renewable energy accounted for more than half of the newly installed power capacity last year, a milestone that few analysts had predicted a decade ago.',
          ref: '报告指出，去年新增装机容量中，可再生能源占比过半。十年前，几乎没有分析人士预见到这一里程碑。',
          note: '① a milestone 同位语单独成句，避免定语过长；② few analysts had predicted 用「几乎没有……预见到」化否定为肯定语序，更合中文表达。'
        },
        {
          dir: 'E-C', src: 'Despite mounting external pressure, the economy has shown remarkable resilience, underpinned by robust domestic demand and a steady recovery in services.',
          ref: '尽管外部压力不断加大，但在内需强劲、服务业稳步复苏的支撑下，经济展现出显著韧性。',
          note: 'underpinned by 分词短语前置译为「在……的支撑下」，符合中文先因后果、先状语后主句的语序。'
        },
        {
          dir: 'E-C', src: 'Officials pledged to streamline approval procedures, cut red tape and create a level playing field for enterprises of all types of ownership.',
          ref: '官员承诺简化审批流程、减少繁文缛节，为各类所有制企业营造公平竞争环境。',
          note: 'red tape 固定译「繁文缛节/官僚程序」；level playing field 译「公平竞争环境」，不可直译为「平坦球场」。'
        },
        {
          dir: 'E-C', src: 'The city has been grappling with an acute shortage of affordable housing, which has driven many young professionals to the outskirts.',
          ref: '该市一直饱受保障性住房严重短缺之苦，许多年轻白领因此被迫迁往郊区。',
          note: 'grapple with 译「饱受……之苦/艰难应对」；which 引导的非限定性定语从句拆句处理，用「因此」衔接。'
        },
        {
          dir: 'E-C', src: 'Experts warn that without stronger safeguards, the rapid adoption of facial recognition could erode privacy in ways that are difficult to reverse.',
          ref: '专家警告说，如果缺乏更有力的保障措施，人脸识别技术的快速普及可能以难以逆转的方式侵蚀隐私。',
          note: 'without 引导的条件用「如果缺乏……」显化；erode 译「侵蚀/削弱」，不用「腐蚀」。'
        },
        {
          dir: 'E-C', src: 'Volunteers distributed relief supplies to thousands of residents who had been evacuated from low-lying areas before the typhoon made landfall.',
          ref: '台风登陆前，数千名居民已从低洼地区撤离，志愿者向他们发放了救灾物资。',
          note: '按时间顺序重排：先「台风登陆前撤离」，再「发放物资」；make landfall 是「登陆」的地道说法。'
        },
        {
          dir: 'C-E', src: '我们要坚持以人民为中心的发展思想，不断增强人民群众的获得感、幸福感、安全感。',
          ref: 'We should adhere to a people-centered philosophy of development and steadily enhance people\'s sense of fulfillment, happiness and security.',
          note: '三个「感」用 sense of + 名词并列，不必重复 sense；「不断」用 steadily/continuously，避免 always。'
        },
        {
          dir: 'C-E', src: '近年来，中国持续优化营商环境，市场主体活力明显增强。',
          ref: 'In recent years, China has continued to improve its business environment, and market entities have become notably more dynamic.',
          note: '「活力明显增强」转译为形容词比较级 more dynamic，避免 the vitality was obviously enhanced 这类中式英语。'
        },
        {
          dir: 'C-E', src: '中国愿同各国一道，推动构建人类命运共同体，让发展成果惠及更多国家和人民。',
          ref: 'China stands ready to work with all countries to build a community with a shared future for mankind, so that the benefits of development reach more countries and peoples.',
          note: '「愿同……一道」固定译 stand ready to work with；「惠及」用 benefit / reach，不用 let more people enjoy。'
        },
        {
          dir: 'C-E', src: '该地区森林覆盖率由二十年前的百分之三十一提高到百分之四十六。',
          ref: 'Forest coverage in the region has risen from 31 percent two decades ago to 46 percent.',
          note: '数字用阿拉伯数字；from A to B 结构中把时间状语 two decades ago 紧跟 A，避免歧义。'
        },
        {
          dir: 'C-E', src: '我们既要绿水青山，也要金山银山；绿水青山就是金山银山。',
          ref: 'We want both clear waters and lush mountains and mountains of gold and silver; indeed, clear waters and lush mountains are invaluable assets.',
          note: '后半句意译为 invaluable assets，避免英文读者不解；此为高频政治话语，务必记诵定译。'
        },
        {
          dir: 'C-E', src: '受台风影响，当地航班大面积延误，铁路部门临时停运多趟列车。',
          ref: 'The typhoon caused widespread flight delays in the area, and railway authorities suspended a number of train services.',
          note: '「受……影响」不必译 affected by，直接让 typhoon 做主语更简洁有力；「大面积」用 widespread。'
        }
      ],
      interp: [
        { type: '数字口译', src: '去年该省进出口总额达到 3.86 万亿元，同比增长 8.7%。', ref: 'The province\'s total imports and exports reached 3.86 trillion yuan last year, up 8.7 percent year on year.', note: '万亿 = trillion；亿 = 100 million；万 = 10 thousand。练习时用「点三杠四」笔记法。' },
        { type: '数字口译', src: 'The company posted revenue of 4.5 billion U.S. dollars, a 12 percent increase from a year earlier.', ref: '公司营业收入达 45 亿美元，比上年增长 12%。', note: '4.5 billion = 45 亿，注意英中数级换算：billion→十亿，故 4.5 billion = 45 亿。' },
        { type: '数字口译', src: '常住人口 1,373 万人，其中城镇人口占 76.4%。', ref: 'The permanent resident population stands at 13.73 million, of whom 76.4 percent live in urban areas.', note: '1,373 万 = 13.73 million；口译时先写数字后写单位，切忌边听边换算。' },
        { type: '常用表达', src: '首先，请允许我代表主办方，对各位嘉宾的到来表示热烈欢迎。', ref: 'First of all, on behalf of the host, may I extend a warm welcome to all the distinguished guests.', note: '礼宾套话必须做到条件反射：on behalf of / extend a warm welcome to / distinguished guests。' },
        { type: '常用表达', src: '预祝本次论坛圆满成功！', ref: 'I wish the forum a complete success!', note: '不要说 wish the forum successfully；固定搭配 wish sth a complete/great success。' },
        { type: '常用表达', src: 'It gives me great pleasure to be here today and share with you some of our latest findings.', ref: '今天能来到这里，与各位分享我们的最新研究成果，我深感荣幸。', note: '英译中时把 It gives me great pleasure 处理为句末的「深感荣幸」，符合中文尾重习惯。' },
        { type: '对话互译', src: '（中方）我们希望双方能在清洁能源领域开展更多务实合作。', ref: 'We hope the two sides can carry out more practical cooperation in the field of clean energy.', note: '「务实合作」= practical/pragmatic cooperation，三级对话互译高频。' },
        { type: '对话互译', src: '(Foreign guest) Could you elaborate on the incentives available to foreign investors?', ref: '您能否详细介绍一下面向外国投资者的优惠政策？', note: 'elaborate on = 详细说明；incentives 在投资语境中译「优惠政策/激励措施」。' },
        { type: '影子跟读', src: 'Climate change is no longer a distant threat. It is here, and it is reshaping the way we live, work and plan for the future.', ref: '气候变化不再是遥远的威胁。它已然来临，正在重塑我们生活、工作和规划未来的方式。', note: '影子跟读要求落后音频 2-3 个词，保持语流不断；每天 15 分钟即可。' },
        { type: '影子跟读', src: '各位来宾，女士们、先生们，欢迎参加本届国际服务贸易交易会。', ref: 'Distinguished guests, ladies and gentlemen, welcome to this year\'s China International Fair for Trade in Services.', note: '中文影子跟读同样重要，可锻炼语音清晰度与断句节奏。' }
      ],
      tips: [
        '实务失分点排名：漏译 > 错译专有名词 > 中式英语 > 语法低错。交卷前预留 15 分钟通读检查。',
        '汉译英不要追求辞藻，先保证「意思准、语法对、逻辑清」，再谈文采。',
        '英译汉切忌「翻译腔」：长定语拆句、被动化主动、代词还原为具体名词。',
        '备考书目：《英语笔译实务 3 级》官方教材、《中式英语之鉴》、《政府工作报告》双语版。',
        '口译综合的听力综述是拉分项，练习时严格控制在 150 词以内，先列 3 个要点再成文。'
      ]
    },

    /* ================= 二级 ================= */
    {
      id: 'l2', name: '二级', title: 'CATTI 二级 · 职业门槛',
      desc: '相当于翻译专业硕士毕业 + 3 年左右实践，能胜任较高难度的笔译与正式场合交替传译，是职业译员的通行证。',
      exam: [
        { k: '笔译综合能力', v: '120 分钟 / 100 分 · 词汇语法 60 题、阅读 30 题、完形 20 题，难度接近专八' },
        { k: '笔译实务', v: '180 分钟 / 100 分 · 英译汉约 900 词（2 篇）、汉译英约 600 字（2 篇）' },
        { k: '口译综合能力', v: '60 分钟 / 100 分 · 判断、短句选项、篇章理解、听力综述（约 600 词写 200 词）' },
        { k: '口译实务（交替传译）', v: '60 分钟 / 100 分 · 英汉交传约 600 词、汉英交传约 400 字' }
      ],
      pass: '两科同期 60 分合格。二级实务通过率长期在 10%–20% 区间，需要成体系的训练。',
      vocab: [
        { en: 'monetary policy tools', cn: '货币政策工具', tag: '金融' },
        { en: 'required reserve ratio (RRR)', cn: '存款准备金率', tag: '金融' },
        { en: 'loan prime rate (LPR)', cn: '贷款市场报价利率', tag: '金融' },
        { en: 'systemic financial risk', cn: '系统性金融风险', tag: '金融' },
        { en: 'shadow banking', cn: '影子银行', tag: '金融' },
        { en: 'non-performing loan ratio', cn: '不良贷款率', tag: '金融' },
        { en: 'quantitative easing', cn: '量化宽松', tag: '金融' },
        { en: 'sovereign credit rating', cn: '主权信用评级', tag: '金融' },
        { en: 'capital adequacy ratio', cn: '资本充足率', tag: '金融' },
        { en: 'macroprudential regulation', cn: '宏观审慎监管', tag: '金融' },
        { en: 'industrial chain and supply chain resilience', cn: '产业链供应链韧性', tag: '产业' },
        { en: 'bottleneck technologies', cn: '“卡脖子”技术', tag: '产业' },
        { en: 'new quality productive forces', cn: '新质生产力', tag: '产业' },
        { en: 'specialized and sophisticated SMEs', cn: '专精特新中小企业', tag: '产业' },
        { en: 'intelligent manufacturing', cn: '智能制造', tag: '产业' },
        { en: 'integrated circuit', cn: '集成电路', tag: '科技' },
        { en: 'quantum computing', cn: '量子计算', tag: '科技' },
        { en: 'large language model', cn: '大语言模型', tag: '科技' },
        { en: 'data as a factor of production', cn: '数据要素', tag: '科技' },
        { en: 'algorithmic governance', cn: '算法治理', tag: '科技' },
        { en: 'gene editing', cn: '基因编辑', tag: '科技' },
        { en: 'commercial spaceflight', cn: '商业航天', tag: '科技' },
        { en: 'dual carbon goals', cn: '双碳目标', tag: '环境' },
        { en: 'carbon trading market', cn: '碳交易市场', tag: '环境' },
        { en: 'biodiversity conservation', cn: '生物多样性保护', tag: '环境' },
        { en: 'ecological compensation mechanism', cn: '生态补偿机制', tag: '环境' },
        { en: 'circular economy', cn: '循环经济', tag: '环境' },
        { en: 'strategic stability', cn: '战略稳定', tag: '外交' },
        { en: 'non-interference in internal affairs', cn: '不干涉内政', tag: '外交' },
        { en: 'unilateral sanctions', cn: '单边制裁', tag: '外交' },
        { en: 'global governance system reform', cn: '全球治理体系改革', tag: '外交' },
        { en: 'consultation, contribution and shared benefits', cn: '共商共建共享', tag: '外交' },
        { en: 'people-to-people bond', cn: '民心相通', tag: '外交' },
        { en: 'rules-based international order', cn: '基于规则的国际秩序', tag: '外交' },
        { en: 'due diligence', cn: '尽职调查', tag: '法律' },
        { en: 'force majeure', cn: '不可抗力', tag: '法律' },
        { en: 'arbitration clause', cn: '仲裁条款', tag: '法律' },
        { en: 'burden of proof', cn: '举证责任', tag: '法律' },
        { en: 'antitrust investigation', cn: '反垄断调查', tag: '法律' },
        { en: 'personal information protection', cn: '个人信息保护', tag: '法律' },
        { en: 'universal health coverage', cn: '全民健康覆盖', tag: '民生' },
        { en: 'hierarchical diagnosis and treatment', cn: '分级诊疗', tag: '民生' },
        { en: 'centralized drug procurement', cn: '药品集中采购', tag: '民生' },
        { en: 'multi-tiered social security', cn: '多层次社会保障', tag: '民生' },
        { en: 'inclusive childcare services', cn: '普惠托育服务', tag: '民生' },
        { en: 'common prosperity', cn: '共同富裕', tag: '民生' },
        { en: 'income distribution', cn: '收入分配', tag: '民生' },
        { en: 'urban-rural integration', cn: '城乡融合发展', tag: '民生' },
        { en: 'headwinds and tailwinds', cn: '逆风与顺风（不利与有利因素）', tag: '媒体' },
        { en: 'a double-edged sword', cn: '双刃剑', tag: '媒体' }
      ],
      trans: [
        {
          dir: 'E-C', src: 'For all the talk of decoupling, the two economies remain deeply entangled: supply chains built over three decades cannot be unpicked in three years.',
          ref: '尽管“脱钩”之声不绝于耳，两国经济依然深度交织——历经三十年构建的供应链，绝非三年之内所能拆解。',
          note: 'For all the talk of… = 尽管……的说法甚嚣尘上；unpick 译「拆解」；冒号后用破折号处理，保留原文的论断语气。'
        },
        {
          dir: 'E-C', src: 'What began as a niche experiment among a handful of start-ups has hardened into an industry standard, with regulators scrambling to catch up.',
          ref: '当初不过是少数初创企业的小众试验，如今已固化为行业标准，监管机构则疲于追赶。',
          note: 'What began as… has hardened into… 是《经济学人》高频句式，译作「当初……如今……」；scramble to 译「疲于/手忙脚乱地」。'
        },
        {
          dir: 'E-C', src: 'The central bank walks a tightrope: tighten too fast and growth stalls; move too slowly and inflation expectations become unanchored.',
          ref: '央行如履薄冰：收紧过快，增长即刻失速；行动过缓，通胀预期便会脱锚。',
          note: 'walk a tightrope 译「如履薄冰/走钢丝」；unanchored 是货币政策术语，定译「脱锚」。祈使句结构译为紧凑的条件小句。'
        },
        {
          dir: 'E-C', src: 'Critics counter that the subsidies amount to little more than a transfer from taxpayers to shareholders, with scant evidence of additional investment.',
          ref: '批评者反驳称，这些补贴无异于把纳税人的钱转移给股东，几乎没有证据表明它带来了额外投资。',
          note: 'amount to little more than 译「无异于/不过是」；scant evidence 译「几乎没有证据」，勿译「稀少的证据」。'
        },
        {
          dir: 'E-C', src: 'Having weathered a punishing property downturn, local governments are now under pressure to find new revenue streams that do not rest on land sales.',
          ref: '在挺过房地产的严重下行之后，地方政府正面临压力，亟需寻找不依赖土地出让的新财源。',
          note: 'weather 作动词译「挺过/经受住」；punishing 译「严重的/沉重的」；revenue streams 译「财源/收入来源」。'
        },
        {
          dir: 'C-E', src: '我们必须统筹发展和安全，增强忧患意识，做到居安思危，有效防范化解各类风险挑战。',
          ref: 'We must pursue development and safeguard security in a coordinated way, stay alert to potential dangers, be prepared for adversity in times of peace, and effectively prevent and defuse risks and challenges of all kinds.',
          note: '四字格连用时避免逐字硬译；「居安思危」译 be prepared for adversity in times of peace；「防范化解」= prevent and defuse。'
        },
        {
          dir: 'C-E', src: '要坚持创新在现代化建设全局中的核心地位，把科技自立自强作为国家发展的战略支撑。',
          ref: 'We should give innovation a central place in China\'s modernization drive and make greater self-reliance and strength in science and technology a strategic underpinning for national development.',
          note: '「核心地位」用 give sth a central place 动宾结构，比 the core position 更地道；「战略支撑」= strategic underpinning/support。'
        },
        {
          dir: 'C-E', src: '当前，世界百年未有之大变局加速演进，国际形势中不稳定不确定因素明显增多。',
          ref: 'Changes unseen in a century are unfolding at a faster pace, and destabilizing factors and uncertainties in the international landscape are markedly on the rise.',
          note: '「百年未有之大变局」定译 changes unseen in a century；「不稳定不确定因素」拆为 destabilizing factors and uncertainties，避免堆砌形容词。'
        },
        {
          dir: 'C-E', src: '中国的发展绝不以牺牲别国利益为代价，我们从不做损人利己、以邻为壑的事情。',
          ref: 'China\'s development never comes at the expense of other countries\' interests. We never seek to benefit ourselves at others\' expense or shift troubles onto our neighbours.',
          note: '「以邻为壑」译 shift troubles onto one\'s neighbours（源自 beggar-thy-neighbour）；「损人利己」= benefit oneself at others\' expense。'
        },
        {
          dir: 'C-E', src: '要健全多层次社会保障体系，扩大失业、工伤、生育保险覆盖面，兜牢民生底线。',
          ref: 'We should improve the multi-tiered social security system, extend the coverage of unemployment, work-injury and maternity insurance, and ensure that basic living needs are met.',
          note: '「兜牢民生底线」意译为 ensure that basic living needs are met；三种保险并列时只保留最后一个 insurance。'
        },
        {
          dir: 'C-E', src: '这项政策落地以来，企业融资成本明显下降，中小微企业获得感显著增强。',
          ref: 'Since the policy took effect, financing costs for businesses have fallen markedly, and micro, small and medium-sized enterprises have felt the benefits far more keenly.',
          note: '「落地」= take effect / be implemented；「获得感增强」转译为 feel the benefits more keenly，避免直译 sense of gain。'
        },
        {
          dir: 'C-E', src: '面对复杂严峻的外部环境，我国经济顶住压力持续恢复，展现出强大韧性和巨大潜力。',
          ref: 'In the face of a complex and challenging external environment, China\'s economy has withstood the pressure and continued to recover, demonstrating great resilience and enormous potential.',
          note: '「顶住压力」= withstand the pressure；注意 severe 用于外部环境略重，challenging 更贴近正式文本口吻。'
        }
      ],
      interp: [
        { type: '数字口译', src: '全年国内生产总值超过 126 万亿元，比上年增长 5.2%，对世界经济增长的贡献率超过 30%。', ref: 'GDP for the year exceeded 126 trillion yuan, up 5.2 percent over the previous year, contributing more than 30 percent to global growth.', note: '交传中数字必记，笔记用「126T ↑5.2 / 世界30%↑」，符号化以争取时间。' },
        { type: '数字口译', src: 'Global trade volumes are projected to expand by 3.3 percent next year, compared with 0.8 percent this year, according to the latest estimates.', ref: '据最新预测，全球贸易量明年将增长 3.3%，而今年仅为 0.8%。', note: 'compared with 处理为「而……」，形成中文的对比结构，比「与……相比」更自然。' },
        { type: '数字口译', src: '该项目总投资 85.6 亿元，建成后年产能可达 120 万吨，可创造就业岗位约 4,500 个。', ref: 'With a total investment of 8.56 billion yuan, the project will have an annual capacity of 1.2 million tonnes once completed and is expected to create some 4,500 jobs.', note: '三个数字集中出现时，用 with 结构合并信息，减轻听众记忆负担。' },
        { type: '交传段落', src: '女士们、先生们，过去十年，我们见证了全球产业格局的深刻调整。新兴市场国家的制造业增加值占比稳步上升，全球价值链正在从“效率优先”转向“韧性优先”。', ref: 'Ladies and gentlemen, over the past decade we have witnessed profound shifts in the global industrial landscape. Emerging markets have steadily increased their share of manufacturing value added, and global value chains are shifting from an emphasis on efficiency to one on resilience.', note: '「效率优先转向韧性优先」用 from an emphasis on… to one on… 结构，避免重复 priority。' },
        { type: '交传段落', src: 'Let me be clear: our commitment to open markets is not a favour to anyone. It is, first and foremost, in our own interest, and we intend to keep it that way.', ref: '我想明确一点：我们对开放市场的承诺，并非施惠于谁。它首先符合我们自身利益，我们也将坚持这一立场。', note: 'Let me be clear 译「我想明确一点」；not a favour to anyone 译「并非施惠于谁」，保留发言人的强硬语气。' },
        { type: '成语典故', src: '合作共赢是大势所趋，任何逆流而动的做法都不得人心。', ref: 'Win-win cooperation is the prevailing trend, and any attempt to swim against the tide will find little support.', note: '「大势所趋」= the prevailing trend；「逆流而动」= swim against the tide；「不得人心」= find little support。' },
        { type: '成语典故', src: '我们要登高望远，不能只盯着眼前的一亩三分地。', ref: 'We need to take a long and broad view, rather than fixating on our own small patch of ground.', note: '「一亩三分地」为口语化比喻，译 one\'s own small patch/backyard，切忌译为 one mu and three fen。' },
        { type: '常用表达', src: '借此机会，我谨向长期致力于中外友好事业的各界人士表示崇高敬意。', ref: 'I would like to take this opportunity to pay high tribute to people from all walks of life who have long devoted themselves to friendship between China and other countries.', note: 'pay high tribute to = 表示崇高敬意；all walks of life = 各界人士。' },
        { type: '常用表达', src: 'I am afraid I will have to disagree on that point, though I take the speaker\'s broader concern very seriously.', ref: '恕我不能赞同这一点，不过发言人所表达的更深层关切，我十分重视。', note: '外交场合的委婉反对，中文用「恕我不能赞同」对应 I am afraid I will have to disagree。' },
        { type: '笔记符号', src: '常用交传笔记符号体系', ref: '↑上升/增长　↓下降　→导致/出口　←来自/进口　∵因为　∴所以　√同意/正确　×反对/错误　□国家　○会议　∆代表/领导人　⊂包括　# 数字　! 强调　? 疑问/问题', note: '符号贵精不贵多，一套符号固定用三个月不换，形成肌肉记忆。' }
      ],
      tips: [
        '二级笔译实务时间极紧：英译汉 900 词 + 汉译英 600 字，务必按 40/50 分钟分配并留 10 分钟检查。',
        '汉译英训练法：先自译，再对照官方译文逐句标注差异类型（用词/结构/信息），每周复盘一次。',
        '交传笔记是「提示」不是「速记」，脑记七成、笔记三成；逻辑连接词与数字必须落笔。',
        '推荐语料：《政府工作报告》《习近平谈治国理政》双语、经济学人、外交部例行记者会双语实录。',
        '每天固定 30 分钟视译（sight translation），是打通笔译与口译的关键练习。'
      ]
    },

    /* ================= 一级 ================= */
    {
      id: 'l1', name: '一级', title: 'CATTI 一级 · 资深译审',
      desc: '面向具备丰富翻译实践经验的资深译员，考核审定稿能力与高难度同传/交传水平，报考需已取得二级证书。',
      exam: [
        { k: '笔译实务（一级）', v: '180 分钟 / 100 分 · 翻译（英译汉 600 词 + 汉译英 400 字）+ 审定稿（英译汉 600 词、汉译英 400 字各一篇）' },
        { k: '口译实务（交替传译）', v: '90 分钟 / 100 分 · 英汉交传约 1200 词、汉英交传约 1000 字，题材涉及外交、经贸、科技、文化' },
        { k: '同声传译（另设）', v: '60 分钟 / 100 分 · 无稿同传、带稿同传，考察在真实语速下的信息完整度与表达流畅度' },
        { k: '评审要求', v: '通过考试后还需提交业绩材料参加评审，方可取得副高职称资格' }
      ],
      pass: '一级不设综合能力科目，只考实务；审定稿部分要求精准识别并修正误译、漏译与文体不当。',
      vocab: [
        { en: 'a paradigm shift', cn: '范式转变', tag: '思辨' },
        { en: 'zero-sum mentality', cn: '零和思维', tag: '思辨' },
        { en: 'a false dichotomy', cn: '非此即彼的伪命题', tag: '思辨' },
        { en: 'counterfactual reasoning', cn: '反事实推演', tag: '思辨' },
        { en: 'path dependence', cn: '路径依赖', tag: '思辨' },
        { en: 'moral hazard', cn: '道德风险', tag: '思辨' },
        { en: 'the tragedy of the commons', cn: '公地悲剧', tag: '思辨' },
        { en: 'diminishing marginal returns', cn: '边际收益递减', tag: '思辨' },
        { en: 'institutional inertia', cn: '制度惯性', tag: '治理' },
        { en: 'regulatory arbitrage', cn: '监管套利', tag: '治理' },
        { en: 'checks and balances', cn: '制衡机制', tag: '治理' },
        { en: 'policy coherence', cn: '政策协同性', tag: '治理' },
        { en: 'whole-process people\'s democracy', cn: '全过程人民民主', tag: '治理' },
        { en: 'modernization of the governance system and capacity', cn: '治理体系和治理能力现代化', tag: '治理' },
        { en: 'a fait accompli', cn: '既成事实', tag: '外交' },
        { en: 'strategic ambiguity', cn: '战略模糊', tag: '外交' },
        { en: 'de-risking rather than decoupling', cn: '去风险而非脱钩', tag: '外交' },
        { en: 'hegemonism and power politics', cn: '霸权主义与强权政治', tag: '外交' },
        { en: 'the Global Development Initiative', cn: '全球发展倡议', tag: '外交' },
        { en: 'a new type of international relations', cn: '新型国际关系', tag: '外交' },
        { en: 'to break the ice / build bridges', cn: '打破坚冰 / 架设桥梁', tag: '外交' },
        { en: 'a watershed moment', cn: '分水岭时刻', tag: '媒体' },
        { en: 'to be cautiously optimistic', cn: '持谨慎乐观态度', tag: '媒体' },
        { en: 'the elephant in the room', cn: '房间里的大象（人尽皆知却避而不谈之事）', tag: '媒体' },
        { en: 'to kick the can down the road', cn: '拖延问题、击鼓传花', tag: '媒体' },
        { en: 'a race to the bottom', cn: '逐底竞争', tag: '媒体' },
        { en: 'low-hanging fruit', cn: '唾手可得的成果', tag: '媒体' },
        { en: 'to move the goalposts', cn: '随意变更标准', tag: '媒体' },
        { en: 'to square the circle', cn: '化解两难、办到看似不可能之事', tag: '媒体' },
        { en: 'a Pyrrhic victory', cn: '惨胜、得不偿失的胜利', tag: '文史' },
        { en: 'the Achilles\' heel', cn: '致命弱点', tag: '文史' },
        { en: 'a Faustian bargain', cn: '与魔鬼的交易、饮鸩止渴', tag: '文史' },
        { en: 'harmony in diversity', cn: '和而不同', tag: '文史' },
        { en: 'to seek common ground while reserving differences', cn: '求同存异', tag: '文史' },
        { en: 'as vast as the ocean that admits all rivers', cn: '海纳百川', tag: '文史' },
        { en: 'a journey of a thousand miles begins with a single step', cn: '千里之行，始于足下', tag: '文史' },
        { en: 'to draw on collective wisdom', cn: '集思广益', tag: '文史' },
        { en: 'watertight compartmentalization', cn: '条块分割、各自为政', tag: '审校' },
        { en: 'register mismatch', cn: '语域错配（文体不当）', tag: '审校' },
        { en: 'false friend', cn: '假朋友（形近义异词）', tag: '审校' }
      ],
      trans: [
        {
          dir: 'E-C', src: 'It is tempting to read the latest data as vindication. That would be premature. The rebound owes as much to a favourable base effect as to any genuine revival of demand, and the months ahead will test whether the recovery has legs.',
          ref: '人们很容易把最新数据视为某种佐证，但这样的判断为时尚早。此番反弹既得益于有利的基数效应，也源于需求的真正回暖——两者贡献相当；而复苏是否行稳致远，还要看未来几个月的表现。',
          note: '① It is tempting to… 译「人们很容易……」；② owes as much to A as to B 表示两者并重，中文加「两者贡献相当」显化；③ have legs = 具有持续性，意译「行稳致远」。'
        },
        {
          dir: 'E-C', src: 'The agreement, for all its fanfare, is long on aspiration and short on enforcement. Signatories have committed to targets that are neither binding nor independently verified, leaving compliance to the vagaries of domestic politics.',
          ref: '这份协议虽经大张旗鼓的宣传，却是愿景有余、执行不足。签署方所承诺的目标既无约束力，也不接受独立核查，履约与否终究取决于各国国内政治的起伏。',
          note: 'long on A and short on B 是典型对仗，译「A 有余、B 不足」；vagaries 译「起伏/无常」；注意保留原文的克制讥诮。'
        },
        {
          dir: 'E-C', src: 'Whether this amounts to a genuine turning point or merely a pause in a longer decline is a question on which reasonable people disagree—and on which the evidence, for now, is stubbornly inconclusive.',
          ref: '此举究竟是真正的转折点，还是漫长衰退中的短暂喘息，明智之人尚且见仁见智；而就目前而言，现有证据依然莫衷一是。',
          note: 'reasonable people disagree 译「明智之人见仁见智」；stubbornly inconclusive 译「依然莫衷一是」，用四字格提升文气但不添义。'
        },
        {
          dir: 'C-E', src: '中华文明自古就以开放包容闻名于世，在同其他文明的交流互鉴中不断焕发新的生命力。',
          ref: 'Chinese civilization has long been known for its openness and inclusiveness, drawing fresh vitality from exchanges and mutual learning with other civilizations.',
          note: '「交流互鉴」定译 exchanges and mutual learning；「焕发新的生命力」用分词短语 drawing fresh vitality from 后置，避免两个主句松散并列。'
        },
        {
          dir: 'C-E', src: '我们主张，国家不分大小、强弱、贫富一律平等，各国的事情应由各国人民商量着办。',
          ref: 'We maintain that all countries, regardless of size, strength or wealth, are equal, and that the affairs of each country should be handled through consultation by its own people.',
          note: '「不分大小、强弱、贫富」压缩为 regardless of size, strength or wealth；「商量着办」译 handled through consultation，口语化政治话语的正式化处理。'
        },
        {
          dir: 'C-E', src: '面对全球性挑战，任何国家都不可能独善其身，唯有同舟共济、守望相助，才能共渡难关。',
          ref: 'In the face of global challenges, no country can insulate itself. Only by pulling together in the same boat and standing by one another can we weather the storm.',
          note: '「独善其身」译 insulate itself；「同舟共济」pull together in the same boat；「共渡难关」weather the storm。倒装 Only by… can we… 增强气势。'
        },
        {
          dir: '审定稿', src: '【原文】The committee has been mandated to review the implementation of the framework and to report its findings by the end of the fiscal year.\n【初译】委员会被授权审查框架的实施并且报告它的发现在财政年度结束之前。',
          ref: '【改译】委员会受权对框架落实情况进行审查，并须在本财年结束前提交审查结论。\n【修改理由】① 被动语态「被授权」改为「受权」，符合公文语域；② 状语后置的英式语序回归中文常序；③ its findings 译「审查结论」而非「它的发现」，消除代词冗余与搭配不当。',
          note: '一级审定稿评分点：语序、语域、术语一致性、代词还原、逻辑连接。改动须「必要且最小」。'
        },
        {
          dir: '审定稿', src: '【原文】我们要深化改革开放，激发市场活力和社会创造力。\n【初译】We should deepen the reform and opening up, stimulate the market vitality and the social creativity.',
          ref: '【改译】We should deepen reform and opening up to unleash market vitality and social creativity.\n【修改理由】① reform and opening up 为不可数专有概念，删去冠词 the；② 两个动作为目的关系，用不定式 to unleash 替代并列，逻辑更清晰；③ unleash 比 stimulate 更贴合「激发」的力度；④ 删去多余的 the。',
          note: '审定稿不是重译：保留初译可用部分，只改错误与不地道之处，并逐条说明理由。'
        }
      ],
      interp: [
        { type: '同传技巧', src: 'The point I want to make, and I think this is crucial, is that no single country, however powerful, can address these challenges alone.', ref: '我想强调的一点——我认为这至关重要——是任何一个国家，无论多么强大，都无法独自应对这些挑战。', note: '同传顺句驱动：插入语用破折号原位处理，不回头重组，保证与讲者同步。' },
        { type: '同传技巧', src: '我们将继续扩大高水平对外开放，稳步扩大规则、规制、管理、标准等制度型开放。', ref: 'We will continue to expand high-standard opening up and steadily advance institutional opening up with respect to rules, regulations, management and standards.', note: '四项并列一次性说出，同传需预判后接 institutional opening up，运用「等待与预测」策略。' },
        { type: '同传技巧', src: 'Now, let me turn to the second point, which — and I want to be very careful here — touches on a matter still under negotiation.', ref: '下面谈第二点。这一点——请允许我审慎措辞——涉及仍在谈判中的事项。', note: '英文长插入语可切分为两个中文短句，降低听众认知负荷，这是同传的「断句」核心技能。' },
        { type: '高难交传', src: '各位朋友，回望来路，我们走过的每一步都殊为不易；展望前程，我们面临的每一道关口都需要拿出勇气与智慧。历史不会等待犹豫者、观望者、懈怠者、畏难者。', ref: 'Friends, looking back, every step we have taken has been hard-won; looking ahead, every hurdle before us will demand courage and wisdom. History does not wait for those who hesitate, look on, slacken their efforts or shrink from difficulty.', note: '排比四字格用四个并列动词短语对应，节奏与信息量兼顾；hard-won 精准对应「殊为不易」。' },
        { type: '高难交传', src: 'If I may offer a word of caution: the temptation to declare victory prematurely is, historically speaking, the most reliable predictor of subsequent failure.', ref: '容我提醒一句：从历史经验看，过早宣布胜利的冲动，恰恰是日后失败最可靠的先兆。', note: 'If I may offer a word of caution 译「容我提醒一句」；把 historically speaking 提前作状语，中文更顺。' },
        { type: '高难交传', src: '中国式现代化是人口规模巨大的现代化，是全体人民共同富裕的现代化，是物质文明和精神文明相协调的现代化。', ref: 'Chinese modernization is the modernization of a huge population, of common prosperity for all, and of material and cultural-ethical advancement in tandem.', note: '三个「的现代化」用 of 结构并列省略重复，避免三次重复 modernization 造成的冗赘。' },
        { type: '成语典故', src: '前事不忘，后事之师。', ref: 'Past experience, if not forgotten, is a guide for the future.', note: '典出《战国策》，此为通行定译，同传中应做到脱口而出。' },
        { type: '成语典故', src: '志合者，不以山海为远。', ref: 'Nothing, not even mountains and seas, can separate people with shared goals.', note: '外交高频引语，注意译文的否定前置结构，气势更足。' },
        { type: '笔记进阶', src: '一级交传的段落长度可达 2-3 分钟', ref: '策略：① 纵向阶梯式记录，一行一意群；② 用竖线分隔逻辑段；③ 数字、专名、列举项必记；④ 结尾画横线防止漏译；⑤ 笔记语言中英混杂无妨，以最快为准。', note: '一级考试段落长、信息密，笔记的可读性比完整性更重要。' },
        { type: '应试提醒', src: '一级口译常见扣分点', ref: '① 语气词过多（嗯、呃）；② 自我修正频繁；③ 数字错译；④ 专名不熟（国际组织、人名地名）；⑤ 中文表达欧化。建议每次练习录音回听，逐条打勾。', note: '录音回听是提升最快的方法，痛苦但有效。' }
      ],
      tips: [
        '一级审定稿：先通读全文判断文体与受众，再逐句核对信息完整性，最后打磨语言。改动要有理有据。',
        '同传训练路径：影子跟读 → 有稿视译 → 慢速无稿同传 → 常速同传，每阶段至少稳定两周再进阶。',
        '建立个人语料库：把每次练习中卡壳的表达分类归档（外交/经贸/科技/文化），每周复习。',
        '一级考察的是「稳定输出」，宁可牺牲部分修辞，也要保证信息完整、语流不断。',
        '业绩材料尽早积累：正式出版译著、重要会议交传/同传记录、行业期刊译文均可作为评审依据。'
      ]
    }
  ],

  /* 每日任务模板 */
  dailyTasks: [
    { id: 't1', text: '背诵 10 个热词并默写', min: 15 },
    { id: 't2', text: '完成 1 组句子精译（英汉 + 汉英）', min: 25 },
    { id: 't3', text: '口译影子跟读 / 视译 15 分钟', min: 15 },
    { id: 't4', text: '精读 1 篇经济学人并做双语笔记', min: 30 }
  ]
};
