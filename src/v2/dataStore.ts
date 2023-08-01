import fs from 'fs';

export interface QuizIds {
  quizId: number;
  name: string;
}

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
  points: number;
  answers: Answer[];
  thumbnailUrl: string;
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
interface QuestionBreakdown {
  answerId: number;
  playersCorrect: string[];
}
export interface QuestionResult {
  questionId: number;
  questionCorrectBreakDown: QuestionBreakdown[];
  averageAnswerTime: number;
  percentCorrect: number;
}

export interface Session {
  sessionId: number;
  autoStartNum: number;
  sessionState: STATE;
  atQuestion: number;
  players: Player[];
  metadata: Quiz;
  // usersRankedByScore: PlayerScore[];
  questionResults: QuestionResult[];
}

export interface SessionId {
  sessionId: number;
}

export interface DataStore {
  users: User[];
  quizzes: Quiz[];
  tokens: Token[];
  sessions: Session[];
  unclaimedQuestionId: number;
  quizCounter: number;
}

export interface ErrorObject {
  error: string;
}

function setData(data: DataStore) {
  fs.writeFileSync('./dbStore.json', JSON.stringify(data));
}

function getData(): DataStore {
  const dataString = fs.readFileSync('./dbStore.json');
  return JSON.parse(String(dataString));
}

export { getData, setData };
