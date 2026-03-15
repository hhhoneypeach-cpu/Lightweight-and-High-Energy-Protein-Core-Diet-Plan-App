import React from 'react';
import { Leaf, Info, BookOpen, Globe, FileText, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { PagodaGraphic } from './UI';

export function Library() {
  return (
    <div className="space-y-8 animate-in fade-in pb-20">
      <section className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-[#F3E9DF]">
        <div className="p-6 pb-2 text-left"><h2 className="text-lg font-black text-gray-800 flex items-center gap-2"><Leaf className="text-emerald-500" size={20} /> 中国居民平衡膳食宝塔 (2025)</h2></div>
        <div className="p-8 pt-2 flex flex-col items-center">
           <PagodaGraphic />
           <div className="mt-6 bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3 text-left shadow-inner">
             <Info className="text-amber-500 shrink-0 mt-0.5" size={16} />
             <p className="text-[11px] text-amber-900 leading-relaxed font-medium"><strong>核心指引：</strong> 食物多样，谷类为主。多吃蔬果、奶类、大豆；适量吃鱼、禽、蛋、瘦肉。少盐少油。</p>
           </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-black text-gray-800 px-2 flex items-center gap-2 text-left"><BookOpen size={18} className="text-amber-500" /> 权威资料直达 </h3>
        <a href="http://dg.cnsoc.org/" target="_blank" rel="noopener noreferrer" className="block bg-white p-6 rounded-[2.2rem] shadow-sm border border-[#F3E9DF] group hover:border-amber-400 transition-all active:scale-[0.98] shadow-gray-100/50 text-left">
          <div className="flex justify-between items-center"><div className="flex items-center gap-4 text-left"><div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:bg-amber-100"><Globe size={24} /></div><div><h4 className="font-black text-gray-800 text-sm text-left">中国居民膳食指南官网</h4><p className="text-[10px] text-gray-400 font-bold mt-1 tracking-tight text-left">查阅最新的国家膳食标准与科普 </p></div></div><ArrowRight size={18} className="text-gray-300 group-hover:text-amber-500 transition-transform group-hover:translate-x-1" /></div>
        </a>
        <a href="https://www.who.int/health-topics/nutrition" target="_blank" rel="noopener noreferrer" className="block bg-white p-6 rounded-[2.2rem] shadow-sm border border-[#F3E9DF] group hover:border-blue-400 transition-all active:scale-[0.98] shadow-gray-100/50 text-left">
          <div className="flex justify-between items-center"><div className="flex items-center gap-4 text-left"><div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-100"><FileText size={24} /></div><div><h4 className="font-black text-gray-800 text-sm text-left">联合国 WHO 营养指南 </h4><p className="text-[10px] text-gray-400 font-bold mt-1 tracking-tight text-left">世界卫生组织全球公共卫生建议 </p></div></div><ArrowRight size={18} className="text-gray-300 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" /></div>
        </a>
      </section>

      <section className="bg-gradient-to-br from-[#2D241E] to-[#4A3F35] p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden text-left">
        <Sparkles className="absolute -right-4 -top-4 text-amber-500/20 w-32 h-32 rotate-12" />
        <h4 className="font-black text-amber-400 mb-4 flex items-center gap-2"><Zap size={18} /> 高能知识贴士 </h4>
        <ul className="space-y-4 text-xs font-medium leading-relaxed opacity-90 text-left">
          <li className="flex gap-2"><span className="text-amber-500 font-black">◆ </span><span>蛋白质的“完全性”：大豆、肉类、蛋奶属于优质蛋白质，包含所有必需氨基酸。</span></li>
          <li className="flex gap-2"><span className="text-amber-500 font-black">◆ </span><span>餐盘法则：一半蔬菜、四分之一蛋白质、四分之一谷物，是长效控糖的黄金比例。</span></li>
        </ul>
      </section>
    </div>
  );
}
