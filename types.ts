
export enum MatchStatus {
  SETUP = 'SETUP',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED'
}

export enum Period {
  P1 = '1',
  P2 = '2',
  P3 = '3',
  OT = 'OT',
  TB = 'TB'
}

export enum Position {
  NEUTRAL = 'NEUTRAL',
  RED_TOP = 'RED_TOP',
  GREEN_TOP = 'GREEN_TOP'
}

export interface Wrestler {
  name: string;
  school: string;
  score: number;
  color: 'red' | 'green';
  stallingCount: number;
  cautionCount: number;
  stats: {
    takedowns: number;
    escapes: number;
    reversals: number;
    nearFall2: number;
    nearFall3: number;
    nearFall4: number;
    cautions: number;
    stalling: number;
  };
}

export interface MatchLogEntry {
  id: string;
  timestamp: string;
  period: Period;
  action: string;
  points: number;
  wrestlerColor: 'red' | 'green' | 'neutral';
}

export interface MatchState {
  status: MatchStatus;
  red: Wrestler;
  green: Wrestler;
  currentPeriod: Period;
  matchClock: number; // in seconds
  ridingTime: number; // Net value: positive for red, negative for green
  position: Position;
  isRunning: boolean;
  logs: MatchLogEntry[];
  winner?: 'red' | 'green';
  winMethod?: string;
}
