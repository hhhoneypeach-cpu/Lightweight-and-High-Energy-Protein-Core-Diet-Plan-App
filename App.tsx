import React, { useState, useEffect, useMemo } from 'react';
import { Utensils, Calendar as CalendarIcon, Zap, BookOpen, Settings } from 'lucide-react';
import { getStorageVal, setStorageVal } from './utils';
import { NavBtn } from './components/UI';
import { Dashboard, AnalysisPopup } from './components/Dashboard';
import { Planner } from './components/Planner';
import { EnergyStation } from './components/EnergyStation';
import { Library } from './components/Library';
import { SettingsView } from './components/SettingsView';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [userProfile, setUserProfile] = useState(() => getStorageVal('profile', {
    weight: 65, mode: 'NORMAL', customTargets: { p: 80, c: 250, f: 50 },
    reminders: [{ id: 1, label: '活力早餐', time: '08:00', active: true }, { id: 2, label: '均衡午餐', time: '12:30', active: true }, { id: 3, label: '清淡晚餐', time: '18:30', active: true }]
  }));
  
  const [dailyLogs, setDailyLogs] = useState(() => getStorageVal('dailyLogs', {}));
  const [showAnalysis, setShowAnalysis] = useState<any>(null);

  useEffect(() => setStorageVal('profile', userProfile), [userProfile]);
  useEffect(() => setStorageVal('dailyLogs', dailyLogs), [dailyLogs]);

  const targets = useMemo(() => {
    const w = userProfile.weight || 60;
    if (userProfile.mode === 'CUSTOM') return userProfile.customTargets;
    const m = userProfile.mode === 'FITNESS' ? { p: 1.6, c: 5.0, f: 1.0 } : { p: 1.0, c: 4.0, f: 0.8 };
    return { p: Math.round(w * m.p), c: Math.round(w * m.c), f: Math.round(w * m.f) };
  }, [userProfile]);

  const todayData = useMemo(() => dailyLogs[currentDate] || { meals: [], energy: 3, feeling: '', submitted: false, plans: [] }, [dailyLogs, currentDate]);
  const totals = useMemo(() => todayData.meals.reduce((acc: any, m: any) => ({ p: acc.p + Number(m.p), c: acc.c + Number(m.c), f: acc.f + Number(m.f) }), { p: 0, c: 0, f: 0 }), [todayData.meals]);

  const handleUpdateLog = (newData: any) => {
    setDailyLogs((prev: any) => ({ ...prev, [currentDate]: { ...todayData, ...newData } }));
  };

  const handleAddMeal = (mealData: any) => {
    const updatedMeals = [...todayData.meals, { ...mealData, id: Date.now() }];
    handleUpdateLog({ meals: updatedMeals });
    const pGap = Math.round(targets.p - (totals.p + Number(mealData.p)));
    const adviceText = pGap > 0 ? `💪 蛋白质缺口还剩 ${pGap}g。下一餐建议补充优质白肉补给。` : "🥗 核心蛋白质目标已达成！自律且强大。";
    setShowAnalysis({ p: mealData.p, c: mealData.c, f: mealData.f, advice: adviceText });
  };

  const handleAddMealToPlan = (text: string) => {
    const currentPlans = todayData.plans || [];
    handleUpdateLog({ plans: [...currentPlans, { text, done: false }] });
    setActiveTab('planner'); 
  };

  return (
    <div className="min-h-screen bg-[#FFFDFB] text-[#2D241E] pb-24 font-sans selection:bg-amber-100">
      <header className="px-6 pt-10 pb-4 flex justify-between items-center bg-white/60 sticky top-0 z-40 backdrop-blur-md border-b border-gray-50">
        <h1 className="text-xl font-black flex items-center gap-2 text-left"><div className="w-8 h-8 bg-[#E89E5B] rounded-xl flex items-center justify-center text-white shadow-sm shadow-orange-100"><Zap size={18} fill="currentColor" /></div>轻食高能</h1>
        <button onClick={() => setActiveTab('settings')} className="text-[#A68B6D] transition-transform active:rotate-90 hover:text-amber-50"><Settings size={22} /></button>
      </header>
      <main className="px-6 space-y-8 mt-4 text-center sm:text-left">
        {activeTab === 'dashboard' && <Dashboard targets={targets} totals={totals} todayData={todayData} currentDate={currentDate} onAdd={handleAddMeal} onUpdateMeals={(m: any) => handleUpdateLog({ meals: m })} onUpdateLog={handleUpdateLog} />}
        {activeTab === 'planner' && <Planner dailyLogs={dailyLogs} currentDate={currentDate} setCurrentDate={setCurrentDate} targets={targets} onUpdatePlans={(p: any) => handleUpdateLog({ plans: p })} />}
        {activeTab === 'recipe' && <EnergyStation targets={targets} totals={totals} onAddMealToPlan={handleAddMealToPlan} />}
        {activeTab === 'library' && <Library />}
        {activeTab === 'settings' && <SettingsView userProfile={userProfile} setUserProfile={setUserProfile} dailyLogs={dailyLogs} />}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-[#F3E9DF] px-8 py-4 flex justify-between items-center z-40">
        <NavBtn active={activeTab === 'dashboard'} icon={Utensils} label="饮食" onClick={() => setActiveTab('dashboard')} />
        <NavBtn active={activeTab === 'planner'} icon={CalendarIcon} label="计划" onClick={() => setActiveTab('planner')} />
        <div className="relative -top-6"><button onClick={() => setActiveTab('recipe')} className="w-14 h-14 bg-[#E89E5B] rounded-[1.5rem] flex items-center justify-center text-white shadow-xl rotate-12 active:scale-95 shadow-orange-100 hover:scale-105 transition-transform"><Zap className="-rotate-12" fill="currentColor" /></button></div>
        <NavBtn active={activeTab === 'library'} icon={BookOpen} label="知识" onClick={() => setActiveTab('library')} />
        <NavBtn active={activeTab === 'settings'} icon={Settings} label="我的" onClick={() => setActiveTab('settings')} />
      </nav>
      {showAnalysis && <AnalysisPopup data={showAnalysis} onClose={() => setShowAnalysis(null)} />}
    </div>
  );
}
