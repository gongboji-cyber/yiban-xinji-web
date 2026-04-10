import { buildMockResult } from '../../../lib/mock';

function normalizeMessages(history = [], userMessage = '') {
  const safeHistory = Array.isArray(history)
    ? history
        .filter((item) => item && typeof item.content === 'string' && (item.role === 'user' || item.role === 'assistant'))
        .slice(-12)
        .map((item) => ({ role: item.role, content: item.content }))
    : [];

  if (typeof userMessage === 'string' && userMessage.trim()) {
    safeHistory.push({ role: 'user', content: userMessage.trim() });
  }

  return safeHistory;
}

const SYSTEM_PROMPT = `你是“易伴·心迹”的核心陪伴助手。任务不是空泛安慰，而是温和、克制、清晰地帮助用户：
1. 先用自然中文给出 1 段回应，承接情绪但不说教。
2. 再把信息压缩成结构化结果。
3. 如果出现自伤、自杀、极端绝望、无法保证安全等高危信号，risk_level 必须为 high，assistant_reply 必须明确建议联系现实中的可信任对象、当地紧急援助或心理危机热线，不能只停留在泛泛陪伴。
4. 不要输出 markdown，不要使用代码块。
5. 你必须只返回合法 JSON，且字段完整。

JSON schema:
{
  "assistant_reply": "string",
  "emotion_summary": "string",
  "emotion_scores": {
    "anxiety": 0-100,
    "depression": 0-100,
    "stress": 0-100,
    "hope": 0-100
  },
  "diary_title": "string",
  "diary_entry": "string",
  "abc_analysis": {
    "A": "string",
    "B": "string",
    "C": "string"
  },
  "reflective_questions": ["string", "string", "string"],
  "growth_suggestion": "string",
  "risk_level": "low|medium|high",
  "risk_reason": "string"
}`;

export async function POST(request) {
  try {
    const body = await request.json();
    const userMessage = String(body?.userMessage || '').trim();
    const history = normalizeMessages(body?.history, userMessage);

    if (!userMessage) {
      return Response.json({ error: '消息不能为空。' }, { status: 400 });
    }

    const demoMode = String(process.env.DEMO_MODE || '').toLowerCase() === 'true';
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const baseUrl = (process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com').replace(/\/$/, '');
    const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

    if (demoMode || !apiKey) {
      return Response.json({
        mode: 'demo',
        result: buildMockResult(userMessage)
      });
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...history
        ]
      })
    });

    if (!response.ok) {
      const text = await response.text();
      return Response.json(
        { error: `DeepSeek 请求失败：${response.status} ${text}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content;

    if (!raw) {
      return Response.json({ error: '模型没有返回内容。' }, { status: 500 });
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return Response.json(
        { error: '模型返回了非 JSON 内容，请降低提示词复杂度后再试。', raw },
        { status: 500 }
      );
    }

    return Response.json({ mode: 'live', result: parsed });
  } catch (error) {
    return Response.json(
      { error: error?.message || '服务器内部错误。' },
      { status: 500 }
    );
  }
}
