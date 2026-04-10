export const STORAGE_KEY = 'yiban-xinji-web-v2';

export const STARTER_MESSAGES = [
  {
    role: 'assistant',
    content:
      '今晚最困住你的那件事是什么？不用整理，不用体面，直接说原话。'
  }
];

export const EMPTY_INSIGHT = {
  emotion_summary: '暂未生成洞察。',
  emotion_scores: { anxiety: 16, depression: 12, stress: 22, hope: 38 },
  diary_title: '今晚，先把真实写下来',
  diary_entry:
    '当你输入今天发生的事后，这里会生成一段更接近“可保留记录”的日记草稿。它不是文学作品，而是帮助你把混乱经验整理成能被回看的内容。',
  abc_analysis: {
    A: '等待具体事件。',
    B: '等待自动识别你此刻最强的解释框架。',
    C: '等待输出情绪与行为后果。'
  },
  reflective_questions: [
    '你现在最怕被证实的事情是什么？',
    '这件事里，哪些是事实，哪些是你自动补上的解释？',
    '如果一个你在乎的人处在同样情境，你会怎么和他讲话？'
  ],
  growth_suggestion: '先说清事实，再处理意义判断。别把情绪当证据。',
  risk_level: 'low',
  risk_reason: '当前还没有足够内容判断风险。'
};
