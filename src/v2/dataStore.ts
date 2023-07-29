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

interface PlayerScore {
  name: string;
  score: number;
}

interface QuestionBreakdown {
  answerId: number;
  playersCorrect: string[];
}
interface QuestionResult {
  questionId: number;
  questionCorrectBreakDown: QuestionBreakdown[];
  averageAnswerTime: number;
  percentCorrect: number;
}

export enum SessionState {
  LOBBY = 'lobby',
  QUESTION_COUNTDOWN = 'question_countdown',
  QUESTION_OPEN = 'question_open',
  QUESTION_CLOSE = 'question_close',
  ANSWER_SHOW = 'answer_show',
  FINAL_RESULTS = 'final_results',
  END = 'end'
}

export interface Session {
  usersRankedByScore: PlayerScore[];
  questionResults: QuestionResult[];
  sessionState: SessionState;
  sessionId: number;
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
