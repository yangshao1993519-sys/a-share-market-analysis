/**
 * 日复盘详情
 */
export default async function(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const date = url.searchParams.get('date');

  if (!date) {
    return json({ code: 400, msg: '缺少日期参数' });
  }

  const kv = env.STOCK_REVIEW_KV;
  const raw = await kv.get('daily:' + date);
  if (!raw) {
    return json({ code: 404, msg: '未找到该日复盘' });
  }

  const data = JSON.parse(raw);
  return json({ code: 0, data });
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
  });
}