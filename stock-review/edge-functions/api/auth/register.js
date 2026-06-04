/**
 * 用户注册（支持无 KV 降级：直接返回成功）
 */
export default async function(context) {
  const { request } = context;

  if (request.method !== 'POST') {
    return json({ code: 405, msg: '仅支持POST' }, 405);
  }

  let body;
  try { body = await request.json(); } catch (e) {
    return json({ code: 400, msg: '请求格式错误' });
  }

  const { username, password, question, answer } = body;
  if (!username || !password || !question || !answer) {
    return json({ code: 400, msg: '请填写完整信息' });
  }

  if (username.length < 2 || username.length > 20) {
    return json({ code: 400, msg: '用户名长度2-20个字符' });
  }
  if (password.length < 6) {
    return json({ code: 400, msg: '密码长度至少6位' });
  }

  try {
    const kv = env.STOCK_REVIEW_KV;
    if (kv) {
      const existing = await kv.get('user:' + username);
      if (existing) {
        return json({ code: 400, msg: '用户名已存在' });
      }

      const pwHash = await sha256(password);
      const user = { username, password: pwHash, question, answer: await sha256(answer), role: 'user', created_at: new Date().toISOString() };
      await kv.put('user:' + username, JSON.stringify(user));

      // 更新用户列表
      const listRaw = await kv.get('user:list');
      const list = listRaw ? JSON.parse(listRaw) : [];
      list.push(username);
      await kv.put('user:list', JSON.stringify(list));
    }
  } catch(e) {
    return json({ code: 0, data: { username, role: 'user' }, msg: '注册成功（演示模式，数据未持久化）' });
  }

  return json({ code: 0, data: { username }, msg: '注册成功' });
}

async function sha256(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
  });
}
