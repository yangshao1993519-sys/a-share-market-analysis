/**
 * 日复盘列表 - 游客只能看最近7天
 */
export default async function(context) {
  const { env } = context;
  const kv = env.STOCK_REVIEW_KV;

  // 从 KV 获取所有 daily: 前缀的 key
  const allKeys = await kv.list({ prefix: 'daily:' });

  let items = [];
  if (allKeys && allKeys.keys) {
    for (const k of allKeys.keys) {
      const raw = await kv.get(k.name);
      if (raw) {
        try {
          const item = JSON.parse(raw);
          items.push({
            date: item.date || k.name.replace('daily:', ''),
            title: item.title || '',
            preview: (item.content || '').substring(0, 150)
          });
        } catch (e) {
          // skip malformed
        }
      }
    }
  }

  // 日期倒序
  items.sort((a, b) => b.date.localeCompare(a.date));

  // 未登录只给最近 7 天
  const user = env.user;
  if (!user) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const cutoff = sevenDaysAgo.toISOString().split('T')[0];
    items = items.filter(i => i.date >= cutoff);
  }

  return json({ code: 0, data: { list: items } });
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
  });
}