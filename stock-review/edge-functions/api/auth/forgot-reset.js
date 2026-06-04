/**
 * 验证密保答案并重置密码
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

  const { username, answer, new_password } = body;
  if (!username || !answer || !new_password) {
    return json({ code: 400, msg: '请填写所有必填项' });
  }

  if (new_password.length < 6) {
    return json({ code: 400, msg: '新密码至少6位' });
  }

  const kv = env.STOCK_REVIEW_KV;
  const key = 'user:' + username;
  const userRaw = await kv.get(key);
  if (!userRaw) {
    return json({ code: 400, msg: '用户不存在' });
  }

  const user = JSON.parse(userRaw);

  if (answer.trim() !== user.answer.trim()) {
    return json({ code: 400, msg: '密保答案错误' });
  }

  // 更新密码
  const pwHash = await sha256(new_password);
  user.password = pwHash;
  await kv.put(key, JSON.stringify(user));

  return json({ code: 0, msg: '密码重置成功' });
}

async function sha256(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
  });
}