import React, { useState, useMemo } from 'react';
import { ChefHat, Search, Plus, ChevronDown, ChevronUp, ShoppingBag, CheckCircle2, Trophy, Sun, CloudSun, Moon, Scale } from 'lucide-react';
import { COLORS, MASTER_RECIPE_DB } from '../constants';
import { GapPill } from './UI';

export function EnergyStation({ targets, totals, onAddMealToPlan }: any) {
  const [inventory, setInventory] = useState('');
  const [matches, setMatches] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<number | string | null>(null);
  const [recommendType, setRecommendType] = useState('noon');

  const gaps = useMemo(() => ({
    p: Math.max(0, targets.p - totals.p),
    c: Math.max(0, targets.c - totals.c),
    f: Math.max(0, targets.f - totals.f),
  }), [targets, totals]);

  const handleMatch = () => {
    const inputKeywords = inventory.split(/[，\s,]+/).map(i => i.trim()).filter(i => i.length > 0);
    if (inputKeywords.length === 0) { setMatches([]); return; }
    const results = MASTER_RECIPE_DB.map(recipe => {
      const missing = recipe.ingredients.filter(ing => 
        !inputKeywords.some(kw => kw.toLowerCase().includes(ing.name.toLowerCase()) || ing.name.toLowerCase().includes(kw.toLowerCase()))
      );
      let score = inputKeywords.some(kw => recipe.name.toLowerCase().includes(kw.toLowerCase())) ? 3000 : 0;
      score += (recipe.ingredients.length - missing.length) * 1000;
      return score > 0 ? { ...recipe, missing, score } : null;
    })
    .filter(Boolean)
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 15); 
    setMatches(results);
  };

  const filteredRecommend = useMemo(() => MASTER_RECIPE_DB.filter(r => r.type === recommendType), [recommendType]);

  return (
    <div className="space-y-6 animate-in fade-in pb-20">
      <section className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-[#F3E9DF]">
        <div className="flex items-center gap-3 mb-6 text-left"><div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600"><ChefHat size={20}/></div><div><h2 className="text-lg font-black text-gray-800">补给引擎</h2><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">一键加入计划</p></div></div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <GapPill label="蛋白质缺口" val={gaps.p} color={COLORS.p} />
          <GapPill label="碳水缺口" val={gaps.c} color={COLORS.c} />
          <GapPill label="脂肪剩余" val={gaps.f} color={COLORS.f} />
        </div>
      </section>

      <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-[#F3E9DF] space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 bg-gray-50 rounded-2xl flex items-center px-4 py-3 shadow-inner border border-transparent focus-within:border-amber-200 transition-all text-left">
            <Search size={16} className="text-gray-300 mr-2" />
            <input placeholder="现有食材（如：虾, 蛋）" className="bg-transparent border-none outline-none text-sm w-full font-bold placeholder:font-normal placeholder:text-gray-300" value={inventory} onChange={e => setInventory(e.target.value)} />
          </div>
          <button onClick={handleMatch} className="bg-[#2D241E] text-white px-5 rounded-2xl text-xs font-black shadow-lg shadow-orange-100 active:scale-95 transition-transform">匹配方案</button>
        </div>
      </section>

      {matches.map(r => (
        <div key={`match-${r.id}`} className="bg-white rounded-[2rem] border p-6 border-amber-200 shadow-md text-left">
           <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2"><span className="text-xl">{r.emoji}</span><h4 className="font-black text-md text-[#2D241E]">{r.name}</h4></div>
              <button onClick={() => onAddMealToPlan(`吃 ${r.name}`)} className="p-2 bg-amber-500 text-white rounded-xl shadow-sm active:scale-90 transition-transform"><Plus size={18} /></button>
           </div>
           <div className="mt-4 pt-4 border-t border-dashed border-gray-100 flex items-center justify-between">
              {r.missing.length > 0 ? (<div className="flex items-center gap-1 text-red-400 font-bold text-[9px]"><ShoppingBag size={12} />缺: {r.missing.map((m: any)=>m.name).join(', ')}</div>) : (<div className="flex items-center gap-1 text-emerald-500 font-bold text-[9px] uppercase tracking-tighter"><CheckCircle2 size={12} />食材齐备</div>)}
              <button onClick={() => setExpandedId(expandedId === r.id ? null : r.id)} className="text-[9px] font-black text-gray-400 hover:text-amber-500 transition-colors">{expandedId === r.id ? <><ChevronUp size={12}/> 收起 </> : <><ChevronDown size={12}/> 查看步骤 </>}</button>
           </div>
           {expandedId === r.id && (
            <div className="mt-4 p-4 bg-amber-50/40 rounded-2xl text-[10px] text-amber-900 leading-relaxed animate-in slide-in-from-top-2 text-left">
              <p className="font-bold mb-1 text-amber-700">食材明细：</p>
              <ul className="mb-2 list-disc list-inside">{r.ingredients.map((ing: any, i: number) => <li key={i}>{ing.name} {ing.amt}</li>)}</ul>
              <p className="font-bold mb-1 text-amber-700">做法步骤：</p>
              <p>{r.steps}</p>
            </div>
           )}
        </div>
      ))}

      <section className="space-y-6 pt-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="font-black text-lg text-gray-800 flex items-center gap-2 text-left"><Trophy size={18} className="text-amber-500" /> 推荐食谱库 </h3>
          <div className="flex bg-gray-100 p-1 rounded-xl gap-1 shadow-inner">
             <button onClick={() => setRecommendType('morning')} className={`p-2 rounded-lg transition-all ${recommendType === 'morning' ? 'bg-white shadow-sm text-amber-500 scale-105' : 'text-gray-400'}`}><Sun size={16}/></button>
             <button onClick={() => setRecommendType('noon')} className={`p-2 rounded-lg transition-all ${recommendType === 'noon' ? 'bg-white shadow-sm text-amber-600 scale-105' : 'text-gray-400'}`}><CloudSun size={16}/></button>
             <button onClick={() => setRecommendType('night')} className={`p-2 rounded-lg transition-all ${recommendType === 'night' ? 'bg-white shadow-sm text-blue-500 scale-105' : 'text-gray-400'}`}><Moon size={16}/></button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {filteredRecommend.map((r) => (
            <div key={`rec-${r.id}`} className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#F3E9DF] group transition-all hover:border-amber-200 text-left">
               <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:bg-amber-50">{r.emoji}</div>
                     <div><h4 className="font-black text-md text-gray-800">{r.name}</h4><div className="flex gap-2 mt-1 text-[8px] font-bold text-amber-600 tracking-tighter uppercase">P+{r.p}g C+{r.c}g F+{r.f}g</div></div>
                  </div>
                  <button onClick={() => onAddMealToPlan(`吃 ${r.name}`)} className="p-2 bg-[#2D241E] text-white rounded-xl active:scale-90 transition-transform"><Plus size={16} /></button>
               </div>
               <div className="bg-gray-50 p-4 rounded-2xl mb-4 text-left"><p className="text-[10px] font-black text-gray-400 mb-1 flex items-center gap-1 uppercase tracking-widest text-left"><Scale size={10}/> 推荐食材用量 </p><p className="text-xs text-gray-600 font-bold leading-relaxed text-left">{r.ingredients.map((i: any)=>`${i.name} ${i.amt}`).join('、')}</p></div>
               <button onClick={() => setExpandedId(expandedId === `rec-exp-${r.id}` ? null : `rec-exp-${r.id}`)} className="text-[10px] font-black text-gray-400 hover:text-amber-500 flex items-center gap-1 transition-colors">{expandedId === `rec-exp-${r.id}` ? <ChevronUp size={12}/> : <ChevronDown size={12}/>} 查看精细做法 </button>
               {expandedId === `rec-exp-${r.id}` && (
                <div className="mt-4 p-4 bg-amber-50/40 rounded-2xl text-[10px] leading-relaxed text-amber-900 border border-amber-100 animate-in slide-in-from-top-2 text-left">
                  <p className="font-bold mb-1 text-amber-700">做法步骤：</p>
                  <p>{r.steps}</p>
                </div>
               )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
