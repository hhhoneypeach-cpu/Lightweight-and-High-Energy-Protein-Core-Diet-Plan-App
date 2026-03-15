import React from 'react';
import { Scale, Dumbbell, Sun, Bell, Clock, FileSpreadsheet } from 'lucide-react';
import { exportToCSV } from '../utils';

export function SettingsView({ userProfile, setUserProfile, dailyLogs }: any) {
  return (
    <div className="space-y-8 animate-in fade-in pb-20">
      <section className="bg-white p-8 rounded-[2.5rem] border border-[#F3E9DF] shadow-sm space-y-6">
        <h3 className="font-black text-lg text-amber-900 flex items-center gap-2 text-left"><Scale size={20} /> 核心身材自定 </h3>
        <div className="space-y-4 text-left">
          <div className="flex justify-between items-center bg-gray-50 p-5 rounded-2xl border border-gray-100 shadow-inner"><span className="text-sm font-bold text-[#4A3F35]">体重 (kg)</span><input type="number" value={userProfile.weight} onChange={e => setUserProfile({...userProfile, weight: Number(e.target.value)})} className="w-20 bg-transparent text-right font-black outline-none text-amber-600 text-lg shadow-sm" /></div>
          <div className="space-y-2 text-left">
            <p className="text-[10px] font-black text-gray-400 uppercase px-2 text-left">模式计算公式 </p>
            <div className="grid grid-cols-1 gap-2">
              {[
                { m: 'NORMAL', label: '日常减脂 ', desc: 'P: 1.0 / C: 4.0 / F: 0.8 × 体重 ' },
                { m: 'FITNESS', label: '运动增肌 ', desc: 'P: 1.6 / C: 5.0 / F: 1.0 × 体重 ' },
                { m: 'CUSTOM', label: '完全自定义 ', desc: '手动设置每日目标数值 ' }
              ].map(item => (
                <button key={item.m} onClick={() => setUserProfile({...userProfile, mode: item.m})} className={`flex flex-col items-start p-5 rounded-2xl border transition-all text-left shadow-sm ${userProfile.mode === item.m ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500 shadow-md' : 'border-gray-50 bg-white'}`}><div className="flex items-center gap-2 text-left">{item.m === 'FITNESS' ? <Dumbbell size={14} className={userProfile.mode === item.m ? 'text-amber-600' : 'text-gray-300'} /> : <Sun size={14} className={userProfile.mode === item.m ? 'text-amber-600' : 'text-gray-300'} />}<span className={`text-sm font-black ${userProfile.mode === item.m ? 'text-amber-700' : 'text-gray-400'}`}>{item.label}</span></div><span className="text-[10px] text-gray-300 mt-1 text-left">{item.desc}</span></button>
              ))}
            </div>
          </div>
          {userProfile.mode === 'CUSTOM' && (
             <div className="bg-amber-50/50 p-6 rounded-[2rem] border border-amber-100 space-y-4 animate-in slide-in-from-top-2 text-left">
                <p className="text-xs font-black text-amber-600 text-center uppercase tracking-tighter">数值目标 (g)</p>
                <div className="grid grid-cols-3 gap-3">{['p', 'c', 'f'].map(k => (<div key={k} className="bg-white p-3 rounded-xl shadow-sm text-center"><p className="text-[10px] font-bold text-gray-300 mb-1 uppercase">{k === 'p' ? '蛋白质' : k === 'c' ? '碳水' : '脂肪'}</p><input type="number" value={userProfile.customTargets[k]} onChange={e => setUserProfile({ ...userProfile, customTargets: { ...userProfile.customTargets, [k]: Number(e.target.value) }})} className="w-full text-center font-black text-amber-600 outline-none" /></div>))}</div>
             </div>
          )}
        </div>
      </section>
      <section className="bg-white p-8 rounded-[2.5rem] border border-[#F3E9DF] shadow-sm space-y-6">
        <h3 className="font-black text-lg text-amber-900 flex items-center gap-2 text-left"><Bell size={20} /> 进食提醒设置 </h3>
        <div className="space-y-3">{userProfile.reminders.map((rem: any) => (<div key={rem.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100 group hover:bg-white hover:shadow-sm"><div className="flex items-center gap-4 text-left"><div className={`p-2 rounded-xl ${rem.active ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-300'}`}><Clock size={18} /></div><div><p className={`text-sm font-black ${rem.active ? 'text-gray-800' : 'text-gray-400'}`}>{rem.label}</p><input type="time" value={rem.time} onChange={e => { const newRems = userProfile.reminders.map((r: any) => r.id === rem.id ? {...r, time: e.target.value} : r); setUserProfile({...userProfile, reminders: newRems}); }} className="text-[10px] font-bold text-amber-500 bg-transparent outline-none cursor-pointer" /></div></div><button onClick={() => { const newRems = userProfile.reminders.map((r: any) => r.id === rem.id ? {...r, active: !r.active} : r); setUserProfile({...userProfile, reminders: newRems}); }} className={`w-10 h-5 rounded-full transition-colors relative ${rem.active ? 'bg-amber-500' : 'bg-gray-200'}`}><div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${rem.active ? 'right-1' : 'left-1'}`}></div></button></div>))}</div>
      </section>
      <button onClick={() => exportToCSV(dailyLogs)} className="w-full py-5 bg-[#2D241E] text-white rounded-[2rem] font-black shadow-xl active:scale-95 flex items-center justify-center gap-2 transition-all active:translate-y-1 shadow-orange-100/50"><FileSpreadsheet size={18} /> 导出历史报告 (CSV)</button>
    </div>
  );
}
