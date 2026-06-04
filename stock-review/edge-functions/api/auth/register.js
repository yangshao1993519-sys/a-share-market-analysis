/**
 * 注册接口 - 首个账号自动成为管理员
 */
export default async function(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ code: 405, msg: '仅支持POST' }), {
      status: 405, headers: { 'Content-Type': 'application/json' }
    });
  }

  let body;
  try { body = await request.json(); } catch (e) {
    return json({ code: 400, msg: '请求格式错误' });
  }

  const { username, password, question, answer } = body;

  if (!username || !password || !question || !answer) {
    return json({ code: 400, msg: '请填写所有必填项' });
  }

  if (username.length < 4 || username.length > 20) {
    return json({ code: 400, msg: '用户名需4-20位' });
  }

  if (password.length < 6) {
    return json({ code: 400, msg: '密码至少6位' });
  }

  if (!/^[a-zA-Z0-9\u4e00-\u9fa5_]+$/.test(username)) {
    return json({ code: 400, msg: '用户名只能包含字母、数字、中文和下划线' });
  }

  const kv = env.STOCK_REVIEW_KV;
  const key = 'user:' + username;
  const existing = await kv.get(key);
  if (existing) {
    return json({ code: 400, msg: '用户名已存在' });
  }

  // 密码 SHA-256
  const pwHash = await sha256(password);

  // 判断是否首个用户
  const userListRaw = await kv.get('user:list') || '[]';
  const userList = JSON.parse(userListRaw);
  const role = userList.length === 0 ? 'admin' : 'user';

  const userData = {
    username,
    password: pwHash,
    question,
    answer,
    role,
    created_at: new Date().toISOString()
  };

  await kv.put(key, JSON.stringify(userData));
  userList.push(username);
  await kv.put('user:list', JSON.stringify(userList));

  return json({ code: 0, data: { username, role }, msg: '注册成功' });
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