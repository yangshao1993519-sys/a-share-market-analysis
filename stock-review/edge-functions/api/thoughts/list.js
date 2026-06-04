/**
 * 交易心得列表 - 需登录
 */
export default async function(context) {
  const { env } = context;
  const kv = env.STOCK_REVIEW_KV;

  const allKeys = await kv.list({ prefix: 'thoughts:' });

  let items = [];
  if (allKeys && allKeys.keys) {
    for (const k of allKeys.keys) {
      const raw = await kv.get(k.name);
      if (raw) {
        try {
          const item = JSON.parse(raw);
          items.push({
            id: item.id || k.name.replace('thoughts:', ''),
            title: item.title || '',
            date: item.date || '',
            preview: (item.content || '').substring(0, 150)
          });
        } catch (e) {}
      }
    }
  }

  items.sort((a, b) => String(b.id).localeCompare(String(a.id)));

  return json({ code: 0, data: { list: items } });
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
  });
}