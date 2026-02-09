
import React, { useState, useEffect, useCallback } from 'react';
import { MatchStatus, MatchState, Period, Position, MatchLogEntry, Wrestler } from './types';
import MatchSetup from './components/MatchSetup';
import MatchDashboard from './components/MatchDashboard';
import MatchSummary from './components/MatchSummary';

const INITIAL_WRESTLER = (color: 'red' | 'green'): Wrestler => ({
  name: '',
  school: '',
  score: 0,
  color,
  stallingCount: 0,
  cautionCount: 0,
  stats: {
    takedowns: 0,
    escapes: 0,
    reversals: 0,
    nearFall2: 0,
    nearFall3: 0,
    nearFall4: 0,
    cautions: 0,
    stalling: 0,
  }
});

const PERIOD_DURATIONS: Record<Period, number> = {
  [Period.P1]: 180, // 3:00
  [Period.P2]: 120, // 2:00
  [Period.P3]: 120, // 2:00
  [Period.OT]: 60,  // 1:00
  [Period.TB]: 30,  // 0:30
};

const App: React.FC = () => {
  const [match, setMatch] = useState<MatchState>({
    status: MatchStatus.SETUP,
    red: INITIAL_WRESTLER('red'),
    green: INITIAL_WRESTLER('green'),
    currentPeriod: Period.P1,
    matchClock: 180,
    ridingTime: 0,
    position: Position.NEUTRAL,
    isRunning: false,
    logs: [],
  });

  // Timers Effect
  useEffect(() => {
    let interval: number;
    if (match.isRunning && match.matchClock > 0) {
      interval = window.setInterval(() => {
        setMatch(prev => {
          const nextClock = Math.max(0, prev.matchClock - 1);
          let nextRiding = prev.ridingTime;

          if (prev.position === Position.RED_TOP) {
            nextRiding += 1;
          } else if (prev.position === Position.GREEN_TOP) {
            nextRiding -= 1;
          }

          return {
            ...prev,
            matchClock: nextClock,
            ridingTime: nextRiding,
            isRunning: nextClock > 0,
          };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [match.isRunning, match.matchClock]);

  const handleStartMatch = (red: {name: string, school: string}, green: {name: string, school: string}) => {
    setMatch(prev => ({
      ...prev,
      status: MatchStatus.IN_PROGRESS,
      red: { ...prev.red, ...red },
      green: { ...prev.green, ...green },
    }));
  };

  const addLog = (action: string, points: number, color: 'red' | 'green' | 'neutral') => {
    const newLog: MatchLogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: formatTime(match.matchClock),
      period: match.currentPeriod,
      action,
      points,
      wrestlerColor: color,
    };
    setMatch(prev => ({ ...prev, logs: [newLog, ...prev.logs] }));
  };

  const updateScore = (color: 'red' | 'green', points: number, actionName: string) => {
    setMatch(prev => {
      const wrestler = color === 'red' ? prev.red : prev.green;
      const updatedWrestler = {
        ...wrestler,
        score: wrestler.score + points,
      };

      // Automatic position logic
      let nextPos = prev.position;
      if (actionName === 'Takedown') {
        nextPos = color === 'red' ? Position.RED_TOP : Position.GREEN_TOP;
      } else if (actionName === 'Escape') {
        nextPos = Position.NEUTRAL;
      } else if (actionName === 'Reversal') {
        nextPos = color === 'red' ? Position.RED_TOP : Position.GREEN_TOP;
      }

      return {
        ...prev,
        [color]: updatedWrestler,
        position: nextPos,
      };
    });
    addLog(`${actionName} (+${points})`, points, color);
  };

  const handleStalling = (wrestlerColor: 'red' | 'green') => {
    setMatch(prev => {
      const targetWrestler = wrestlerColor === 'red' ? prev.red : prev.green;
      const opponentColor = wrestlerColor === 'red' ? 'green' : 'red';
      const opponent = wrestlerColor === 'red' ? prev.green : prev.red;
      
      const newStallingCount = targetWrestler.stallingCount + 1;
      let pointsToOpponent = 0;
      let isDQ = false;

      // NCAA Rules: 1st warning, 2nd & 3rd are 1pt, 4th is 2pt, 5th is DQ
      if (newStallingCount === 1) pointsToOpponent = 0;
      else if (newStallingCount === 2 || newStallingCount === 3) pointsToOpponent = 1;
      else if (newStallingCount === 4) pointsToOpponent = 2;
      else if (newStallingCount >= 5) isDQ = true;

      const updatedTarget = { ...targetWrestler, stallingCount: newStallingCount };
      const updatedOpponent = { ...opponent, score: opponent.score + pointsToOpponent };

      if (isDQ) {
        return {
          ...prev,
          status: MatchStatus.FINISHED,
          winner: opponentColor as 'red' | 'green',
          winMethod: 'Disqualification (Stalling)',
          isRunning: false,
          [wrestlerColor]: updatedTarget,
          [opponentColor]: updatedOpponent
        };
      }

      const logAction = newStallingCount === 1 ? 'Stalling Warning' : `Stalling Penalty (+${pointsToOpponent} to Opponent)`;
      
      // We manually add the log after this because setMatch state isn't finished yet
      // but we need the current points calculation.
      return {
        ...prev,
        [wrestlerColor]: updatedTarget,
        [opponentColor]: updatedOpponent,
        logs: [{
          id: Math.random().toString(36).substr(2, 9),
          timestamp: formatTime(prev.matchClock),
          period: prev.currentPeriod,
          action: logAction,
          points: pointsToOpponent,
          wrestlerColor: wrestlerColor,
        }, ...prev.logs]
      };
    });
  };

  const handleCaution = (wrestlerColor: 'red' | 'green') => {
    setMatch(prev => {
      const targetWrestler = wrestlerColor === 'red' ? prev.red : prev.green;
      const opponentColor = wrestlerColor === 'red' ? 'green' : 'red';
      const opponent = wrestlerColor === 'red' ? prev.green : prev.red;
      
      const newCautionCount = targetWrestler.cautionCount + 1;
      let pointsToOpponent = 0;

      // NCAA Rules: 1st & 2nd cautions are warning, 3rd and subsequent are 1pt
      if (newCautionCount >= 3) pointsToOpponent = 1;

      const updatedTarget = { ...targetWrestler, cautionCount: newCautionCount };
      const updatedOpponent = { ...opponent, score: opponent.score + pointsToOpponent };

      const logAction = newCautionCount < 3 ? 'Caution' : `Caution Penalty (+${pointsToOpponent} to Opponent)`;

      return {
        ...prev,
        [wrestlerColor]: updatedTarget,
        [opponentColor]: updatedOpponent,
        logs: [{
          id: Math.random().toString(36).substr(2, 9),
          timestamp: formatTime(prev.matchClock),
          period: prev.currentPeriod,
          action: logAction,
          points: pointsToOpponent,
          wrestlerColor: wrestlerColor,
        }, ...prev.logs]
      };
    });
  };

  const handleUndo = () => {
    // Basic undo implementation for this MVP
    if (match.logs.length === 0) return;
    const lastLog = match.logs[0];
    
    setMatch(prev => {
      const newLogs = prev.logs.slice(1);
      const color = lastLog.wrestlerColor;
      const points = lastLog.points;

      if (color === 'neutral') return { ...prev, logs: newLogs };

      const opponentColor = color === 'red' ? 'green' : 'red';
      const targetWrestler = color === 'red' ? prev.red : prev.green;
      const opponent = color === 'red' ? prev.green : prev.red;

      // Handle specific penalty reversals
      let updatedTarget = { ...targetWrestler };
      let updatedOpponent = { ...opponent };

      if (lastLog.action.includes('Stalling')) {
        updatedTarget.stallingCount = Math.max(0, updatedTarget.stallingCount - 1);
        updatedOpponent.score = Math.max(0, updatedOpponent.score - points);
      } else if (lastLog.action.includes('Caution')) {
        updatedTarget.cautionCount = Math.max(0, updatedTarget.cautionCount - 1);
        updatedOpponent.score = Math.max(0, updatedOpponent.score - points);
      } else {
        // Standard score undo
        updatedTarget.score = Math.max(0, targetWrestler.score - points);
      }

      return {
        ...prev,
        [color]: updatedTarget,
        [opponentColor]: updatedOpponent,
        logs: newLogs
      };
    });
  };

  const setPeriod = (p: Period) => {
    setMatch(prev => ({
      ...prev,
      currentPeriod: p,
      matchClock: PERIOD_DURATIONS[p],
      isRunning: false
    }));
  };

  const setPosition = (pos: Position) => {
    setMatch(prev => ({ ...prev, position: pos }));
  };

  const toggleClock = () => {
    setMatch(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(Math.abs(seconds) / 60);
    const s = Math.abs(seconds) % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const finalizeMatch = (winner: 'red' | 'green', method: string) => {
    setMatch(prev => ({
      ...prev,
      status: MatchStatus.FINISHED,
      winner,
      winMethod: method,
      isRunning: false
    }));
  };

  const resetToSetup = () => {
    setMatch({
      status: MatchStatus.SETUP,
      red: INITIAL_WRESTLER('red'),
      green: INITIAL_WRESTLER('green'),
      currentPeriod: Period.P1,
      matchClock: 180,
      ridingTime: 0,
      position: Position.NEUTRAL,
      isRunning: false,
      logs: [],
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {match.status === MatchStatus.SETUP && (
        <MatchSetup onStart={handleStartMatch} />
      )}
      {match.status === MatchStatus.IN_PROGRESS && (
        <MatchDashboard 
          match={match}
          onUpdateScore={updateScore}
          onToggleClock={toggleClock}
          onSetPeriod={setPeriod}
          onSetPosition={setPosition}
          onEndMatch={finalizeMatch}
          onStalling={handleStalling}
          onCaution={handleCaution}
          onUndo={handleUndo}
          formatTime={formatTime}
        />
      )}
      {match.status === MatchStatus.FINISHED && (
        <MatchSummary match={match} onNewMatch={resetToSetup} formatTime={formatTime} />
      )}
    </div>
  );
};

export default App;
