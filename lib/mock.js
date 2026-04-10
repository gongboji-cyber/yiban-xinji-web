function clamp(num) {
  return Math.max(0, Math.min(100, Math.round(num)));
}

export function buildMockResult(userMessage) {
  const text = String(userMessage || '').trim();
  const lengthFactor = Math.min(22, Math.floor(text.length / 5));
  const negativeHits = ['崩溃', '难受', '焦虑', '压力', '失眠', '痛苦', '完了', '失败', '自责', '绝望'];
  const positiveHits = ['好一些', '缓解', '希望', '想通', '支持', '理解', '休息'];

  const negativeCount = negativeHits.reduce((n, word) => n + (text.includes(word) ? 1 : 0), 0);
  const positiveCount = positiveHits.reduce((n, word) => n + (text.includes(word) ? 1 : 0), 0);

  const anxiety = clamp(28 + lengthFactor + negativeCount * 11 - positiveCount * 4);
  const depression = clamp(20 + Math.floor(lengthFactor * 0.7) + negativeCount * 9 - positiveCount * 4);
  const stress = clamp(32 + lengthFactor + negativeCount * 10 - positiveCount * 3);
  const hope = clamp(46 + positiveCount * 10 - negativeCount * 8 - Math.floor(lengthFactor * 0.4));

  let risk_level = 'low';
  if (negativeCount >= 3 || /不想活|伤害自己|自杀|活着没意思/.test(text)) risk_level = 'high';
  else if (negativeCount >= 1 || anxiety >= 55 || depression >= 55 || stress >= 60) risk_level = 'medium';

  const sentences = text.split(/[。！？!?\n]/).map((s) => s.trim()).filter(Boolean);
  const coreEvent = sentences[0] || '今天发生了一件让你情绪波动的事';
  const automaticBelief =
    negativeCount > 0
      ? '我是不是又把事情搞砸了，问题可能就在我身上。'
      : '这件事是不是说明我不够好，或者局面会继续变糟。';
  const consequence =
    negativeCount > 0
      ? '情绪被迅速拉高，开始反复回想、内耗、躲避或自责。'
      : '情绪悬而未决，注意力被牵走，脑中不断重复推演最坏结果。';

  return {
    assistant_reply:
      risk_level === 'high'
        ? '我先直接说重点：你现在表达出的痛苦强度已经不适合继续只靠 AI 陪聊硬扛。请尽快联系现实中的可信任对象，必要时联系当地紧急援助或心理危机热线。你也可以把“此刻最危险的冲动”和“身边是否有人”直接告诉我，我先帮你把局面稳下来。'
        : '我听到了。你现在不是缺道理，而是脑子里那套自动解释在持续放大压力。我先帮你把它拆开：发生了什么、你怎么解释它、这种解释把你带到了什么情绪和行为里。',
    emotion_summary:
      risk_level === 'high'
        ? '你当前的表达显示出高强度负性情绪和明显失控风险，优先目标不是分析得多漂亮，而是尽快降低现实风险。'
        : negativeCount > 0
          ? '你的叙述里最突出的不是事件本身，而是由事件触发的“自我归因”和灾难化推演。情绪负荷偏高，且有反复咀嚼倾向。'
          : '当前情绪并非完全失控，但你已经被一套隐性的自我解释拖着走，适合及时做结构化整理，避免继续内耗。',
    emotion_scores: { anxiety, depression, stress, hope },
    diary_title: risk_level === 'high' ? '今晚先确保自己安全' : '把混乱写成可回看的记录',
    diary_entry:
      risk_level === 'high'
        ? `今晚的核心不是证明谁对谁错，而是先保证我不会在情绪最高点做出伤害自己的决定。${coreEvent} 这件事让我被巨大的痛苦和无力感淹没，我需要先联系现实中的人、离开危险环境、把自己放到更安全的位置，再谈怎么理解今天。`
        : `今天最让我难受的，是 ${coreEvent}。真正压住我的，不只是事情本身，还有我很快就得出的那个解释：也许问题在我，也许局面会越来越坏。这个解释把我带进了反复回想和自责里。把它写下来，不是为了证明我脆弱，而是为了把混乱从脑子里拿出来，变成我能重新审视的东西。`,
    abc_analysis: {
      A: coreEvent,
      B: automaticBelief,
      C: consequence
    },
    reflective_questions: [
      '眼下最让你难受的，到底是事实，还是你对事实的解释？',
      '这件事里有哪些证据支持你的判断，又有哪些证据并不支持？',
      '此刻最小但真实可做的一步是什么？'
    ],
    growth_suggestion:
      risk_level === 'high'
        ? '先找人、离开高风险环境、延迟任何极端决定。分析可以晚一点，安全不能。'
        : '把“我感觉很糟”与“事情一定很糟”分开。先纠偏解释，再考虑下一步行动。',
    risk_level,
    risk_reason:
      risk_level === 'high'
        ? '检测到高强度绝望/自伤相关表述或多重强烈负性词汇堆叠。'
        : risk_level === 'medium'
          ? '检测到明显焦虑、自责、灾难化或压力堆积表达。'
          : '当前内容以压力和困扰为主，暂未见明确高危信号。'
  };
}
