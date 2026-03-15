import React from 'react';

export function ProgressCircle({ size, stroke, percent, color }: { size: number, stroke: number, percent: number, color: string }) {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(100, percent) / 100) * circumference;
  return (
    <svg width={size} height={size} className="transform -rotate-90 transition-all duration-700">
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#F8F3F0" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
    </svg>
  );
}

export function PagodaGraphic() {
  return (
    <svg viewBox="0 0 400 450" className="w-full h-auto">
      <path d="M200 10 L240 70 L160 70 Z" fill="#F9FAFB" />
      <text x="200" y="60" textAnchor="middle" fontSize="8.5" fontWeight="900" fill="#374151">🧂 盐 &lt;5g | 🛢️ 油 25-30g</text>

      <path d="M160 72 L240 72 L260 125 L140 125 Z" fill="#F5F3FF" />
      <text x="200" y="105" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#5B21B6">🥛 奶/🥜 豆: 350-500g</text>

      <path d="M140 127 L260 127 L285 185 L115 185 Z" fill="#FEF2F2" />
      <text x="200" y="165" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#991B1B">🥩 鱼肉蛋: 120-200g</text>

      <path d="M115 187 L285 187 L315 250 L85 250 Z" fill="#F0FDF4" />
      <text x="200" y="225" textAnchor="middle" fontSize="10" fontWeight="900" fill="#166534">🥦 蔬菜类: 300-500g</text>

      <path d="M85 252 L315 252 L345 315 L55 315 Z" fill="#FFF1F2" />
      <text x="200" y="290" textAnchor="middle" fontSize="10" fontWeight="900" fill="#BE123C">🍎 水果类: 200-350g</text>

      <path d="M55 317 L345 317 L385 400 L15 400 Z" fill="#FFFBEB" />
      <text x="200" y="365" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#92400E">🥣 谷薯类: 200-300g</text>

      <path d="M15 405 L385 405 L400 450 L0 450 Z" fill="#F0F9FF" />
      <text x="200" y="432" textAnchor="middle" fontSize="11" fontWeight="900" fill="#0369A1">💧 水: 1.7L & 🏃 运动 (6k步+)</text>
    </svg>
  );
}

export function GapPill({ label, val, color }: { label: string, val: number, color: string }) {
  return (
    <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100/50 flex flex-col items-center flex-1 shadow-inner overflow-hidden">
      <p className="text-[8px] font-black text-gray-300 mb-1 text-center uppercase truncate w-full">{label}</p>
      <div className="flex items-baseline gap-0.5"><span className="text-sm font-black" style={{ color }}>{val}</span><span className="text-[8px] font-bold text-gray-300">g</span></div>
    </div>
  );
}

export function NavBtn({ active, icon: Icon, label, onClick }: { active: boolean, icon: any, label: string, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-[#2D241E] scale-110' : 'text-[#A68B6D] opacity-40 hover:opacity-70'}`}>
      <Icon size={22} strokeWidth={active ? 2.5 : 2} />
      <span className="text-[10px] font-black uppercase tracking-tight">{label}</span>
    </button>
  );
}

export function MacroStat({ label, cur, tar, color }: { label: string, cur: number, tar: number, color: string }) {
  return (
    <div className="text-center group">
       <p className="text-[10px] font-black text-gray-400 mb-1 tracking-tighter uppercase">{label}</p>
       <p className="text-sm font-black transition-all" style={{ color }}>{Math.round(cur)}<span className="text-[10px] text-gray-300 font-normal lowercase">/{tar}g</span></p>
    </div>
  );
}
