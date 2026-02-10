
import React from 'react';
import { MatchState } from '../types';

interface Props {
  match: MatchState;
  onNewMatch: () => void;
  formatTime: (s: number) => string;
}

const MatchSummary: React.FC<Props> = ({ match, onNewMatch, formatTime }) => {
  const winner = match.winner === 'red' ? match.red : match.green;
  const loser = match.winner === 'red' ? match.green : match.red;

  return (
    <div className="flex-1 bg-background-dark font-display text-white p-10 lg:p-20 overflow-y-auto">
      <div className="max-w-[1440px] mx-auto w-full">
        {/* Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 p-8 rounded-2xl bg-[#192633] border border-[#233648] shadow-sm">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-green-500/10 text-green-500 border border-green-500/20">
                  Match Complete
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase bg-primary/10 text-primary border border-primary/20">
                  {match.winMethod}
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight">
              <span className={match.winner === 'red' ? 'text-red-500' : 'text-green-500'}>{winner.name}</span> Defeats <span className={match.winner === 'red' ? 'text-green-500' : 'text-red-500'}>{loser.name}</span>
            </h1>
            <p className="text-[#92adc9] text-lg font-medium">Final Result: {match.winMethod}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <div className="text-6xl font-black">{match.red.score} - {match.green.score}</div>
              <div className="text-sm font-semibold text-[#507a95] uppercase tracking-widest">Score at Finish</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Box Score */}
            <div className="bg-[#192633] rounded-2xl border border-[#233648] overflow-hidden shadow-sm">
              <div className="p-5 border-b border-[#233648] flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">analytics</span>
                <h2 className="text-xl font-bold">Box Score</h2>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#111a22] text-[#92adc9] text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Wrestler</th>
                    <th className="px-6 py-4 text-right">Total Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#233648]">
                  {[match.red, match.green].map(w => (
                    <tr key={w.color} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-8 rounded-full ${w.color === 'red' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                          <div>
                            <p className="font-bold text-white">{w.name}</p>
                            <p className="text-xs text-[#92adc9]">{w.school}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className={`inline-flex items-center justify-center px-4 py-1 rounded font-bold text-2xl ${w.score === Math.max(match.red.score, match.green.score) ? 'bg-primary' : 'bg-[#233648]'}`}>{w.score}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={onNewMatch}
                className="flex-1 min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-6 bg-primary text-white text-lg font-black uppercase transition-all hover:bg-primary/90 hover:scale-[1.02] shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined mr-2">add_circle</span> New Match
              </button>
              <button className="flex-1 min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-6 bg-[#233648] text-white text-lg font-black uppercase border border-transparent hover:bg-[#324d67] transition-all">
                <span className="material-symbols-outlined mr-2">download</span> Export Results
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#192633] rounded-2xl border border-[#233648] h-full flex flex-col shadow-sm">
              <div className="p-5 border-b border-[#233648] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">history</span>
                  <h2 className="text-xl font-bold">Full Match Log</h2>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-6 max-h-[600px]">
                {match.logs.map((log, idx) => (
                  <div key={log.id} className="relative pl-8 before:absolute before:left-[11px] before:top-2 before:bottom-[-24px] before:w-[2px] before:bg-[#233648] last:before:hidden">
                    <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-[#192633] z-10 ${log.wrestlerColor === 'red' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-bold uppercase ${log.wrestlerColor === 'red' ? 'text-red-500' : 'text-green-500'}`}>{log.action}</span>
                        <span className="text-xs font-medium text-slate-400">P{log.period} - {log.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchSummary;
