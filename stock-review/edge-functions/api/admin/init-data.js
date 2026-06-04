/**
 * 管理员初始化数据接口
 * 创建模拟的市场数据、日复盘、周复盘、交易心得示例
 */
export default async function(context) {
  const { env } = context;

  const kv = env.STOCK_REVIEW_KV;

  // 模拟市场数据
  const marketData = {
    indices: [
      { name: '上证指数', code: '000001', value: 3356.28, change: 12.54, change_pct: 0.37 },
      { name: '深证成指', code: '399001', value: 10842.35, change: 45.67, change_pct: 0.42 },
      { name: '创业板指', code: '399006', value: 2156.78, change: -8.32, change_pct: -0.38 },
      { name: '科创50', code: '000688', value: 987.65, change: 15.43, change_pct: 1.59 }
    ],
    stats: {
      turnover: 892500000000,
      up_count: 2156,
      down_count: 2834,
      limit_up: 48,
      limit_down: 23,
      north_bound: 5240000000
    },
    top_gainers: [
      { name: '半导体', change_pct: 3.28 },
      { name: 'AI算力', change_pct: 2.95 },
      { name: '机器人', change_pct: 2.41 },
      { name: '汽车零部件', change_pct: 1.87 },
      { name: '军工', change_pct: 1.52 }
    ],
    top_losers: [
      { name: '房地产', change_pct: -2.15 },
      { name: '煤炭', change_pct: -1.83 },
      { name: '钢铁', change_pct: -1.56 },
      { name: '保险', change_pct: -1.34 },
      { name: '银行', change_pct: -1.12 }
    ]
  };

  await kv.put('market:today', JSON.stringify(marketData));

  // 模拟日复盘数据
  const dailyData = [
    { date: '2026-06-04', title: '2026-06-04 复盘：震荡蓄力，等待方向选择',
      content: '今日大盘小幅高开后窄幅震荡，沪指收涨0.37%，创业板指微跌0.38%。\n\n盘面特征：半导体、AI算力板块领涨，资金持续涌入科技方向。机器人概念午后走强，多只个股涨停。房地产、煤炭等传统板块承压。\n\n量能分析：成交额8925亿，较昨日略有放量，北向资金净流入52.4亿。市场情绪偏中性，涨跌比2156:2834。\n\n后市展望：指数在3350附近反复争夺，短期需关注量能变化。若能放量突破3380，则有望开启新一轮上行。重点关注科技板块的持续性。' },
    { date: '2026-06-03', title: '2026-06-03 复盘：缩量调整，科技股分化',
      content: '今日大盘小幅收跌，沪指跌0.21%，深成指跌0.35%。\n\n盘面：AI板块分化明显，算力方向回调，应用端走强。市场整体交投清淡。\n\n操作建议：控制仓位，等待确定性机会。' },
    { date: '2026-06-02', title: '2026-06-02 复盘：放量上攻，沪指重回3350',
      content: '今日市场放量上涨，沪指收涨1.23%，成交额突破万亿。\n\n领涨方向：半导体、消费电子、光伏。北向资金大幅净流入128亿。\n\n策略：短线可适度参与强势板块，中线继续看好科技主线。' },
    { date: '2026-05-30', title: '2026-05-30 复盘：月末收官，平稳过渡',
      content: '5月最后一个交易日，市场平稳收官。沪指月线收涨2.8%，整体呈现震荡上行格局。\n\n板块轮动加快，操作难度上升。建议关注6月政策窗口期。' },
    { date: '2026-05-28', title: '2026-05-28 复盘：探底回升，修复行情',
      content: '早盘低开后震荡走高，尾盘翻红。创业板指表现较强，收涨0.85%。\n\n热点：低空经济、固态电池概念活跃。' }
  ];

  for (const d of dailyData) {
    await kv.put('daily:' + d.date, JSON.stringify(d));
  }

  // 模拟周复盘数据
  const weeklyData = [
    { date: '2026-W23', title: '第23周复盘：震荡蓄力，科技主线延续',
      content: '本周（6.2-6.4）市场整体震荡偏强，沪指周涨0.89%。\n\n核心看点：半导体板块周涨幅4.2%，成为本周最强方向。AI应用端跟随海外催化走强。\n\n下周展望：关注3350-3400区间突破情况，若放量站稳3400可积极做多。' },
    { date: '2026-W22', title: '第22周复盘：月末平稳收官，蓄力待发',
      content: '本周（5.26-5.30）沪指周涨0.45%，成交量维持在8000-9000亿水平。市场风格偏向成长，创业板表现优于主板。' }
  ];

  for (const w of weeklyData) {
    await kv.put('weekly:' + w.date, JSON.stringify(w));
  }

  // 模拟交易心得
  const thoughtsData = [
    { id: '1', title: '关于止损的再思考', date: '2026-06-03',
      content: '入市多年，对止损有了更深的理解。\n\n止损不是简单的价格止损，而是逻辑止损。当你买入的理由不再成立时，无论盈亏都应该离场。\n\n最近一笔交易让我深刻体会到：容忍小亏损，是为了不错过大行情。关键在于区分"暂时回调"和"逻辑破坏"。' },
    { id: '2', title: '成交量是市场的温度计', date: '2026-06-01',
      content: '量在价先，这是我今年最大的感悟。\n\n每次市场转折之前，成交量都会提前给出信号。缩量筑底后放量突破，是最可靠的买入信号之一。\n\n建议把成交量放在技术分析的第一位，比任何指标都重要。' },
    { id: '3', title: '复盘的意义：从亏损中学习', date: '2026-05-28',
      content: '这个月的亏损让我重新认识到复盘的重要性。\n\n每一笔亏损交易背后都有值得总结的经验：是追高了？是没设止损？还是对基本面判断错误？\n\n坚持每日复盘，把错误记录下来，下次才能避免重蹈覆辙。' }
  ];

  for (const t of thoughtsData) {
    await kv.put('thoughts:' + t.id, JSON.stringify(t));
  }

  return json({ code: 0, msg: '初始化数据成功', data: {
    daily_count: dailyData.length,
    weekly_count: weeklyData.length,
    thoughts_count: thoughtsData.length
  }});
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
  });
}