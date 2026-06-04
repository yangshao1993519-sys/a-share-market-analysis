/**
 * 删除留言 - 仅管理员
 */
export default async function(context) {
  const { request, env } = context;

  if (request.method !== 'DELETE') {
    return json({ code: 405, msg: '仅支持DELETE' }, 405);
  }

  let body;
  try { body = await request.json(); } catch (e) {
    return json({ code: 400, msg: '请求格式错误' });
  }

  const { id } = body;
  if (!id) {
    return json({ code: 400, msg: '缺少留言ID' });
  }

  const user = env.user;
  if (!user || user.role !== 'admin') {
    return json({ code: 403, msg: '权限不足' }, 403);
  }

  const kv = env.STOCK_REVIEW_KV;
  const key = 'chat:' + id;
  const existing = await kv.get(key);
  if (!existing) {
    return json({ code: 404, msg: '留言不存在' });
  }

  await kv.delete(key);

  return json({ code: 0, msg: '删除成功' });
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
  });
}