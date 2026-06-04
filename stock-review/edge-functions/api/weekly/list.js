/**
 * 周复盘列表 - 游客只能看最近7天（按周）
 */
export default async function(context) {
  const { env } = context;
  const kv = env.STOCK_REVIEW_KV;

  const allKeys = await kv.list({ prefix: 'weekly:' });

  let items = [];
  if (allKeys && allKeys.keys) {
    for (const k of allKeys.keys) {
      const raw = await kv.get(k.name);
      if (raw) {
        try {
          const item = JSON.parse(raw);
          items.push({
            date: item.date || k.name.replace('weekly:', ''),
            title: item.title || '',
            preview: (item.content || '').substring(0, 150)
          });
        } catch (e) {}
      }
    }
  }

  items.sort((a, b) => b.date.localeCompare(a.date));

  const user = env.user;
  if (!user) {
    // 未登录限制最近 7 个条目（约7周）
    items = items.slice(0, 7);
  }

  return json({ code: 0, data: { list: items } });
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
  });
}