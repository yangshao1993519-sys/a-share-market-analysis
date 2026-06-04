/**
 * 日复盘列表（支持无 KV 降级）
 */
const DEMO_DATA = [
  { date: '2026-06-03', title: '三连阳修复 · 缠论底分型初成 · 光通信爆发', preview: '指数三连阳延续修复，缠论视角日线底分型初成。成交量3.13万亿放量+3400亿...' },
  { date: '2026-06-02', title: '深V反弹 · 仅28%上涨 · 通信板块爆发', preview: '指数深V反弹掩盖真相，创业板指+2.66%领涨全场，但仅28%个股上涨...' },
  { date: '2026-06-01', title: '指数弱个股强 · 科创50暴跌5% · 高低切换', preview: '上证指数4057.74(-0.27%)，科创50暴跌5%，北向资金逆势净流入32.7亿...' }
];

export default async function(context) {
  const { env } = context;
  const kv = env.STOCK_REVIEW_KV;
  let items = [];

  try {
    if (kv) {
      const allKeys = await kv.list({ prefix: 'daily:' });
      if (allKeys && allKeys.keys) {
        for (const k of allKeys.keys) {
          const raw = await kv.get(k.name);
          if (raw) {
            const item = JSON.parse(raw);
            items.push({ date: item.date || k.name.replace('daily:', ''), title: item.title || '', preview: (item.content || '').substring(0, 150) });
          }
        }
      }
    }
  } catch(e) { /* KV not available */ }

  if (items.length === 0) {
    items = DEMO_DATA;
  }

  items.sort((a, b) => b.date.localeCompare(a.date));

  const user = env.user;
  if (!user) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const cutoff = sevenDaysAgo.toISOString().split('T')[0];
    items = items.filter(i => i.date >= cutoff);
  }

  return json({ code: 0, data: { list: items } });
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
  });
}
