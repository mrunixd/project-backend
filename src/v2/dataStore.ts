import fs from 'fs';
import { SessionResultsReturn } from './quiz';
import { Status } from './player';

export interface QuizIds {
  quizId: number;
  name: string;
}
//SUS ONESSS
export interface GetDetailsReturn {
  user: {
    userId: number;
    name: string;
    email: string;
    numSuccessfulLogins: number;
    numFailedPasswordsSinceLastLogin: number;
  };
}
export interface SessionListReturn {
  activeSessions: number[];
  inactiveSessions: number[];
}
export interface sessionStatusReturn {
  state: string;
  atQuestion: number;
  players: string[];
  metadata: Quiz;
}
export const RESPONSE: ErrorObject | {} | Record<string, never> | GetDetailsReturn | {quizzes: []} |
  {quizzes: QuizIds[]} | {quizId: number} | Quiz | {questionId: number} | {newQuestionId: number} |
  SessionListReturn | SessionId | sessionStatusReturn | SessionResultsReturn | {url: string} |
  {playerId: number} | Status | Question | Message[] = undefined;

//
export interface User {
  email: string;
  password: string;
  pastPasswords: string[];
  name: string;
  authUserId: number;
  numSuccessfulLogins: number;
  numFailedPasswordsSinceLastLogin: number;
  quizIds: QuizIds[];
  trash: QuizIds[];
}


export interface Answer {
  answerId: number;
  answer: string;
  colour: string;
  correct: boolean;
}

export interface Question {
  questionId: number;
  question: string;
  duration: number;
  thumbnailUrl: string;
  points: number;
  answers: Answer[];
}

export interface Quiz {
  quizId: number;
  name: string;
  timeCreated: number;
  timeLastEdited: number;
  description: string;
  numQuestions: number;
  questions: Question[];
  duration: number;
  thumbnailUrl: string;
}

export interface Token {
  sessionId: string;
  authUserId: number;
}

export interface Player {
  name: string;
  playerId: number;
  score: number;
}

export interface Message {
  messageBody: string;
  playerId: number;
  name: string;
  timeSent: number;
}

export enum STATE {
  LOBBY = 'LOBBY',
  QUESTION_COUNTDOWN = 'QUESTION_COUNTDOWN',
  QUESTION_OPEN = 'QUESTION_OPEN',
  QUESTION_CLOSE = 'QUESTION_CLOSE',
  ANSWER_SHOW = 'ANSWER_SHOW',
  FINAL_RESULTS = 'FINAL_RESULTS',
  END = 'END'
}

export enum ACTION {
  NEXT_QUESTION = 'NEXT_QUESTION',
  GO_TO_ANSWER = 'GO_TO_ANSWER',
  GO_TO_FINAL_RESULTS = 'GO_TO_FINAL_RESULTS',
  END = 'END',
  FINISH_COUNTDOWN = 'FINISH_COUNTDOWN'
}
export interface QuestionBreakdown {
  answerId: number;
  playersCorrect: string[];
}
export interface QuestionResult {
  questionId: number;
  questionCorrectBreakdown: QuestionBreakdown[];
  averageAnswerTime: number;
  percentCorrect: number;
  numPlayerAnswers: number;
  numPlayersCorrect: number;
}

export interface Session {
  sessionId: number;
  autoStartNum: number;
  state: string;
  atQuestion: number;
  players: Player[];
  metadata: Quiz;
  questionResults: QuestionResult[];
  messages: Message[];
  currentQuestionOpenTime: number;
}

export interface SessionId {
  sessionId: number;
}

interface TimeOut {
  timeoutId: any;
  sessionId: number;
}

export interface DataStore {
  users: User[];
  quizzes: Quiz[];
  tokens: Token[];
  unclaimedQuestionId: number;
  quizCounter: number;
}

export interface ErrorObject {
  error: string;
}

export interface SessionDataStore {
  sessions: Session[];
  timers: TimeOut[];
}

let sessionData: SessionDataStore = {
  sessions: [],
  timers: []
};

export function getSession(): SessionDataStore {
  return sessionData;
}

export function setSession(newSessions: SessionDataStore) {
  sessionData = newSessions;
}

function setData(data: DataStore) {
  fs.writeFileSync('./dbStore.json', JSON.stringify(data));
}

function getData(): DataStore {
  const dataString = fs.readFileSync('./dbStore.json');
  return JSON.parse(String(dataString));
}

export { getData, setData };
