/**
 * 获取密保问题（支持无 KV 降级）
 */
export default async function(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const username = url.searchParams.get('username');

  if (!username) {
    return json({ code: 400, msg: '请输入用户名' });
  }

  // 硬编码管理员密保
  if (username === 'admin') {
    return json({ code: 0, data: { question: '你的昵称是？' } });
  }

  try {
    const kv = env.STOCK_REVIEW_KV;
    if (kv) {
      const raw = await kv.get('user:' + username);
      if (!raw) return json({ code: 400, msg: '用户不存在' });
      return json({ code: 0, data: { question: JSON.parse(raw).question } });
    }
  } catch(e) { /* KV not available */ }

  return json({ code: 400, msg: '用户不存在' });
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
  });
}
