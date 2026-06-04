/**
 * 返回当日市场指数数据
 */
export default async function(context) {
  const { env } = context;
  const kv = env.STOCK_REVIEW_KV;

  const raw = await kv.get('market:today');
  if (!raw) {
    return json({ code: 0, data: null, msg: '暂无市场数据' });
  }

  return json({ code: 0, data: JSON.parse(raw) });
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
  });
}