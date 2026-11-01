import type { Language } from '@/i18n/messages';

export type WavelengthQuestion = {
  prompt: string;
  left: string;
  right: string;
};

export const sampleQuestions: Record<Language, WavelengthQuestion[]> = {
  zh: [
    { prompt: '理想的周末应该怎么过？', left: '独处宅家', right: '出门社交' },
    { prompt: '火锅里的香菜，你怎么看？', left: '坚决不要', right: '越多越好' },
    { prompt: '旅行时的行程应该多满？', left: '完全躺平', right: '行程排满' },
    { prompt: '朋友迟到 15 分钟？', left: '完全能接受', right: '完全无法接受' },
    { prompt: '看电影时，你更想看什么？', left: '缓慢细腻', right: '紧张刺激' },
    { prompt: '一个理想的聚会应该是？', left: '安静聊天', right: '热闹狂欢' },
  ],
  en: [
    { prompt: 'What does your ideal weekend look like?', left: 'Stay in', right: 'Go socialize' },
    { prompt: 'Cilantro in hotpot?', left: 'Absolutely none', right: 'Pile it on' },
    { prompt: 'How packed should your vacation be?', left: 'Do nothing', right: 'Every hour planned' },
    { prompt: 'A friend is 15 minutes late.', left: 'Totally fine', right: 'Unacceptable' },
    { prompt: 'What movie mood do you prefer?', left: 'Slow and thoughtful', right: 'Fast and intense' },
    { prompt: 'What makes a great party?', left: 'Quiet conversations', right: 'Big and loud' },
  ],
};

export const PRESET_IDS = ['friends', 'couples', 'family'] as const;
export type PresetId = (typeof PRESET_IDS)[number];

export const presetQuestions: Record<Language, Record<PresetId, WavelengthQuestion[]>> = {
  zh: {
    friends: sampleQuestions.zh,
    couples: [
      { prompt: '约会更重要的是什么？', left: '氛围浪漫', right: '好玩刺激' },
      { prompt: '日常聊天，你更喜欢？', left: '什么都分享', right: '保留空间' },
      { prompt: '一起旅行更适合哪种计划？', left: '说走就走', right: '提前排好' },
      { prompt: '纪念日礼物应该？', left: '精心准备', right: '随性就好' },
      { prompt: '两个人的周末应该？', left: '宅家黏一起', right: '出去看世界' },
      { prompt: '遇到分歧时，你更倾向？', left: '马上说清楚', right: '冷静再聊' },
    ],
    family: [
      { prompt: '一家人的假期应该？', left: '舒服休息', right: '到处走走' },
      { prompt: '过生日更喜欢？', left: '简单吃顿饭', right: '热闹办一场' },
      { prompt: '看电视时更想看？', left: '轻松喜剧', right: '悬疑刺激' },
      { prompt: '家庭聚餐应该？', left: '做熟悉的菜', right: '尝试新口味' },
      { prompt: '家里摆设更喜欢？', left: '极简整洁', right: '温馨热闹' },
      { prompt: '亲戚来家里做客？', left: '越多越好', right: '小范围就好' },
    ],
  },
  en: {
    friends: sampleQuestions.en,
    couples: [
      { prompt: 'What matters more on a date?', left: 'Romance', right: 'Excitement' },
      { prompt: 'How much should couples share?', left: 'Every little thing', right: 'Keep some space' },
      { prompt: 'A trip together should be?', left: 'Spontaneous', right: 'Planned out' },
      { prompt: 'Anniversary gifts should be?', left: 'Thoughtfully planned', right: 'Spontaneous' },
      { prompt: 'A weekend together looks like?', left: 'Cozy at home', right: 'Out exploring' },
      { prompt: 'When you disagree, do you?', left: 'Talk right away', right: 'Cool off first' },
    ],
    family: [
      { prompt: 'A family vacation should be?', left: 'Restful', right: 'Adventurous' },
      { prompt: 'How should birthdays be celebrated?', left: 'Small dinner', right: 'Big gathering' },
      { prompt: 'Family TV night calls for?', left: 'Comedies', right: 'Thrillers' },
      { prompt: 'Dinner together should mean?', left: 'Comfort food', right: 'New flavors' },
      { prompt: 'A cozy home looks like?', left: 'Minimal', right: 'Full of life' },
      { prompt: 'Family visits should be?', left: 'The more the merrier', right: 'Small and calm' },
    ],
  },
};

export function validQuestion(value: unknown): value is WavelengthQuestion {
  if (!value || typeof value !== 'object') return false;
  const question = value as Record<string, unknown>;
  return ['prompt', 'left', 'right'].every((key) => {
    const text = question[key];
    return typeof text === 'string' && text.trim().length > 0 && text.length <= 200;
  });
}
