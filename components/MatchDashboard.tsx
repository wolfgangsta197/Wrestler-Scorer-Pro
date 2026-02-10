
import React, { useState } from 'react';
import { MatchState, Period, Position, Wrestler } from '../types';

interface Props {
  match: MatchState;
  onUpdateScore: (color: 'red' | 'green', points: number, actionName: string) => void;
  onToggleClock: () => void;
  onSetPeriod: (p: Period) => void;
  onSetPosition: (pos: Position) => void;
  onEndMatch: (winner: 'red' | 'green', method: string) => void;
  onStalling: (color: 'red' | 'green') => void;
  onCaution: (color: 'red' | 'green') => void;
  onUndo: () => void;
  formatTime: (seconds: number) => string;
}

const MatchDashboard: React.FC<Props> = ({ 
  match, onUpdateScore, onToggleClock, onSetPeriod, onSetPosition, onEndMatch, onStalling, onCaution, onUndo, formatTime 
}) => {
  const [showLog, setShowLog] = useState(false);
  const [showChoiceModal, setShowChoiceModal] = useState(false);

  const getRidingTimeColor = () => {
    if (match.ridingTime > 0) return 'text-red-wrestling bg-red-wrestling/10 border-red-wrestling';
    if (match.ridingTime < 0) return 'text-green-wrestling bg-green-wrestling/10 border-green-wrestling';
    return 'text-slate-400 bg-slate-800 border-transparent';
  };

  return (
    <div className="flex-1 flex flex-col bg-background-dark text-slate-100 overflow-hidden relative">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#233648] px-6 py-4 bg-[#0a0f14] sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="size-8 text-primary">
            <span className="material-symbols-outlined text-4xl">sports_kabaddi</span>
          </div>
          <div>
            <h1 className="text-xl font-black uppercase italic leading-none">Wrestling Scorer <span className="text-primary">Pro</span></h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Collegiate Dual Mode</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-8">
            <button onClick={() => setShowChoiceModal(true)} className="text-xs font-bold uppercase tracking-wider hover:text-primary">Choice Assist</button>
            <a className="text-xs font-bold uppercase tracking-wider hover:text-primary" href="#">Rulebook</a>
          </div>
          <div className="flex gap-3">
            <button onClick={onUndo} className="flex min-w-[120px] items-center justify-center rounded-xl h-12 px-6 bg-[#233648] text-sm font-black uppercase tracking-tighter hover:brightness-110">
              <span className="material-symbols-outlined text-lg mr-2">undo</span><span>Undo</span>
            </button>
            <button 
              onClick={() => onEndMatch(match.red.score >= match.green.score ? 'red' : 'green', 'Decision')} 
              className="flex min-w-[120px] items-center justify-center rounded-xl h-12 px-6 bg-primary text-white text-sm font-black uppercase tracking-tighter hover:brightness-110 shadow-lg shadow-primary/20"
            >
              <span>End Match</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-6 gap-6 max-w-[1800px] mx-auto w-full overflow-y-auto">
        
        {/* Top Clock Section */}
        <div className="flex flex-col items-center justify-center py-6 bg-[#111a22] rounded-3xl border-2 border-[#233648] shadow-2xl">
          <div className="flex items-center gap-12">
            <div className="flex flex-col items-center">
              <div className="text-[#92adc9] text-xs font-black uppercase tracking-[0.4em] mb-4">Period {match.currentPeriod}</div>
              <div className="clock-mono text-[9rem] md:text-[10rem] font-black text-white leading-none tabular-nums drop-shadow-lg">
                {formatTime(match.matchClock)}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={onToggleClock}
                className={`rounded-2xl w-24 h-24 flex items-center justify-center shadow-2xl active:scale-95 transition-all ${match.isRunning ? 'bg-orange-500 shadow-orange-500/30' : 'bg-primary shadow-primary/40'}`}
              >
                <span className="material-symbols-outlined text-6xl">{match.isRunning ? 'pause' : 'play_arrow'}</span>
              </button>
              <div className="grid grid-cols-2 gap-2 w-24">
                {[Period.P1, Period.P2, Period.P3, Period.OT, Period.TB].map(p => (
                  <button 
                    key={p} 
                    onClick={() => onSetPeriod(p)}
                    className={`py-2 rounded-lg text-[9px] font-black uppercase transition-colors ${match.currentPeriod === p ? 'bg-primary text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                  >
                    {p === Period.OT ? 'OT' : p === Period.TB ? 'TB' : `P${p}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scoring Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px_1fr] gap-6 flex-1 min-h-[600px]">
          
          {/* Red Wrestler Column */}
          <WrestlerColumn 
            wrestler={match.red} 
            isLeading={match.red.score > match.green.score}
            onAction={(points, label) => onUpdateScore('red', points, label)}
            onFinalAction={(method) => onEndMatch('red', method)}
            onStalling={() => onStalling('red')}
            onCaution={() => onCaution('red')}
            ridingTime={match.ridingTime > 0 ? match.ridingTime : 0}
            formatTime={formatTime}
            isActiveAdvantage={match.ridingTime > 0}
          />

          {/* Center Column: Match Position & Referee Actions */}
          <div className="flex flex-col gap-6">
            <div className="flex-1 flex flex-col bg-[#111a22] rounded-3xl border-2 border-[#233648] shadow-2xl overflow-hidden" style={{ background: 'linear-gradient(180deg, #111a22 0%, #0a1118 100%)' }}>
              <div className="p-4 bg-slate-900/50 border-b border-white/5 text-center">
                <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Match Position</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                <div className="relative w-full h-full flex flex-col items-center justify-center gap-2">
                  <div className={`flex flex-col items-center transition-all duration-300 ${match.position === Position.RED_TOP ? 'scale-110' : 'opacity-40 scale-90'}`}>
                    <span className="material-symbols-outlined text-red-wrestling" style={{ fontSize: '100px', filter: 'drop-shadow(0 0 15px rgba(225,29,72,0.4))' }}>person</span>
                    <div className="text-[10px] font-black text-red-wrestling uppercase bg-red-wrestling/20 px-3 py-1 rounded-full border border-red-wrestling/40 mt-1">RED TOP</div>
                  </div>
                  <div className={`flex flex-col items-center transition-all duration-300 ${match.position === Position.GREEN_TOP ? 'scale-110' : 'opacity-40 scale-90'}`}>
                    <span className="material-symbols-outlined text-green-wrestling" style={{ fontSize: '100px', filter: 'drop-shadow(0 0 15px rgba(16,185,129,0.4))' }}>person</span>
                    <div className="text-[10px] font-black text-green-wrestling uppercase bg-green-wrestling/20 px-3 py-1 rounded-full border border-green-wrestling/40 mt-1">GRN TOP</div>
                  </div>
                  {match.position === Position.NEUTRAL && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="px-6 py-2 bg-slate-800/80 border border-white/10 rounded-xl text-xs font-black uppercase tracking-[0.3em]">Neutral Position</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6 bg-slate-900/50 border-t border-white/5">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex p-1 bg-slate-800 rounded-2xl">
                    <button 
                      onClick={() => onSetPosition(Position.NEUTRAL)}
                      className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all rounded-xl ${match.position === Position.NEUTRAL ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                      Neutral
                    </button>
                    <button className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white">Referee's</button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => onSetPosition(Position.RED_TOP)}
                      className={`py-4 text-[10px] font-black uppercase rounded-2xl border-2 transition-all ${match.position === Position.RED_TOP ? 'bg-red-wrestling/20 border-red-wrestling text-red-wrestling shadow-lg shadow-red-wrestling/10' : 'bg-slate-800 border-transparent text-slate-400'}`}
                    >
                      Red on Top
                    </button>
                    <button 
                      onClick={() => onSetPosition(Position.GREEN_TOP)}
                      className={`py-4 text-[10px] font-black uppercase rounded-2xl border-2 transition-all ${match.position === Position.GREEN_TOP ? 'bg-green-wrestling/20 border-green-wrestling text-green-wrestling shadow-lg shadow-green-wrestling/10' : 'bg-slate-800 border-transparent text-slate-400'}`}
                    >
                      Grn on Top
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Riding Time Advantage Single Display */}
            <div className="bg-[#111a22] rounded-3xl border border-[#233648] p-6 shadow-xl flex flex-col items-center">
              <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 text-center">Riding Time Advantage</h4>
              <div className={`flex items-center gap-4 px-10 py-5 rounded-2xl border-2 transition-all duration-500 ${getRidingTimeColor()}`}>
                <span className="material-symbols-outlined text-2xl">timer</span>
                <span className="text-4xl font-black clock-mono tabular-nums">{formatTime(match.ridingTime)}</span>
              </div>
              <p className="mt-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">
                {match.ridingTime > 0 ? "RED ADVANTAGE" : match.ridingTime < 0 ? "GREEN ADVANTAGE" : "NEUTRAL TIME"}
              </p>
            </div>
          </div>

          {/* Green Wrestler Column */}
          <WrestlerColumn 
            wrestler={match.green} 
            isLeading={match.green.score > match.red.score}
            onAction={(points, label) => onUpdateScore('green', points, label)}
            onFinalAction={(method) => onEndMatch('green', method)}
            onStalling={() => onStalling('green')}
            onCaution={() => onCaution('green')}
            ridingTime={match.ridingTime < 0 ? Math.abs(match.ridingTime) : 0}
            formatTime={formatTime}
            isActiveAdvantage={match.ridingTime < 0}
            isGreen
          />
        </div>

        {/* Bottom Utility Buttons */}
        <div className="flex gap-4 mb-2 overflow-x-auto pb-4">
          {[
            { icon: 'medical_services', label: 'Injury Time (01:30)', color: 'text-primary' },
            { icon: 'bloodtype', label: 'Blood Time (05:00)', color: 'text-red-500' },
            { icon: 'history', label: 'Match Log', color: 'text-slate-500' }
          ].map((util, i) => (
            <button key={i} onClick={() => util.icon === 'history' && setShowLog(true)} className="flex-1 min-w-[200px] flex items-center justify-center gap-3 p-4 bg-[#111a22] border-2 border-[#233648] rounded-2xl hover:bg-slate-800 transition-colors shadow-lg active:scale-95">
              <span className={`material-symbols-outlined ${util.color}`}>{util.icon}</span>
              <span className="font-black text-sm uppercase tracking-widest">{util.label}</span>
            </button>
          ))}
        </div>
      </main>

      {/* Choice Modal */}
      {showChoiceModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
          <div className="bg-[#192633] w-full max-w-3xl rounded-[2rem] border-4 border-primary shadow-2xl p-10 text-center">
            <h2 className="text-4xl font-black uppercase mb-2">Position Choice</h2>
            <p className="text-[#92adc9] mb-10 text-xl font-medium uppercase tracking-wide">Choice Assistance</p>
            <div className="grid grid-cols-3 gap-6">
              {['Neutral', 'Top', 'Bottom'].map(choice => (
                <button 
                  key={choice}
                  onClick={() => {
                    if (choice === 'Neutral') onSetPosition(Position.NEUTRAL);
                    else if (choice === 'Top') onSetPosition(Position.RED_TOP);
                    else onSetPosition(Position.GREEN_TOP);
                    setShowChoiceModal(false);
                  }}
                  className="flex flex-col items-center gap-6 p-10 rounded-3xl bg-[#233648] hover:bg-primary/20 border-2 border-transparent hover:border-primary transition-all"
                >
                  <span className="material-symbols-outlined text-6xl">person</span>
                  <span className="text-2xl font-black uppercase">{choice}</span>
                </button>
              ))}
            </div>
            <div className="mt-12 flex gap-4 justify-center">
              <button onClick={() => setShowChoiceModal(false)} className="px-10 py-4 bg-slate-700 rounded-2xl font-black text-sm uppercase">Defer / Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Log Drawer */}
      {showLog && (
        <div className="fixed inset-y-0 right-0 w-96 bg-[#192633] border-l border-[#233648] shadow-2xl z-[100] flex flex-col">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-black uppercase tracking-tight text-xl">Match Log</h3>
            <button onClick={() => setShowLog(false)} className="text-slate-400 hover:text-white"><span className="material-symbols-outlined">close</span></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {match.logs.map((log, i) => (
              <div key={log.id} className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                  <span className={log.wrestlerColor === 'red' ? 'text-red-500' : log.wrestlerColor === 'green' ? 'text-green-500' : 'text-slate-500'}>{log.wrestlerColor}</span>
                  <span className="text-slate-500">P{log.period} @ {log.timestamp}</span>
                </div>
                <p className="text-sm font-medium">{log.action}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Persistent Hotkeys Footer */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/90 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest backdrop-blur-md pointer-events-none z-[100] border border-white/10 shadow-2xl">
          HOTKEYS: [Space] Clock | [1-5] Period Selection | Wrestling Scorer Pro System
      </div>
    </div>
  );
};

interface WrestlerColProps {
  wrestler: Wrestler;
  isLeading: boolean;
  onAction: (points: number, label: string) => void;
  onFinalAction: (method: string) => void;
  onStalling: () => void;
  onCaution: () => void;
  ridingTime: number;
  formatTime: (s: number) => string;
  isActiveAdvantage: boolean;
  isGreen?: boolean;
}

const WrestlerColumn: React.FC<WrestlerColProps> = ({ 
  wrestler, isLeading, onAction, onFinalAction, onStalling, onCaution, ridingTime, formatTime, isActiveAdvantage, isGreen 
}) => {
  const colorHex = isGreen ? 'text-green-wrestling' : 'text-red-wrestling';
  const borderCol = isGreen ? 'border-r-[16px] border-green-wrestling' : 'border-l-[16px] border-red-wrestling';
  const bgCol = isGreen ? 'bg-green-wrestling/10' : 'bg-red-wrestling/10';
  const cornerLabel = isGreen ? 'Green Corner' : 'Red Corner';
  const cornerBg = isGreen ? 'bg-green-wrestling' : 'bg-red-wrestling';

  return (
    <div className={`flex flex-col rounded-3xl ${borderCol} bg-[#111a22] shadow-2xl overflow-hidden`}>
      <div className={`p-6 ${bgCol} flex justify-between items-start border-b border-white/5 ${isGreen ? 'flex-row-reverse text-right' : ''}`}>
        <div>
          <h3 className={`text-3xl font-black ${colorHex} uppercase tracking-tight italic`}>{wrestler.name || 'Wrestler Name'}</h3>
          <p className="text-slate-400 text-sm font-bold tracking-widest uppercase">{wrestler.school || 'School Name'}</p>
        </div>
        <div className={`${cornerBg} text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest h-fit`}>{cornerLabel}</div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-6">
        <div className={`text-[9rem] font-black text-white leading-none tabular-nums drop-shadow-2xl transition-transform duration-500 ${isLeading ? 'scale-110' : 'scale-100'}`}>
          {wrestler.score}
        </div>
      </div>

      {/* Penalty Indicators */}
      <div className="flex justify-center gap-4 px-6 pb-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-lg border border-white/10">
          <span className="text-[10px] font-black uppercase text-slate-500">Stall</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(n => (
              <div key={n} className={`w-2 h-2 rounded-full ${wrestler.stallingCount >= n ? 'bg-red-wrestling' : 'bg-slate-900'}`}></div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-lg border border-white/10">
          <span className="text-[10px] font-black uppercase text-slate-500">Caution</span>
          <div className="flex gap-1">
            {[1, 2, 3].map(n => (
              <div key={n} className={`w-2 h-2 rounded-full ${wrestler.cautionCount >= n ? 'bg-orange-500' : 'bg-slate-900'}`}></div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 p-6 bg-black/20">
        {[
          { p: 3, l: 'Takedown' }, { p: 1, l: 'Escape' }, { p: 2, l: 'Reversal' },
          { p: 2, l: 'Near Fall 2' }, { p: 3, l: 'Near Fall 3' }, { p: 4, l: 'Near Fall 4' }
        ].map(act => (
          <button 
            key={act.l}
            onClick={() => onAction(act.p, act.l)}
            className={`h-20 flex flex-col items-center justify-center bg-[#233648] border-2 border-transparent rounded-xl transition-all shadow-md active:scale-95 hover:border-current ${colorHex}`}
          >
            <span className="text-2xl font-black">+{act.p}</span>
            <span className="text-[9px] font-bold uppercase tracking-tight text-slate-500">{act.l}</span>
          </button>
        ))}

        <button 
          onClick={onStalling}
          className={`h-20 flex flex-col items-center justify-center bg-[#192633] border-2 border-transparent hover:border-red-wrestling rounded-xl transition-all shadow-md active:scale-95 text-red-wrestling`}
        >
          <span className="material-symbols-outlined">block</span>
          <span className="text-[9px] font-bold uppercase">Stalling</span>
        </button>

        <button 
          onClick={onCaution}
          className={`h-20 flex flex-col items-center justify-center bg-[#192633] border-2 border-transparent hover:border-orange-500 rounded-xl transition-all shadow-md active:scale-95 text-orange-500`}
        >
          <span className="material-symbols-outlined">warning</span>
          <span className="text-[9px] font-bold uppercase">Caution</span>
        </button>

        <button 
          onClick={() => onFinalAction('FALL (PIN)')}
          className={`col-span-1 h-20 flex flex-col items-center justify-center bg-[#192633] border-2 border-white/5 rounded-xl hover:border-current transition-all text-center ${colorHex}`}
        >
          <span className="material-symbols-outlined text-2xl">gavel</span>
          <span className="text-[9px] font-bold uppercase leading-tight">Pin</span>
        </button>
      </div>

      <div className={`p-4 ${bgCol} border-t border-white/5 flex items-center justify-between ${isGreen ? 'flex-row-reverse' : ''}`}>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Riding Time</span>
        <div className={`flex items-center gap-3 px-6 py-3 rounded-xl shadow-xl transition-all duration-300 ${isActiveAdvantage ? `${cornerBg} text-white shadow-current/20` : 'bg-slate-800 text-slate-400'}`}>
          <span className="material-symbols-outlined text-xl">timer</span>
          <span className="text-2xl font-black clock-mono tabular-nums">{isActiveAdvantage ? formatTime(ridingTime) : "0:00"}</span>
        </div>
      </div>
    </div>
  );
};

export default MatchDashboard;
