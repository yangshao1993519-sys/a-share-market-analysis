/**
 * 获取密保问题
 */
export default async function(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return json({ code: 405, msg: '仅支持POST' }, 405);
  }

  let body;
  try { body = await request.json(); } catch (e) {
    return json({ code: 400, msg: '请求格式错误' });
  }

  const { username } = body;
  if (!username) {
    return json({ code: 400, msg: '请输入用户名' });
  }

  const kv = env.STOCK_REVIEW_KV;
  const userRaw = await kv.get('user:' + username);
  if (!userRaw) {
    return json({ code: 400, msg: '用户不存在' });
  }

  const user = JSON.parse(userRaw);
  return json({ code: 0, data: { question: user.question } });
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
  });
}