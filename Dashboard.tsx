import React, { useState, useMemo } from 'react';
import { AlertCircle, Zap, Sun, CheckCircle2, Edit3, Search, Sparkles, Scale, Trash2 } from 'lucide-react';
import { COLORS, FOOD_DB } from '../constants';
import { formatDateStr, getEmojiForRecipe, simulateAIAnalysis } from '../utils';
import { ProgressCircle, MacroStat } from './UI';

export function AnalysisPopup({ data, onClose }: { data: any, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-[#2D241E]/90 backdrop-blur-md z-[110] flex items-center justify-center p-6">
      <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl border-t-4 border-t-amber-400 animate-in zoom-in">
        <h3 className="text-xl font-black mb-4 flex items-center gap-2 text-amber-600"><Sparkles size={20} /> AI 摄入分析建议 </h3>
        <div className="grid grid-cols-3 gap-2 mb-6 text-center">
           <div className="bg-amber-50 p-4 rounded-3xl shadow-inner"><p className="text-[10px] text-amber-600 font-bold mb-1">蛋白质</p><p className="text-xl font-black text-amber-700">+{data.p}g</p></div>
           <div className="bg-blue-50 p-4 rounded-3xl shadow-inner"><p className="text-[10px] text-blue-600 font-bold mb-1">碳水</p><p className="text-xl font-black text-blue-700">+{data.c}g</p></div>
           <div className="bg-red-50 p-4 rounded-3xl shadow-inner"><p className="text-[10px] text-red-600 font-bold mb-1">脂肪</p><p className="text-xl font-black text-red-700">+{data.f}g</p></div>
        </div>
        <div className="bg-gray-50 p-5 rounded-2xl mb-6"><p className="text-sm text-gray-700 font-medium italic leading-relaxed">“{data.advice}”</p></div>
        <button onClick={onClose} className="w-full py-4 bg-amber-500 text-white rounded-2xl font-black shadow-lg shadow-orange-100 transition-transform active:scale-95">好的，记住了 </button>
      </div>
    </div>
  );
}

export function SearchSection({ onAdd }: { onAdd: (data: any) => void }) {
  const [query, setQuery] = useState('');
  const [weight, setWeight] = useState(100);
  const [selected, setSelected] = useState<string | null>(null);
  const [isAI, setIsAI] = useState(false);
  const foods = useMemo(() => Object.keys(FOOD_DB).filter(f => f.includes(query)), [query]);

  const handleConfirm = () => {
    const ratio = weight / 100;
    if (isAI) {
      const est = simulateAIAnalysis(query);
      onAdd({ name: `AI估算: ${query}`, p: Math.round(est.p * ratio), c: Math.round(est.c * ratio), f: Math.round(est.f * ratio), id: Date.now() });
    } else if (selected) {
      const base = FOOD_DB[selected];
      onAdd({ name: `${selected} (${weight}g)`, p: Math.round(base.p * ratio), c: Math.round(base.c * ratio), f: Math.round(base.f * ratio), id: Date.now() });
    }
  };

  return (
    <>
      <div className="relative mb-4 shrink-0"><Search className="absolute left-4 top-3.5 text-gray-300" size={18} /><input placeholder="搜索 50+ 种日常食材..." className="w-full bg-gray-50 rounded-2xl py-3.5 pl-12 pr-4 text-sm outline-none focus:ring-1 focus:ring-amber-500 shadow-inner" value={query} onChange={e => {setQuery(e.target.value); setIsAI(false); setSelected(null);}} /></div>
      <div className="flex-1 overflow-y-auto space-y-2 mb-4 scrollbar-hide">
        {foods.length > 0 ? foods.map(f => (
          <button key={f} onClick={() => {setSelected(f); setIsAI(false);}} className={`w-full flex justify-between items-center p-4 rounded-2xl border transition-all ${selected === f ? 'border-amber-500 bg-amber-50 shadow-inner' : 'border-gray-50 bg-white'}`}>
            <div className="flex items-center gap-2"><span className="text-lg">{FOOD_DB[f].emoji}</span><span className="font-bold text-sm text-gray-700 text-left">{f}</span></div>
            <div className="flex gap-2 text-[8px] font-bold"><span style={{ color: COLORS.p }}>P:{FOOD_DB[f].p}</span><span style={{ color: COLORS.c }}>C:{FOOD_DB[f].c}</span><span style={{ color: COLORS.f }}>F:{FOOD_DB[f].f}</span></div>
          </button>
        )) : query && (
           <button onClick={() => {setIsAI(true); setSelected(null);}} className="w-full p-6 bg-orange-50 rounded-[2rem] text-center border border-orange-100 shadow-sm animate-pulse"><Sparkles className="mx-auto text-amber-500 mb-2" size={28} /><p className="text-xs font-black text-amber-700 uppercase tracking-widest">数据库无匹配，点击启动 AI 估算 “{query}”</p></button>
        )}
      </div>
      {(selected || isAI) && (
        <div className="bg-amber-50 p-6 rounded-[2rem] space-y-4 shrink-0 border border-amber-100 animate-in slide-in-from-bottom-2">
          <div className="flex justify-between items-center"><span className="font-black text-sm text-amber-900 flex items-center gap-1"><Scale size={14}/> 重量 (g)</span><div className="flex items-center gap-2"><button onClick={() => setWeight(Math.max(0, weight-50))} className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center font-bold text-amber-600 active:scale-90">-</button><input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="w-16 bg-white border-none rounded-xl p-2 text-center font-black text-sm shadow-inner" /><button onClick={() => setWeight(weight+50)} className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center font-bold text-amber-600 active:scale-90">+</button></div></div>
          <button onClick={handleConfirm} className="w-full py-4 bg-[#2D241E] text-white rounded-2xl font-black shadow-xl active:scale-95 transition-all">确认摄入 </button>
        </div>
      )}
    </>
  );
}

export function Dashboard({ targets, totals, todayData, currentDate, onAdd, onUpdateMeals, onUpdateLog }: any) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMeal, setEditingMeal] = useState<any>(null);

  const balancedTip = useMemo(() => {
    if (totals.f > targets.f * 1.1) return { text: "油脂储备过快，建议下餐清淡为主，控油为身体减负哈。", icon: AlertCircle, color: COLORS.danger };
    if (totals.c > targets.c * 1.1) return { text: "碳水摄入较多，建议增加绿叶蔬菜比例，维持机能平稳。", icon: AlertCircle, color: COLORS.danger };
    const pPct = totals.p / targets.p;
    if (pPct < 0.5) return { text: "能量待补充。建议补充瘦牛肉或蛋白清，为身体注入动力。", icon: Zap, color: COLORS.warning };
    if (pPct < 0.9) return { text: "补给过半，进度良好。建议下一餐优先选择优质白肉补给。", icon: Sun, color: COLORS.p };
    return { text: "达成！今日蛋白质已达标。记得多喝水促进蛋白质代谢循环哈。", icon: CheckCircle2, color: COLORS.success };
  }, [totals, targets]);

  const StatusIcon = balancedTip.icon;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-[#F3E9DF] flex flex-col items-center relative text-center">
        <h2 className="text-xl font-black text-amber-600 mb-6">{formatDateStr(currentDate)}</h2>
        <div className="relative w-56 h-56 flex items-center justify-center">
           <ProgressCircle size={220} stroke={16} percent={(totals.p / targets.p) * 100} color={COLORS.p} />
           <div className="absolute w-40 h-40"><ProgressCircle size={160} stroke={14} percent={(totals.c / targets.c) * 100} color={COLORS.c} /></div>
           <div className="absolute w-24 h-24"><ProgressCircle size={100} stroke={12} percent={(totals.f / targets.f) * 100} color={COLORS.f} /></div>
           <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-[#2D241E]">{Math.round((totals.p / targets.p) * 100)}%</span>
              <span className="text-[10px] font-bold text-amber-600 uppercase">蛋白质摄入</span>
           </div>
        </div>
        <div className="mt-8 px-6 py-3 rounded-xl flex items-start gap-3 border shadow-sm text-left" style={{ backgroundColor: `${balancedTip.color}10`, borderColor: `${balancedTip.color}30` }}>
          <div style={{ color: balancedTip.color }} className="mt-0.5 shrink-0"><StatusIcon size={16}/></div>
          <p className="text-[11px] font-bold leading-relaxed flex-1" style={{ color: balancedTip.color }}>{balancedTip.text}</p>
        </div>
        <div className="grid grid-cols-3 gap-6 w-full mt-10">
           <MacroStat label="蛋白质" cur={totals.p} tar={targets.p} color={COLORS.p} />
           <MacroStat label="碳水" cur={totals.c} tar={targets.c} color={COLORS.c} />
           <MacroStat label="脂肪" cur={totals.f} tar={targets.f} color={COLORS.f} />
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4 px-2"><h3 className="font-black text-lg text-gray-800">今日摄入清单</h3><button onClick={() => setShowAddModal(true)} className="text-xs font-black text-amber-600 bg-amber-50 px-4 py-2 rounded-full shadow-sm">+ 记录一餐</button></div>
        <div className="space-y-3">
          {todayData.meals.length === 0 ? <div className="py-12 text-center text-gray-300 border-2 border-dashed border-gray-100 rounded-3xl text-sm italic px-4">开启健康的一天...</div> : todayData.meals.map((m: any) => (
            <div key={m.id} onClick={() => setEditingMeal(m)} className="bg-white p-5 rounded-[1.8rem] border border-[#F3E9DF] flex justify-between items-center shadow-sm active:scale-95 cursor-pointer group hover:border-amber-200 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-xl shadow-inner group-hover:bg-amber-50 transition-colors">{getEmojiForRecipe(m.name)}</div>
                <div><h4 className="font-bold text-sm text-[#4A3F35]">{m.name}</h4><div className="flex gap-3 mt-1 text-[10px] font-bold opacity-60"><span style={{ color: COLORS.p }}>P:{m.p}g</span> · <span style={{ color: COLORS.c }}>C:{m.c}g</span> · <span style={{ color: COLORS.f }}>F:{m.f}g</span></div></div>
              </div>
              <Edit3 size={14} className="text-gray-200" />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-[2.5rem] p-8 border border-[#F3E9DF] shadow-sm">
        <h3 className="text-sm font-black flex items-center gap-2 mb-4 text-amber-900">身心状态记录</h3>
        <div className="flex gap-3 mb-6">
          {[1,2,3,4,5].map(v => (<button key={v} onClick={() => onUpdateLog({ energy: v, submitted: false })} className={`flex-1 aspect-square rounded-2xl text-xl flex items-center justify-center transition-all ${todayData.energy === v ? 'bg-amber-500 text-white shadow-lg scale-110' : 'bg-gray-50 text-gray-300 hover:bg-amber-50'}`}>{['😫','😔','😐','😊','🔥'][v-1]}</button>))}
        </div>
        <textarea placeholder="此刻感受如何？充满挑战还是充满干劲？" value={todayData.feeling || ''} onChange={(e) => onUpdateLog({ feeling: e.target.value, submitted: false })} className="w-full bg-gray-50 border-none rounded-[1.5rem] p-4 text-sm focus:ring-1 focus:ring-amber-300 outline-none mb-4 min-h-[100px] resize-none shadow-inner" rows={3} />
        <button onClick={() => { onUpdateLog({ submitted: true }); }} className={`w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-sm ${todayData.submitted ? 'bg-[#F1F6F1] text-[#4A7C4A] border border-[#D1E8D1]' : 'bg-[#2D241E] text-white shadow-lg shadow-orange-200'}`}>{todayData.submitted ? '✓ 已记录' : '确认并记录今日状态'}</button>
      </section>

      {showAddModal && (
        <div className="fixed inset-0 bg-[#2D241E]/80 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] p-8 flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-full duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-6 shrink-0"><h2 className="text-xl font-black">记录一餐</h2><button onClick={() => setShowAddModal(false)} className="text-gray-300 font-bold">取消</button></div>
            <SearchSection onAdd={(data) => { onAdd(data); setShowAddModal(false); }} />
          </div>
        </div>
      )}

      {editingMeal && (
        <div className="fixed inset-0 bg-[#2D241E]/80 backdrop-blur-md z-[110] flex items-end sm:items-center justify-center p-4 animate-in slide-in-from-bottom-full duration-300"><div className="bg-white w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] p-8 shadow-2xl border border-gray-100">
           <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-black">数值手动修正</h2><button onClick={() => { onUpdateMeals(todayData.meals.filter((i: any) => i.id !== editingMeal.id)); setEditingMeal(null); }} className="text-red-400 p-2 bg-red-50 rounded-full hover:bg-red-100 transition-colors"><Trash2 size={20}/></button></div>
           <div className="space-y-4 text-left">
              <div className="grid grid-cols-3 gap-3">
                 <div><p className="text-[10px] font-bold text-gray-400 mb-1 uppercase text-center">蛋白质</p><input type="number" value={editingMeal.p} onChange={e => setEditingMeal({...editingMeal, p: Number(e.target.value)})} className="w-full bg-gray-50 p-3 rounded-xl text-center font-black text-amber-600 outline-none" /></div>
                 <div><p className="text-[10px] font-bold text-gray-400 mb-1 uppercase text-center">碳水</p><input type="number" value={editingMeal.c} onChange={e => setEditingMeal({...editingMeal, c: Number(e.target.value)})} className="w-full bg-gray-50 p-3 rounded-xl text-center font-black text-blue-600 outline-none" /></div>
                 <div><p className="text-[10px] font-bold text-gray-400 mb-1 uppercase text-center">脂肪</p><input type="number" value={editingMeal.f} onChange={e => setEditingMeal({...editingMeal, f: Number(e.target.value)})} className="w-full bg-gray-50 p-3 rounded-xl text-center font-black text-red-600 outline-none" /></div>
              </div>
           </div>
           <div className="flex gap-3 pt-6"><button onClick={() => setEditingMeal(null)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-gray-500 active:scale-95 transition-transform">取消</button><button onClick={() => { onUpdateMeals(todayData.meals.map((i: any) => i.id === editingMeal.id ? editingMeal : i)); setEditingMeal(null); }} className="flex-1 py-4 bg-[#2D241E] text-white rounded-2xl font-black shadow-xl active:scale-95 transition-transform">保存更改</button></div>
        </div></div>
      )}
    </div>
  );
}
