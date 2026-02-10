
import React, { useState } from 'react';

interface Props {
  onStart: (red: {name: string, school: string}, green: {name: string, school: string}) => void;
}

const MatchSetup: React.FC<Props> = ({ onStart }) => {
  const [red, setRed] = useState({ name: '', school: '' });
  const [green, setGreen] = useState({ name: '', school: '' });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-background-dark">
      <header className="flex items-center justify-between px-10 py-4 bg-white dark:bg-[#111a22] border-b border-slate-200 dark:border-[#233648]">
        <div className="flex items-center gap-4">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined">sports_kabaddi</span>
          </div>
          <h2 className="text-lg font-bold">Wrestling Scorer Pro</h2>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-5xl font-extrabold tracking-tight mb-2">Match Setup</h1>
          <p className="text-slate-500 dark:text-[#92adc9] text-lg">Configure the contestants for this bout.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch relative">
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 size-14 rounded-full bg-slate-50 dark:bg-background-dark border-4 border-slate-200 dark:border-[#233648] items-center justify-center">
            <span className="text-xl font-black italic text-slate-400 dark:text-slate-600">VS</span>
          </div>

          {/* Red Corner */}
          <div className="flex flex-col rounded-2xl overflow-hidden border-2 border-transparent bg-white dark:bg-[#192633] shadow-xl ring-4 ring-red-500/10">
            <div className="h-3 bg-red-600"></div>
            <div className="p-8 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-red-600 text-3xl">shield</span>
                <h2 className="text-2xl font-bold text-red-600 uppercase tracking-widest">Red Corner</h2>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-500 uppercase">Wrestler Name</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">person</span>
                    <input 
                      value={red.name}
                      onChange={e => setRed({ ...red, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-[#324d67] bg-slate-50 dark:bg-[#101922] focus:ring-2 focus:ring-red-500 outline-none transition-all text-lg font-medium" 
                      placeholder="e.g. John Smith" 
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-500 uppercase">School / Affiliation</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">school</span>
                    <input 
                      value={red.school}
                      onChange={e => setRed({ ...red, school: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-[#324d67] bg-slate-50 dark:bg-[#101922] focus:ring-2 focus:ring-red-500 outline-none transition-all text-lg font-medium" 
                      placeholder="e.g. State University" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Green Corner */}
          <div className="flex flex-col rounded-2xl overflow-hidden border-2 border-transparent bg-white dark:bg-[#192633] shadow-xl ring-4 ring-green-500/10">
            <div className="h-3 bg-green-600"></div>
            <div className="p-8 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-green-600 text-3xl">shield</span>
                <h2 className="text-2xl font-bold text-green-600 uppercase tracking-widest">Green Corner</h2>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-500 uppercase">Wrestler Name</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">person</span>
                    <input 
                      value={green.name}
                      onChange={e => setGreen({ ...green, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-[#324d67] bg-slate-50 dark:bg-[#101922] focus:ring-2 focus:ring-green-500 outline-none transition-all text-lg font-medium" 
                      placeholder="e.g. David Jones" 
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-500 uppercase">School / Affiliation</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">school</span>
                    <input 
                      value={green.school}
                      onChange={e => setGreen({ ...green, school: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-[#324d67] bg-slate-50 dark:bg-[#101922] focus:ring-2 focus:ring-green-500 outline-none transition-all text-lg font-medium" 
                      placeholder="e.g. City College" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-6">
          <button 
            onClick={() => onStart(red, green)}
            className="w-full md:w-auto md:min-w-[320px] bg-primary hover:bg-primary/90 text-white py-5 px-10 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-primary/30"
          >
            <span className="material-symbols-outlined">play_circle</span>
            START MATCH
          </button>
          <div className="flex items-center gap-6 text-slate-400 text-sm font-medium">
            <div className="flex items-center gap-1"><span className="material-symbols-outlined text-lg">timer</span><span>7:00 Total</span></div>
            <div className="flex items-center gap-1"><span className="material-symbols-outlined text-lg">settings_suggest</span><span>Collegiate Rules</span></div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white dark:bg-[#0c141a] px-10 py-6 border-t border-slate-200 dark:border-[#233648]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500 uppercase tracking-widest">
          <div>Tournament: 2024 Eastern Regionals</div>
          <div className="flex items-center gap-4">
            <span>Mat 4</span>
            <span className="h-1 w-1 rounded-full bg-slate-400"></span>
            <span>Session 2</span>
            <span className="h-1 w-1 rounded-full bg-slate-400"></span>
            <span>Bout #142</span>
          </div>
          <div>Wrestling Scorer Pro v2.4.0</div>
        </div>
      </footer>
    </div>
  );
};

export default MatchSetup;
