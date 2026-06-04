/**
 * 交易心得详情 - 需登录
 */
export default async function(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return json({ code: 400, msg: '缺少文章ID' });
  }

  const kv = env.STOCK_REVIEW_KV;
  const raw = await kv.get('thoughts:' + id);
  if (!raw) {
    return json({ code: 404, msg: '未找到该心得' });
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