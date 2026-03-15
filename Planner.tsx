import React, { useState, useMemo } from 'react';
import { CheckCircle2, ClipboardList, Check, Trash2 } from 'lucide-react';

export function Planner({ dailyLogs, currentDate, setCurrentDate, onUpdatePlans, targets }: any) {
  const [newPlan, setNewPlan] = useState('');
  const calendarData = useMemo(() => {
    const date = new Date(currentDate);
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ day: d, month: month + 1, full: dateStr });
    }
    return days;
  }, [currentDate]);

  const selectedLog = dailyLogs[currentDate] || { plans: [], meals: [], energy: 3, submitted: false };
  const proFoodTags = ['鸡蛋', '瘦牛肉', '鸡胸肉', '希腊酸奶', '欧包', '苹果', '虾仁'];

  return (
    <div className="space-y-8 animate-in fade-in pb-10">
      <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-[#F3E9DF]">
         <div className="flex flex-col items-center mb-8 text-center"><h2 className="text-xl font-black text-[#2D241E] tracking-tight">{currentDate}</h2><div className="w-12 h-1.5 bg-amber-400 rounded-full mt-2"></div></div>
         <div className="grid grid-cols-7 gap-2">
            {['日','一','二','三','四','五','六'].map(w => <div key={w} className="text-center text-[11px] text-gray-300 font-black mb-2 uppercase">{w}</div>)}
            {calendarData.map((d, i) => {
               if (!d) return <div key={`empty-${i}`} className="aspect-square"></div>;
               const log = dailyLogs[d.full];
               const isToday = new Date().toISOString().split('T')[0] === d.full;
               const isSelected = currentDate === d.full;
               const dayTotals = log?.meals?.reduce((acc: any, m: any) => ({ p: acc.p + Number(m.p) }), { p: 0 }) || { p: 0 };
               return (
                 <button key={d.full} onClick={() => setCurrentDate(d.full)} className={`aspect-square flex flex-col items-center justify-center rounded-2xl relative transition-all ${isSelected ? 'bg-[#2D241E] text-white shadow-xl scale-110 z-10' : 'bg-gray-50/50 hover:bg-amber-50'} ${isToday && !isSelected ? 'ring-2 ring-amber-500' : ''}`}>
                    <span className="text-[10px] font-black">{d.month}.{d.day}</span>
                    {dayTotals.p >= targets.p && (<div className="absolute top-1 left-1 animate-in zoom-in"><CheckCircle2 size={10} className="text-[#10B981]" fill="white" /></div>)}
                    {log?.submitted && (<div className="absolute top-1 right-1 text-[10px]">{['😫','😔','😐','😊','🔥'][log.energy-1] || '😐'}</div>)}
                    <div className="flex gap-0.5 mt-1.5">{log?.meals?.length > 0 && <div className={`w-1.5 h-1.5 rounded-full ${dayTotals.p >= targets.p ? 'bg-amber-500' : 'bg-gray-300'}`}></div>}{log?.plans?.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>}</div>
                 </button>
               );
            })}
         </div>
         {selectedLog.submitted && <div className="mt-8 bg-amber-50/50 p-5 rounded-[2rem] border border-amber-100 flex gap-4 items-center shadow-sm animate-in slide-in-from-top-2 text-left"><div className="text-3xl shrink-0 drop-shadow-sm">{['😫','😔','😐','😊','🔥'][selectedLog.energy-1]}</div><div className="flex-1"><p className="text-[10px] font-black text-amber-600 mb-1 uppercase tracking-widest">已同步身心感受</p><p className="text-xs text-amber-900 leading-relaxed italic font-medium">“{selectedLog.feeling || '今日高度自律。'}”</p></div></div>}
      </section>

      <section className="bg-white rounded-[2.5rem] p-8 border border-[#F3E9DF] shadow-sm">
        <h3 className="font-black mb-6 flex items-center gap-2 text-amber-900"><ClipboardList className="text-amber-500" /> {currentDate} 饮食计划清单</h3>
        <div className="space-y-3 mb-6">
           {selectedLog.plans && selectedLog.plans.length > 0 ? selectedLog.plans.map((p: any, idx: number) => (
             <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl shadow-sm transition-all group animate-in slide-in-from-top-1">
               <button onClick={() => { const u = [...selectedLog.plans]; u[idx].done = !u[idx].done; onUpdatePlans(u); }} className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 ${p.done ? 'bg-amber-500 border-amber-500 text-white' : 'border-gray-200 bg-white'}`}>{p.done && <Check size={14} />}</button>
               <span className={`flex-1 text-sm font-bold text-left ${p.done ? 'line-through text-gray-300' : 'text-[#4A3F35]'}`}>{p.text}</span>
               <button onClick={() => { const u = [...selectedLog.plans]; u.splice(idx, 1); onUpdatePlans(u); }}><Trash2 size={16} className="text-gray-300 hover:text-red-400" /></button>
             </div>
           )) : (
             <p className="text-center text-gray-300 text-xs italic py-4">规划今日必吃安排...</p>
           )}
        </div>
        <div className="space-y-4 text-left">
          <div className="flex gap-2"><input placeholder="规划今日必吃..." className="flex-1 bg-gray-50 rounded-xl p-4 text-sm outline-none border border-transparent focus:border-amber-200 shadow-inner" value={newPlan} onChange={e => setNewPlan(e.target.value)} /><button onClick={() => { if(!newPlan) return; onUpdatePlans([...(selectedLog.plans || []), {text: newPlan, done: false}]); setNewPlan(''); }} className="bg-[#2D241E] text-white px-5 rounded-xl text-xs font-black shadow-md transition-all active:scale-95">添加</button></div>
          <div className="flex flex-wrap gap-2">{proFoodTags.map((tag, idx) => (<button key={`tag-${idx}`} onClick={() => setNewPlan(`吃 ${tag}`)} className="text-[10px] font-bold bg-orange-50 text-amber-600 px-3 py-1.5 rounded-full border border-orange-100/50 shadow-sm transition-colors hover:bg-orange-100">+{tag}</button>))}</div>
        </div>
      </section>
    </div>
  );
}
