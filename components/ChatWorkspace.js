'use client';

import { useEffect, useMemo, useState } from 'react';
import { EMPTY_INSIGHT, STARTER_MESSAGES, STORAGE_KEY } from '../lib/defaults';

function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

function ScoreRing({ label, value }) {
  const clamped = Math.max(0, Math.min(100, Number(value || 0)));
  const deg = Math.round((clamped / 100) * 360);

  return (
    <div className="score-ring-card">
      <div className="score-ring" style={{ background: `conic-gradient(var(--ring) ${deg}deg, rgba(255,255,255,0.06) ${deg}deg)` }}>
        <div className="score-ring-inner">
          <strong>{clamped}</strong>
          <span>/100</span>
        </div>
      </div>
      <p>{label}</p>
    </div>
  );
}

function Bubble({ role, content }) {
  return (
    <div className={cn('bubble', role)}>
      <span className="bubble-role">{role === 'assistant' ? 'AI 陪伴' : '你'}</span>
      <p>{content}</p>
    </div>
  );
}

function RiskBadge({ level }) {
  const text = level === 'high' ? '高风险' : level === 'medium' ? '中风险' : '低风险';
  return <span className={cn('risk-badge', level)}>{text}</span>;
}

export default function ChatWorkspace() {
  const [messages, setMessages] = useState(STARTER_MESSAGES);
  const [insight, setInsight] = useState(EMPTY_INSIGHT);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('demo');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed?.messages) && parsed.messages.length) setMessages(parsed.messages);
      if (parsed?.insight) setInsight(parsed.insight);
      if (parsed?.mode) setMode(parsed.mode);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ messages, insight, mode })
    );
  }, [messages, insight, mode]);

  const promptCount = useMemo(() => messages.filter((item) => item.role === 'user').length, [messages]);

  async function handleSubmit(event) {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: messages, userMessage: text })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || '请求失败');

      const result = data?.result || {};
      setMode(data?.mode || 'live');
      setMessages((prev) => [...prev, { role: 'assistant', content: result.assistant_reply || '模型未返回有效回应。' }]);
      setInsight({
        emotion_summary: result.emotion_summary || EMPTY_INSIGHT.emotion_summary,
        emotion_scores: {
          anxiety: Number(result?.emotion_scores?.anxiety ?? 0),
          depression: Number(result?.emotion_scores?.depression ?? 0),
          stress: Number(result?.emotion_scores?.stress ?? 0),
          hope: Number(result?.emotion_scores?.hope ?? 0)
        },
        diary_title: result.diary_title || EMPTY_INSIGHT.diary_title,
        diary_entry: result.diary_entry || EMPTY_INSIGHT.diary_entry,
        abc_analysis: {
          A: result?.abc_analysis?.A || EMPTY_INSIGHT.abc_analysis.A,
          B: result?.abc_analysis?.B || EMPTY_INSIGHT.abc_analysis.B,
          C: result?.abc_analysis?.C || EMPTY_INSIGHT.abc_analysis.C
        },
        reflective_questions: Array.isArray(result?.reflective_questions) && result.reflective_questions.length
          ? result.reflective_questions.slice(0, 3)
          : EMPTY_INSIGHT.reflective_questions,
        growth_suggestion: result.growth_suggestion || EMPTY_INSIGHT.growth_suggestion,
        risk_level: result.risk_level || 'low',
        risk_reason: result.risk_reason || EMPTY_INSIGHT.risk_reason
      });
    } catch (err) {
      setError(err?.message || '请求失败');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setMessages(STARTER_MESSAGES);
    setInsight(EMPTY_INSIGHT);
    setMode('demo');
    setError('');
    localStorage.removeItem(STORAGE_KEY);
  }

  function handleExport() {
    const block = [
      '易伴·心迹 对话导出',
      `模式：${mode === 'live' ? 'DeepSeek 实时' : '演示模式'}`,
      '',
      '【对话】',
      ...messages.map((item) => `${item.role === 'assistant' ? 'AI' : '你'}：${item.content}`),
      '',
      '【洞察】',
      `情绪摘要：${insight.emotion_summary}`,
      `风险等级：${insight.risk_level}`,
      `风险依据：${insight.risk_reason}`,
      `成长建议：${insight.growth_suggestion}`,
      '',
      '【ABC】',
      `A: ${insight.abc_analysis.A}`,
      `B: ${insight.abc_analysis.B}`,
      `C: ${insight.abc_analysis.C}`,
      '',
      '【日记】',
      `${insight.diary_title}`,
      `${insight.diary_entry}`
    ].join('\n');

    const blob = new Blob([block], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'yiban-xinji-session.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="workspace-shell" id="workspace">
      <div className="workspace-topbar">
        <div>
          <span className="eyebrow">Prototype Workspace</span>
          <h2>对话、洞察、记录，三件事一屏完成</h2>
        </div>
        <div className="topbar-actions">
          <span className={cn('mode-chip', mode)}>{mode === 'live' ? 'DeepSeek Live' : 'Demo Mode'}</span>
          <button className="ghost-btn" type="button" onClick={handleExport}>导出记录</button>
          <button className="ghost-btn" type="button" onClick={handleReset}>重置</button>
        </div>
      </div>

      <div className="workspace-grid">
        <div className="glass-card chat-column">
          <div className="card-head">
            <div>
              <h3>陪伴式对话</h3>
              <p>先说事实，再拆解释，不做廉价安慰。</p>
            </div>
            <div className="chat-meta">
              <span>{promptCount} 次输入</span>
            </div>
          </div>

          <div className="chat-stream">
            {messages.map((message, index) => (
              <Bubble key={`${message.role}-${index}`} role={message.role} content={message.content} />
            ))}
            {loading && <Bubble role="assistant" content="正在归纳对话并生成结构化结果……" />}
          </div>

          <form className="composer" onSubmit={handleSubmit}>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="例如：我今天和朋友闹得很僵，回到宿舍后一直在想是不是我总让别人失望。"
              rows={5}
            />
            <div className="composer-footer">
              <span className="subtle-text">先把文字闭环跑通。语音、数据库、登录都别抢跑。</span>
              <button className="primary-btn" type="submit" disabled={loading}>
                {loading ? '分析中…' : '发送并生成洞察'}
              </button>
            </div>
          </form>

          {error ? <div className="error-banner">{error}</div> : null}
        </div>

        <div className="insight-column">
          <div className="glass-card insight-card highlight">
            <div className="card-head compact">
              <div>
                <h3>今日洞察</h3>
                <p>把模糊情绪翻译成可行动信息。</p>
              </div>
              <RiskBadge level={insight.risk_level} />
            </div>
            <p className="insight-summary">{insight.emotion_summary}</p>
            <p className="supporting-text">风险依据：{insight.risk_reason}</p>

            <div className="rings-grid">
              <ScoreRing label="焦虑" value={insight.emotion_scores.anxiety} />
              <ScoreRing label="低落" value={insight.emotion_scores.depression} />
              <ScoreRing label="压力" value={insight.emotion_scores.stress} />
              <ScoreRing label="希望感" value={insight.emotion_scores.hope} />
            </div>
          </div>

          <div className="two-col-row">
            <div className="glass-card micro-card">
              <div className="card-head compact">
                <h3>日记草稿</h3>
                <span className="tag">Auto Draft</span>
              </div>
              <h4>{insight.diary_title}</h4>
              <p className="supporting-text">{insight.diary_entry}</p>
            </div>

            <div className="glass-card micro-card">
              <div className="card-head compact">
                <h3>成长建议</h3>
                <span className="tag">Action</span>
              </div>
              <p className="supporting-text">{insight.growth_suggestion}</p>
            </div>
          </div>

          <div className="glass-card">
            <div className="card-head compact">
              <h3>ABC 认知分析</h3>
              <span className="tag">事件 / 信念 / 结果</span>
            </div>
            <div className="abc-grid">
              <article className="abc-cell">
                <span>A</span>
                <h4>Activating event</h4>
                <p>{insight.abc_analysis.A}</p>
              </article>
              <article className="abc-cell">
                <span>B</span>
                <h4>Belief</h4>
                <p>{insight.abc_analysis.B}</p>
              </article>
              <article className="abc-cell">
                <span>C</span>
                <h4>Consequence</h4>
                <p>{insight.abc_analysis.C}</p>
              </article>
            </div>
          </div>

          <div className="glass-card">
            <div className="card-head compact">
              <h3>反思问题</h3>
              <span className="tag">3 prompts</span>
            </div>
            <div className="question-list">
              {insight.reflective_questions?.map((question, index) => (
                <div className="question-item" key={`${question}-${index}`}>
                  <span>{index + 1}</span>
                  <p>{question}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
