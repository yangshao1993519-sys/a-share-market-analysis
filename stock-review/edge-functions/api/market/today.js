/**
 * 返回当日市场指数数据（支持无 KV 降级）
 */
const DEMO_DATA = {
  indices: [
    { name: '上证指数', code: '000001', price: '4083.97', change: '+0.22%', color: 'up' },
    { name: '深证成指', code: '399001', price: '15704.71', change: '+0.73%', color: 'up' },
    { name: '创业板指', code: '399006', price: '4122.99', change: '+1.65%', color: 'up' },
    { name: '科创50', code: '000688', price: '1726.18', change: '+2.11%', color: 'up' },
    { name: '北证50', code: '899050', price: '1246.24', change: '-0.48%', color: 'down' }
  ],
  stats: {
    turnover: '3.13万亿',
    upCount: 1713,
    downCount: 3727,
    limitUp: 81,
    limitDown: 27,
    northFlow: '净流入超50亿'
  },
  topSectors: [
    { name: '半导体', change: '+2.37%', flow: '+80.43亿' },
    { name: '通信设备', change: '+2.21%', flow: '+60.76亿' },
    { name: '小金属', change: '+2.78%', flow: '+24.58亿' }
  ]
};

export default async function(context) {
  const { env } = context;
  const kv = env.STOCK_REVIEW_KV;

  try {
    if (kv) {
      const raw = await kv.get('market:today');
      if (raw) {
        return json({ code: 0, data: JSON.parse(raw) });
      }
    }
  } catch(e) { /* KV not available, use demo */ }

  return json({ code: 0, data: DEMO_DATA, msg: '演示数据' });
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
  });
}
