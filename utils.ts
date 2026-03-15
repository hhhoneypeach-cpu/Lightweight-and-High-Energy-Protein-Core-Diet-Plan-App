import { APP_ID, FOOD_DB } from './constants';

export const getStorageVal = (key: string, fallback: any) => {
  try {
    const saved = localStorage.getItem(`${APP_ID}_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) { return fallback; }
};

export const setStorageVal = (key: string, value: any) => {
  localStorage.setItem(`${APP_ID}_${key}`, JSON.stringify(value));
};

export const formatDateStr = (dateStr: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()];
  return `${d.getFullYear()}年 ${d.getMonth() + 1}月 ${d.getDate()}日 ${week}`;
};

export const getEmojiForRecipe = (name: string) => {
  if (!name) return '🍲';
  const ln = name.toLowerCase();
  for (let key in FOOD_DB) if (ln.includes(key.toLowerCase())) return FOOD_DB[key].emoji;
  if (ln.includes('粥')) return '🥣';
  if (ln.includes('汤')) return '🥣';
  return '🍱';
};

export const simulateAIAnalysis = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('肉') || n.includes('鸡')) return { p: 24, c: 1, f: 7 };
  if (n.includes('鱼') || n.includes('虾')) return { p: 20, c: 1, f: 2 };
  if (n.includes('面') || n.includes('粉') || n.includes('薯') || n.includes('面包')) return { p: 8, c: 60, f: 2 };
  return { p: 5, c: 15, f: 3 };
};

export const exportToCSV = (data: Record<string, any>) => {
  const headers = "日期,名称,蛋白质(g),碳水(g),脂肪(g),当日状态指数,身心感受记录\n";
  const rows = Object.entries(data).map(([date, log]) => {
    const energy = log.energy || '-';
    const feeling = (log.feeling || '-').replace(/,/g, '，').replace(/\n/g, ' ');
    if (log.meals && log.meals.length > 0) {
      return log.meals.map((m: any) => `${date},${m.name},${m.p},${m.c},${m.f},${energy},${feeling}`).join("\n");
    }
    return `${date},未记录饮食,-,-,-,${energy},${feeling}`;
  }).filter(r => r !== "").join("\n");
  const blob = new Blob(["\uFEFF" + headers + rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `蛋白质饮食记录报告_${new Date().toLocaleDateString()}.csv`);
  link.click();
};
